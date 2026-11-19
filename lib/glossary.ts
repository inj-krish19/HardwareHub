// Plain-English explanations for spec labels and jargon in blog text.
// Keys are matched exactly (case-sensitive) against spec labels, and by
// whole-word search inside blog text via TEXT_TERMS below.

export const SPEC_GLOSSARY: Record<string, string> = {
    "Cores / Threads":
        "Cores are the processor's workers. Threads let each core juggle two jobs at once. More of both helps with multitasking and heavy work.",
    "Base clock": "The speed the processor reliably runs at under normal load.",
    "Max boost clock":
        "The highest speed the processor can briefly reach when it has enough power and cooling to spare.",
    Socket:
        "The shape of the slot the processor plugs into. The processor and the motherboard must use the same socket.",
    "Power (TDP)":
        "A guide to how much heat the processor makes, and so how strong a cooler it needs. Lower usually means cooler and quieter.",
    "Built-in graphics":
        "Lets the processor show a picture on its own, so you can run a PC without a separate graphics card.",
    "Memory support": "Which type of RAM (DDR4 or DDR5) this processor works with.",
    "Cooler included": "Whether a cooler comes in the box, so you can start building without buying one.",
    Generation: "The product family. Newer generations are usually faster and need a matching motherboard.",
    Capacity: "How much it holds. For RAM, how much it can work on at once. For drives, how much you can store.",
    Kit: "How many sticks come in the pack. Two matching sticks work together faster (dual-channel).",
    Type: "The standard it follows. Parts of different types don't fit each other's slots.",
    Speed: "How fast the memory moves data, in MHz. Higher is faster, if your motherboard supports it.",
    "CAS latency":
        "The delay before the memory responds, counted in cycles. A lower number is slightly quicker.",
    Voltage: "The power the part runs at. Use the rated value, since higher can mean more heat.",
    "Heat spreader":
        "A metal cover that helps the memory stay cool. Tall ones may not fit under big processor coolers.",
    Interface: "How the drive connects to the PC. NVMe (over PCIe) is much faster than SATA.",
    "Form factor": "The physical shape and size, which decides where it fits (an M.2 stick or a 2.5-inch drive).",
    "Max read speed": "The fastest the drive can load data, in MB/s. Real-world speeds are usually lower.",
    "Max write speed": "The fastest the drive can save data, in MB/s. Real-world speeds are usually lower.",
    "Endurance (TBW)":
        "Terabytes written: how much data the maker says the drive can write over its life. Home use rarely gets close.",
    Warranty: "How long the maker will repair or replace it if it fails.",
};

// Terms that get a dotted underline and tooltip inside blog paragraphs.
export const TEXT_TERMS: Record<string, string> = {
    BIOS: "The basic settings screen built into your motherboard. You open it by pressing a key like Delete or F2 as the PC starts.",
    XMP: "A setting in the BIOS that makes memory run at its advertised speed instead of a slower default. AMD boards call it DOCP or EXPO.",
    DOCP: "AMD's name for XMP: a BIOS setting that makes memory run at its advertised speed.",
    "dual-channel": "Two matching RAM sticks working together, which is faster than one stick alone.",
    "single-channel": "One RAM stick working alone, which is a little slower than two matching sticks.",
    "CAS latency": SPEC_GLOSSARY["CAS latency"],
    TBW: SPEC_GLOSSARY["Endurance (TBW)"],
    NVMe: "A fast type of SSD that plugs straight into the motherboard, with no cables.",
    SATA: "An older, slower connection used by hard drives and 2.5-inch SSDs. It needs a data cable and a power cable.",
    "M.2": "A small slot on the motherboard where stick-shaped SSDs plug in.",
    PCIe: "The fast connection on the motherboard used by graphics cards and NVMe drives. Newer versions are faster.",
    DDR4: "An older memory standard. DDR4 sticks don't fit DDR5 slots.",
    DDR5: "The newer memory standard. DDR5 sticks don't fit DDR4 slots.",
    AM4: "A processor socket used by AMD's Ryzen 5000 and older chips.",
    AM5: "AMD's newer processor socket. It only works with DDR5 memory.",
    LGA1700: "The processor socket used by Intel's 12th and 13th generation chips.",
    "heat spreader": SPEC_GLOSSARY["Heat spreader"],
};