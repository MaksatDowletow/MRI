document.getElementById("saveWord").addEventListener("click", () => {
    console.log("Docxtemplater:", typeof Docxtemplater);
    if (typeof Docxtemplater === "undefined") {
        console.error("Docxtemplater не загружен!");
        return;
    }

    const content = `
        <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
            <w:body>
                <w:p><w:r><w:t>Senesi: ${document.getElementById("date").value}</w:t></w:r></w:p>
                <w:p><w:r><w:t>Familiýasy, ady: ${document.getElementById("fname").value}</w:t></w:r></w:p>
                <w:p><w:r><w:t>Bölüm: ${document.getElementById("department").value}</w:t></w:r></w:p>
                <w:p><w:r><w:t>Netije: ${document.getElementById("conclusion").value}</w:t></w:r></w:p>
                <w:p><w:r><w:t>Lukman: ${document.getElementById("doctor").value}</w:t></w:r></w:p>
            </w:body>
        </w:document>
    `;

    const zip = new PizZip();
    zip.file("word/document.xml", content);

    try {
        const doc = new window.docxtemplater(zip);
        doc.render();

        const out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        saveAs(out, "MRT_Report.docx");
    } catch (error) {
        console.error("Ошибка при создании документа:", error);
    }
});
