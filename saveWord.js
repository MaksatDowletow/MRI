document.getElementById('saveWord').addEventListener('click', function() {
    // Получение данных из формы
    const formData = {
        date: document.getElementById('date').value,
        fname: document.getElementById('fname').value,
        // ... остальные поля
    };

    // Загрузка шаблона
    fetch("template.docx")
        .then(response => response.arrayBuffer())
        .then(buffer => {
            const zip = new JSZip();
            zip.load(buffer);
            const doc = new docxtemplater().loadZip(zip);
            
            // Замена данных в шаблоне
            doc.setData(formData);
            
            try {
                doc.render();
                const out = doc.getZip().generate({ type: "blob" });
                saveAs(out, "report.docx");
            } catch(error) {
                console.error("Ошибка генерации документа:", error);
            }
        })
        .catch(error => console.error("Ошибка загрузки шаблона:", error));
});
