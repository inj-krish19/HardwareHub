// Copies the files the in-browser photo reader needs from node_modules into public/ocr,
// so your own site serves them (no third-party download at runtime).
//
//   npm install tesseract.js @tesseract.js-data/eng
//   node scripts/copy-ocr-assets.mjs        (also run by "prebuild" and "predev", see README)
//
// About 17 MB land in public/ocr; the browser downloads only the one core it can run (about 4 MB)
// plus the English data (about 3 MB), once, and then keeps them. The folder is not committed.
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const out = join(process.cwd(), "public", "ocr");

function packageDir(name) {
    try {
        return dirname(require.resolve(`${name}/package.json`));
    } catch {
        return null;
    }
}

const tesseract = packageDir("tesseract.js");
const core = packageDir("tesseract.js-core");
const data = packageDir("@tesseract.js-data/eng");

if (!tesseract || !core || !data) {
    console.warn(
        "copy-ocr: tesseract.js, tesseract.js-core or @tesseract.js-data/eng is not installed, so photo reading is switched off.\n" +
        "          Run: npm install tesseract.js @tesseract.js-data/eng"
    );
    process.exit(0); // never break a build because of an optional feature
}

mkdirSync(out, { recursive: true });
const copies = [
    [join(tesseract, "dist", "worker.min.js"), "worker.min.js"],
    [join(data, "4.0.0_best_int", "eng.traineddata.gz"), "eng.traineddata.gz"],
    ...readdirSync(core)
        .filter((f) => /^tesseract-core.*lstm\.wasm\.js$/.test(f)) // the LSTM cores, one per CPU feature level
        .map((f) => [join(core, f), f]),
];
for (const [from, name] of copies) {
    if (!existsSync(from)) {
        console.warn(`copy-ocr: missing ${from}`);
        continue;
    }
    copyFileSync(from, join(out, name));
}
console.log(`copy-ocr: ${copies.length} files copied to public/ocr`);