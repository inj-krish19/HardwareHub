// Reads the text in a photo or screenshot, ON THE PERSON'S DEVICE (tesseract.js, in the browser).
// The picture is never uploaded or stored; only the text they choose to send goes to the chat.
// It is loaded only when someone attaches a photo, so it costs nothing for everyone else.

export const MAX_PHOTO_BYTES = 12 * 1024 * 1024;
export const MAX_SIDE = 1800; // larger photos are shrunk before reading: faster, and it removes camera metadata
export const MAX_TEXT = 500; // what the chat accepts for typed text; photo text is cut to the same size
const TYPES = ["image/png", "image/jpeg", "image/webp", "image/bmp"];

// Where the reader's files are served from. `npm run copy-ocr` puts them in /public/ocr (see scripts/copy-ocr-assets.mjs).
const OCR_BASE = (process.env.NEXT_PUBLIC_OCR_BASE ?? "/ocr").replace(/\/+$/, "");

export function validatePhoto(file: { type: string; size: number }): string | null {
    if (!TYPES.includes(file.type)) return "Please choose a PNG, JPG or WebP picture.";
    if (file.size > MAX_PHOTO_BYTES) return "That picture is too large. Please choose one under 12 MB.";
    if (file.size === 0) return "That picture is empty.";
    return null;
}

/**
 * Tidy the text a reader found: drop lines that are mostly symbols (OCR noise), repeated lines and
 * extra spaces, then fit it into `max` characters. A long screen keeps its start and its end, because
 * an error screen puts the code at the bottom and the description at the top.
 */
export function cleanOcrText(raw: string, max: number = MAX_TEXT): string {
    const lines: string[] = [];
    for (const piece of raw.replace(/\r/g, "").split("\n")) {
        const line = piece.replace(/\s+/g, " ").trim();
        if (!line) continue;
        const letters = (line.match(/[\p{L}\p{N}]/gu) ?? []).length;
        if (letters < 3 || letters / line.length < 0.5) continue; // noise such as "= — |" or "~ . :"
        if (lines[lines.length - 1] === line) continue;
        lines.push(line);
    }
    const text = lines.join("\n");
    if (text.length <= max) return text;
    const head = text.slice(0, Math.floor(max * 0.4));
    const tail = text.slice(text.length - (max - head.length - 5));
    return `${head.replace(/\S*$/, "").trimEnd()} … ${tail.replace(/^\S*\s/, "").trimStart()}`.slice(0, max);
}

async function toCanvasBlob(file: File): Promise<Blob> {
    const bitmap = await createImageBitmap(file); // applies the photo's rotation
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("This browser cannot read pictures.");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not prepare the picture."))), "image/png")
    );
}

export type OcrProgress = { stage: "preparing" | "loading" | "reading"; percent: number };

/** Read the text in a picture. Throws an Error with a message fit to show the person. */
export async function readPhoto(file: File, onProgress?: (p: OcrProgress) => void): Promise<string> {
    const problem = validatePhoto(file);
    if (problem) throw new Error(problem);
    onProgress?.({ stage: "preparing", percent: 2 });
    const image = await toCanvasBlob(file);

    let worker: import("tesseract.js").Worker | null = null;
    try {
        const { createWorker } = await import("tesseract.js");
        onProgress?.({ stage: "loading", percent: 5 });
        worker = await createWorker("eng", 1, {
            workerPath: `${OCR_BASE}/worker.min.js`,
            corePath: OCR_BASE,
            langPath: OCR_BASE,
            logger: (m) => {
                if (m.status === "recognizing text") onProgress?.({ stage: "reading", percent: 30 + Math.round(m.progress * 70) });
                else if (m.status.startsWith("loading")) onProgress?.({ stage: "loading", percent: 5 + Math.round(m.progress * 25) });
            },
        });
        const { data } = await worker.recognize(image);
        const text = cleanOcrText(data.text);
        if (!text) throw new Error("I could not find any readable text in that picture. Try a closer, sharper photo, or type what it says.");
        return text;
    } catch (err) {
        if (err instanceof Error && err.message.startsWith("I could not find")) throw err;
        throw new Error("I could not read that picture here. Please type what it says instead.");
    } finally {
        await worker?.terminate();
    }
}