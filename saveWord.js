document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('saveWord').addEventListener('click', async function() {
        try {
            // Проверка загрузки PizZip
            if (typeof PizZip === 'undefined') {
                throw new Error("PizZip не загружен. Проверьте:\n1. Блокировку CDN\n2. Интернет-соединение\n3. Консоль браузера");
            }

            // Получение данных формы
            const formData = {
                date: document.getElementById('date').value,
                fname: document.getElementById('fname').value,
                department: document.getElementById('department').value,
                gender: document.querySelector('input[name="gender"]:checked').value,
                // ... остальные поля
            };

            // Загрузка шаблона
            const response = await fetch("template.docx");
            if (!response.ok) throw new Error("Ошибка загрузки шаблона: " + response.status);
            
            const buffer = await response.arrayBuffer();
            const zip = new PizZip(buffer);
            
            const doc = new docxtemplater();
            doc.loadZip(zip);
            
            doc.setData(formData);
            doc.render();
            
            const out = doc.getZip().generate({ type: "blob" });
            saveAs(out, "report.docx");

        } catch(error) {
            console.error("Ошибка:", error);
            alert(error.message);
        }
    });
});
