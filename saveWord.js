document.getElementById("saveWord").addEventListener("click", () => {
  const content = document.getElementById("result").innerHTML;

  const doc = new Docxtemplater(new PizZip(), {
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

  new PizZip().file("word/document.xml", template);
  doc.loadZip(new PizZip());

  try {
    doc.render();
  } catch (error) {
    console.error(error);
  }

  const out = doc.getZip().generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  saveAs(out, "document.docx");
});
