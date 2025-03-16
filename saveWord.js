document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('saveWord').addEventListener('click', async function() {
        try {
            // Проверка загрузки библиотек
            if (typeof PizZip === 'undefined' || typeof docxtemplater === 'undefined') {
                throw new Error("Библиотеки не загружены. Проверьте консоль браузера.");
            }

            // Сбор данных формы
            const formData = {
                date: document.getElementById('date').value,
                fname: document.getElementById('fname').value,
                department: document.getElementById('department').value,
                gender: document.querySelector('input[name="gender"]:checked').value,
                birthYear: document.getElementById('birthYear').value,
                code: document.getElementById('code').value,
                brainImage: document.getElementById('brainImage').value,
                differentiation: document.getElementById('differentiation').value,
                changes: document.getElementById('changes').value,
                liquorSpaces: document.getElementById('liquorSpaces').value,
                conclusion: document.getElementById('conclusion').value,
                advice: document.getElementById('advice').value,
                doctor: document.getElementById('doctor').value,
                methods: Array.from(document.querySelectorAll('input[name="method"]:checked')).map(el => el.value).join(', '),
                artifacts: document.querySelector('input[name="artifacts"]:checked')?.value || 'Не указано'
            };

            // Логирование данных для отладки
            console.log("Form Data:", formData);

            // Загрузка шаблона
            const response = await fetch("template.docx");
            if (!response.ok) throw new Error("Ошибка загрузки шаблона: " + response.status);
            
            const buffer = await response.arrayBuffer();
            const zip = new PizZip(buffer);
            
            const doc = new docxtemplater();
            doc.loadZip(zip);
            
            doc.setData(formData);
            doc.render(); // Если есть ошибки рендеринга, они появятся здесь
            
            const out = doc.getZip().generate({ type: "blob" });
            saveAs(out, "report_${new Date().toISOString()}.docx");

        } catch(error) {
            console.error("Ошибка:", error);
            alert("Ошибка генерации документа: " + error.message);
        }
    });
});
