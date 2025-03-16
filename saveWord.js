document.getElementById('saveWord').addEventListener('click', async () => {
    try {
        // Проверка наличия Pizzip
        if (typeof Pizzip === 'undefined') {
            throw new Error("Pizzip не загружен! Проверьте подключение скриптов");
        }

        // Данные формы
        const formData = {
            date: document.getElementById('date').value,
            fname: document.getElementById('fname').value,
            department: document.getElementById('department').value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            birthYear: document.getElementById('birthYear').value,
            // ... все остальные поля
        };

        // Загрузка шаблона
        const response = await fetch("template.docx");
        const buffer = await response.arrayBuffer();
        
        // Инициализация Pizzip
        const zip = new Pizzip(buffer); // Именно Pizzip с двумя 'p'!
        
        // Работа с документом
        const doc = new docxtemplater();
        doc.loadZip(zip);
        doc.setData(formData);
        doc.render();
        
        // Сохранение файла
        const blob = doc.getZip().generate({ type: "blob" });
        saveAs(blob, "MRI_Report.docx");
        
    } catch (error) {
        console.error("Фатальная ошибка:", error);
        alert(`Ошибка: ${error.message}`);
    }
});
