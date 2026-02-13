import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

async function resume() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const texPath = path.join(__dirname, "..", "public", "resume.tex");
    const pdfPath = path.join(__dirname, "..", "public", "resume.pdf");
    const content = fs.readFileSync(texPath, "utf-8");
    const response = await fetch("https://latex.ytotech.com/builds/sync", {
        method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({
            compiler: "pdflatex", resources: [{main: true, content}],
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("Resume compilation failed:\n", error);
        process.exit(1);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(pdfPath, buffer);
}

await resume();
