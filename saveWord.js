document.getElementById('saveWord').addEventListener('click', async function() {
    try {
        // 1. Получаем данные формы
        const formData = {
            date: document.getElementById('date').value,
            fname: document.getElementById('fname').value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            // ... добавьте все остальные поля
        };

        // 2. Загружаем шаблон
        const response = await fetch("template.docx");
        const arrayBuffer = await response.arrayBuffer();
        
        // 3. Инициализируем Pizzip (обратите внимание на две 'p'!)
        const zip = new Pizzip(arrayBuffer);
        
        // 4. Работаем с docxtemplater
        const doc = new docxtemplater();
        doc.loadZip(zip);
        
        // 5. Заполняем шаблон
        doc.setData(formData);
        doc.render();
        
        // 6. Генерируем и сохраняем файл
        const out = doc.getZip().generate({ type: "blob" });
        saveAs(out, `MRI_Report_${new Date().toISOString().slice(0,10)}.docx`);
        
    } catch(error) {
        console.error("Ошибка генерации:", error);
        alert("Невозможно создать документ. Проверьте:\n1. Подключение к интернету\n2. Заполнение всех полей");
    }
});
