document.getElementById('saveWord').addEventListener('click', async function() {
    try {
        // Получаем данные формы
        const formData = {
            date: document.getElementById('date').value,
            fname: document.getElementById('fname').value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            // ... добавьте все остальные поля
        };

        // Загружаем шаблон
        const response = await fetch("template.docx");
        const arrayBuffer = await response.arrayBuffer();
        
        // Инициализируем PizZip
        const zip = new PizZip(arrayBuffer);
        
        // Создаем документ
        const doc = new docxtemplater();
        doc.loadZip(zip);
        
        // Заменяем данные
        doc.setData(formData);
        doc.render();
        
        // Генерируем файл
        const out = doc.getZip().generate({ type: "blob" });
        saveAs(out, `report_${Date.now()}.docx`);
        
    } catch(error) {
        console.error("Ошибка генерации документа:", error);
        alert("Ошибка! Подробности в консоли.");
    }
});
