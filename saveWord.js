document.getElementById('saveWord').addEventListener('click', async function() {
    try {
        // Получение данных формы
        const formData = {
            date: document.getElementById('date').value,
            fname: document.getElementById('fname').value,
            department: document.getElementById('department').value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            // ... добавьте все остальные поля формы
        };

        // Загрузка и обработка шаблона
        const response = await fetch("template.docx");
        const buffer = await response.arrayBuffer();
        
        // Асинхронная загрузка ZIP-архива
        const zip = await JSZip.loadAsync(buffer);
        
        // Инициализация docxtemplater
        const doc = new docxtemplater().loadZip(zip);
        
        // Замена данных в шаблоне
        doc.setData(formData);
        doc.render();
        
        // Генерация и сохранение файла
        const out = doc.getZip().generate({ type: "blob" });
        saveAs(out, "report_" + Date.now() + ".docx");
        
    } catch(error) {
        console.error("Произошла ошибка:", error);
        alert("Ошибка при генерации документа! Проверьте консоль для деталей.");
    }
});
