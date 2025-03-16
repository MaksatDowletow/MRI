document.getElementById("saveWord").addEventListener("click", async () => {
    // Проверка загрузки библиотеки Docxtemplater
    console.log("Docxtemplater:", typeof Docxtemplater);
    if (typeof Docxtemplater === "undefined") {
        console.error("Docxtemplater не загружен!");
        return;
    }
    try {
        // 1️⃣ Загрузка шаблона DOCX (файл template.docx должен находиться в той же директории)
        const response = await fetch("template.docx");
        const arrayBuffer = await response.arrayBuffer();
        const zip = new PizZip(arrayBuffer);
        
        // 2️⃣ Инициализация Docxtemplater с шаблоном
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        // 3️⃣ Передача данных в шаблон.
        // Убедитесь, что в шаблоне используются плейсхолдеры, например: {date}, {fname}, {department}, {conclusion}, {doctor}
        doc.setData({
            date: document.getElementById("date").value,
            fname: document.getElementById("fname").value,
            department: document.getElementById("department").value,
            conclusion: document.getElementById("conclusion").value,
            doctor: document.getElementById("doctor").value,
        });

        // 4️⃣ Рендеринг документа с подстановкой данных
        doc.render();

        // 5️⃣ Генерация итогового документа в формате Blob
        const out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // 6️⃣ Сохранение файла с помощью FileSaver.js
        saveAs(out, "MRT_Report.docx");
    } catch (error) {
        console.error("Ошибка при создании документа:", error);
    }
});
