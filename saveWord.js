document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveWord');
    if (!saveButton) return;

    saveButton.addEventListener('click', async function() {
        try {
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

            const htmlContent = `<!DOCTYPE html>
                <html lang="tk">
                  <head>
                    <meta charset="UTF-8" />
                    <title>MRT hasabaty</title>
                    <style>
                      body { font-family: 'Arial', sans-serif; line-height: 1.5; }
                      h1 { text-align: center; }
                      .section { margin: 12px 0; }
                      .label { font-weight: bold; }
                    </style>
                  </head>
                  <body>
                    <h1>KELLE BEÝNINIŇ MRT BARLAGY</h1>
                    <div class="section"><span class="label">Barlagyň senesi:</span> ${formData.date}</div>
                    <div class="section"><span class="label">Familiyasy, ady:</span> ${formData.patientName}</div>
                    <div class="section"><span class="label">Bölüm:</span> ${formData.department}</div>
                    <div class="section"><span class="label">Jynsy:</span> ${formData.gender}</div>
                    <div class="section"><span class="label">Doglan ýyly:</span> ${formData.birthYear}</div>
                    <div class="section"><span class="label">Näsagyň kody:</span> ${formData.patientCode}</div>
                    <div class="section"><span class="label">Barlag usuly:</span> ${methods || '—'}</div>
                    <div class="section"><span class="label">Barlagyň gaýtalanmasy:</span> ${formData.researchFrequency}</div>
                    <div class="section"><span class="label">Artefaktlar:</span> ${formData.artifactNotes}</div>
                    <div class="section"><span class="label">Kelle çanagy:</span> ${formData.skullShape}</div>
                    <div class="section"><span class="label">Tikinleri:</span> ${formData.cranialSutures}</div>
                    <div class="section"><span class="label">Simmetriýa:</span> ${formData.skullSymmetry}</div>
                    <div class="section"><span class="label">Kelleçanagyň çukurjuklary:</span> ${formData.cranialFossa}</div>
                    <div class="section"><span class="label">Operasiýadan soňky üýtgemeleri:</span> ${formData.postoperativeChanges}</div>
                    <div class="section"><span class="label">Ak we çal maddanyň differensasiýasy:</span> ${formData.differentiation}</div>
                    <div class="section"><span class="label">Geterotopiýa:</span> ${formData.heterotopia}</div>
                    <div class="section"><span class="label">Gippokamp simmetriýasy:</span> ${formData.hippocampusSymmetry}</div>
                    <div class="section"><span class="label">Gippokampdaky ojaklar:</span> ${formData.hippocampusLesions}</div>
                    <div class="section"><span class="label">Beýni parenhimasynyň ojaklaýyn üýtgemeleri:</span><br/>${formData.parenchymaChanges || '—'}</div>
                    <div class="section"><span class="label">Likwor saklaýan giňişlikler:</span><br/>${formData.liquorSpaces || '—'}</div>
                    <div class="section"><span class="label">Netije:</span><br/>${formData.conclusion}</div>
                    <div class="section"><span class="label">Maslahat:</span><br/>${formData.advice}</div>
                    <div class="section"><span class="label">Lukman:</span> ${formData.doctor}</div>
                  </body>
                </html>`;

            const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword;charset=utf-8' });
            saveAs(blob, `mrt_hasabaty_${new Date().toISOString().slice(0, 10)}.doc`);

        } catch(error) {
            console.error("Ýalňyşlyk:", error);
            alert("Resminama döretmekde ýalňyşlyk: " + error.message);
        }
    });
});
