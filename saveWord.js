document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveWord');
    if (!saveButton) return;

    saveButton.addEventListener('click', async function() {
        try {
            if (typeof PizZip === 'undefined' || typeof docxtemplater === 'undefined') {
                throw new Error("Библиотеки не загружены. Проверьте консоль браузера.");
            }

            const genderInput = document.querySelector('input[name="gender"]:checked');
            const methods = Array.from(document.querySelectorAll('input[name="method"]:checked')).map(el => el.value).join(', ');

            const formData = {
                date: document.getElementById('research-date')?.value || '',
                patientName: document.getElementById('patient-name')?.value || '',
                department: document.getElementById('department')?.value || '',
                gender: genderInput?.value || '',
                birthYear: document.getElementById('birth-year')?.value || '',
                patientCode: document.getElementById('patient-code')?.value || '',
                methods,
                researchFrequency: document.getElementById('research-frequency')?.value || '',
                artifactNotes: document.getElementById('artifact-notes')?.value || '',
                skullShape: document.getElementById('skull-shape')?.value || '',
                cranialSutures: document.getElementById('cranial-sutures')?.value || '',
                skullSymmetry: document.getElementById('skull-symmetry')?.value || '',
                cranialFossa: document.getElementById('cranial-fossa')?.value || '',
                postoperativeChanges: document.getElementById('postoperative-changes')?.value || '',
                differentiation: document.getElementById('differentiation')?.value || '',
                heterotopia: document.getElementById('heterotopia')?.value || '',
                hippocampusSymmetry: document.getElementById('hippocampus-symmetry')?.value || '',
                hippocampusLesions: document.getElementById('hippocampus-lesions')?.value || '',
                parenchymaChanges: document.getElementById('parenchyma-changes')?.value || '',
                liquorSpaces: document.getElementById('liquor-spaces')?.value || '',
                conclusion: document.getElementById('conclusion')?.value || '',
                advice: document.getElementById('advice')?.value || '',
                doctor: document.getElementById('doctor')?.value || ''
            };

            console.log("Form Data:", formData);

            const response = await fetch("template.docx");
            if (!response.ok) throw new Error("Ошибка загрузки шаблона: " + response.status);

            const buffer = await response.arrayBuffer();
            const zip = new PizZip(buffer);

            const doc = new docxtemplater();
            doc.loadZip(zip);

            doc.setData(formData);
            doc.render();

            const out = doc.getZip().generate({ type: "blob" });
            saveAs(out, `report_${new Date().toISOString()}.docx`);

        } catch(error) {
            console.error("Ошибка:", error);
            alert("Ошибка генерации документа: " + error.message);
        }
    });
});
