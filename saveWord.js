document.getElementById("saveWord").addEventListener("click", () => {
    const content = `
        <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
            <w:body>
                <w:p>
                    <w:r>
                        <w:t>${document.getElementById("date").value}</w:t>
                    </w:r>
                </w:p>
                <w:p>
                    <w:r>
                        <w:t>${document.getElementById("fname").value}</w:t>
                    </w:r>
                </w:p>
                <w:p>
                    <w:r>
                        <w:t>${document.getElementById("department").value}</w:t>
                    </w:r>
                </w:p>
                <w:p>
                    <w:r>
                        <w:t>${document.getElementById("conclusion").value}</w:t>
                    </w:r>
                </w:p>
                <w:p>
                    <w:r>
                        <w:t>${document.getElementById("doctor").value}</w:t>
                    </w:r>
                </w:p>
            </w:body>
        </w:document>
    `;

    const zip = new PizZip();
    zip.file("word/document.xml", content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    try {
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
