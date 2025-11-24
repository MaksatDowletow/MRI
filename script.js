document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('research-form');
    const dateInput = document.getElementById('research-date');

    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    if (!form) return;

    form.addEventListener('submit', event => {
        event.preventDefault();
        renderSummary();
    });
});

function renderSummary() {
    const genderInput = document.querySelector('input[name="gender"]:checked');
    const methods = Array.from(document.querySelectorAll('input[name="method"]:checked')).map(({ value }) => value).join(', ');

    const fields = {
        date: document.getElementById('research-date')?.value,
        patientName: document.getElementById('patient-name')?.value.trim(),
        department: document.getElementById('department')?.value.trim(),
        gender: genderInput?.value,
        birthYear: document.getElementById('birth-year')?.value,
        patientCode: document.getElementById('patient-code')?.value.trim(),
        methods,
        researchFrequency: document.getElementById('research-frequency')?.value,
        artifactNotes: document.getElementById('artifact-notes')?.value,
        skullShape: document.getElementById('skull-shape')?.value,
        cranialSutures: document.getElementById('cranial-sutures')?.value,
        skullSymmetry: document.getElementById('skull-symmetry')?.value,
        cranialFossa: document.getElementById('cranial-fossa')?.value,
        postoperativeChanges: document.getElementById('postoperative-changes')?.value,
        differentiation: document.getElementById('differentiation')?.value,
        heterotopia: document.getElementById('heterotopia')?.value,
        hippocampusSymmetry: document.getElementById('hippocampus-symmetry')?.value,
        hippocampusLesions: document.getElementById('hippocampus-lesions')?.value,
        parenchymaChanges: document.getElementById('parenchyma-changes')?.value.trim(),
        liquorSpaces: document.getElementById('liquor-spaces')?.value.trim(),
        conclusion: document.getElementById('conclusion')?.value.trim(),
        advice: document.getElementById('advice')?.value.trim(),
        doctor: document.getElementById('doctor')?.value.trim(),
    };

    const requiredFields = ['date', 'patientName', 'department', 'gender', 'birthYear', 'conclusion', 'advice', 'doctor'];
    const missing = requiredFields.filter(key => !fields[key]);

    if (missing.length) {
        alert('Ähli zerur meýdançalar dolduryň.');
        return;
    }

    const result = `
        <h3>Umumy maglumatlar</h3>
        <ul>
          <li><strong>Senesi:</strong> ${fields.date}</li>
          <li><strong>Familiyasy, ady:</strong> ${fields.patientName}</li>
          <li><strong>Bölüm:</strong> ${fields.department}</li>
          <li><strong>Jynsy:</strong> ${fields.gender}</li>
          <li><strong>Doglan ýyly:</strong> ${fields.birthYear}</li>
          <li><strong>Näsagyň kody:</strong> ${fields.patientCode || '—'}</li>
          <li><strong>Barlag usuly:</strong> ${fields.methods || 'Saýlanmady'}</li>
          <li><strong>Barlagyň görnüşi:</strong> ${fields.researchFrequency}</li>
          <li><strong>Artefaktlar:</strong> ${fields.artifactNotes}</li>
        </ul>
        <h3>Protokol</h3>
        <ul>
          <li><strong>Kelle çanak:</strong> ${fields.skullShape}</li>
          <li><strong>Tikinleri:</strong> ${fields.cranialSutures}</li>
          <li><strong>Simmetriýa:</strong> ${fields.skullSymmetry}</li>
          <li><strong>Kelleçanagyň çukurjuklary:</strong> ${fields.cranialFossa}</li>
          <li><strong>Operasiýadan soňky üýtgemeler:</strong> ${fields.postoperativeChanges}</li>
          <li><strong>Ak we çal maddanyň differensasiýasy:</strong> ${fields.differentiation}</li>
          <li><strong>Geterotopiýa:</strong> ${fields.heterotopia}</li>
          <li><strong>Gippokamp simmetriýasy:</strong> ${fields.hippocampusSymmetry}</li>
          <li><strong>Gippokampdaky ojaklar:</strong> ${fields.hippocampusLesions}</li>
          ${fields.parenchymaChanges ? `<li><strong>Beýni parenhimasynyň ojaklaýyn üýtgemeleri:</strong> ${fields.parenchymaChanges}</li>` : ''}
          ${fields.liquorSpaces ? `<li><strong>Likwor saklaýan giňişlikler:</strong> ${fields.liquorSpaces}</li>` : ''}
        </ul>
        <h3>Netije we maslahat</h3>
        <ul>
          <li><strong>Netije:</strong> ${fields.conclusion}</li>
          <li><strong>Maslahat:</strong> ${fields.advice}</li>
          <li><strong>Lukman:</strong> ${fields.doctor}</li>
        </ul>
    `;

    const resultContainer = document.getElementById('result');
    if (resultContainer) {
        resultContainer.innerHTML = result;
    }
}
