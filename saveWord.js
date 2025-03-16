import PizZip from "./pizzip.min.js";
import Docxtemplater from "./docxtemplater.min.js";
import { saveAs } from "./FileSaver.min.js"; // Измените путь к FileSaver при необходимости

document.getElementById("saveWord").addEventListener("click", () => {
    const content = document.getElementById("result").innerHTML;

    const zip = new PizZip();
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    const template = `
        <html>
            <head>
                <meta charset="utf-8">
            </head>
            <body>
                ${content}
            </body>
        </html>
    `;

    zip.file("word/document.xml", template);
    doc.loadZip(zip);

    try {
        doc.render();
    } catch (error) {
        console.error(error);
    }

    const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    saveAs(out, "document.docx");
});
