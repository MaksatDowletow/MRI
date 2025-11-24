document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('research-form');
    const dateInput = document.getElementById('research-date');

    ensureMessageContainer();

    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    if (!form) {
        showError('Forma tapylmady. Sahypany täzeden ýüklemegi synap görüň.');
        return;
    }

    form.addEventListener('submit', event => {
        event.preventDefault();
        renderSummary();
    });
});

function ensureMessageContainer() {
    let container = document.getElementById('messages');

    if (!container) {
        container = document.createElement('div');
        container.id = 'messages';
        container.className = 'messages';
        document.body.prepend(container);
    }

    return container;
}

function clearMessages() {
    const container = ensureMessageContainer();
    container.innerHTML = '';
}

function showError(message) {
    const container = ensureMessageContainer();
    const element = document.createElement('div');
    element.className = 'message error';
    element.textContent = message;
    container.appendChild(element);
}

function getField(id, label) {
    const element = document.getElementById(id);

    if (!element) {
        showError(`${label} elementi tapylmady.`);
    }

    return element;
}

function renderSummary() {
    clearMessages();

    const resultContainer = document.getElementById('result');
    const form = document.getElementById('research-form');

    if (!form) {
        showError('Forma tapylmady, maglumatlary ugratyp bolmaýar.');
        return;
    }

    if (!resultContainer) {
        showError('Netije görkezmek üçin bölüm tapylmady.');
        return;
    }

    const genderOptions = document.querySelectorAll('input[name="gender"]');
    if (!genderOptions.length) {
        showError('Jyns meýdançalary tapylmady.');
        return;
    }

    const methodInputs = document.querySelectorAll('input[name="method"]');
    if (!methodInputs.length) {
        showError('Barlag usullary üçin goýbermeler tapylmady.');
        return;
    }

    const fieldsWithElements = {
        date: getField('research-date', 'Barlagyň senesi'),
        patientName: getField('patient-name', 'Familiýasy, ady'),
        department: getField('department', 'Bölüm'),
        birthYear: getField('birth-year', 'Doglan ýyly'),
        patientCode: getField('patient-code', 'Näsagyň kody'),
        researchFrequency: getField('research-frequency', 'Barlagyň görnüşi'),
        artifactNotes: getField('artifact-notes', 'Artefaktlar'),
        skullShape: getField('skull-shape', 'Kelle çanak'),
        cranialSutures: getField('cranial-sutures', 'Tikinleri'),
        skullSymmetry: getField('skull-symmetry', 'Simmetriýa'),
        cranialFossa: getField('cranial-fossa', 'Kelleçanagyň çukurjuklary'),
        postoperativeChanges: getField('postoperative-changes', 'Operasiýadan soňky üýtgemeler'),
        differentiation: getField('differentiation', 'Ak we çal maddanyň differensasiýasy'),
        heterotopia: getField('heterotopia', 'Geterotopiýa'),
        hippocampusSymmetry: getField('hippocampus-symmetry', 'Gippokamp simmetriýasy'),
        hippocampusLesions: getField('hippocampus-lesions', 'Gippokampdaky ojaklar'),
        parenchymaChanges: getField('parenchyma-changes', 'Beýni parenhimasynyň ojaklaýyn üýtgemeleri'),
        liquorSpaces: getField('liquor-spaces', 'Likwor saklaýan giňişlikler'),
        conclusion: getField('conclusion', 'Netije'),
        advice: getField('advice', 'Maslahat'),
        doctor: getField('doctor', 'Lukman'),
    };

    if (Object.values(fieldsWithElements).some(field => !field)) {
        return;
    }

    const genderInput = document.querySelector('input[name="gender"]:checked');
    const methods = Array.from(methodInputs).filter(input => input.checked).map(({ value }) => value).join(', ');

    const fields = {
        date: fieldsWithElements.date.value,
        patientName: fieldsWithElements.patientName.value.trim(),
        department: fieldsWithElements.department.value.trim(),
        gender: genderInput?.value,
        birthYear: fieldsWithElements.birthYear.value,
        patientCode: fieldsWithElements.patientCode.value.trim(),
        methods,
        researchFrequency: fieldsWithElements.researchFrequency.value,
        artifactNotes: fieldsWithElements.artifactNotes.value,
        skullShape: fieldsWithElements.skullShape.value,
        cranialSutures: fieldsWithElements.cranialSutures.value,
        skullSymmetry: fieldsWithElements.skullSymmetry.value,
        cranialFossa: fieldsWithElements.cranialFossa.value,
        postoperativeChanges: fieldsWithElements.postoperativeChanges.value,
        differentiation: fieldsWithElements.differentiation.value,
        heterotopia: fieldsWithElements.heterotopia.value,
        hippocampusSymmetry: fieldsWithElements.hippocampusSymmetry.value,
        hippocampusLesions: fieldsWithElements.hippocampusLesions.value,
        parenchymaChanges: fieldsWithElements.parenchymaChanges.value.trim(),
        liquorSpaces: fieldsWithElements.liquorSpaces.value.trim(),
        conclusion: fieldsWithElements.conclusion.value.trim(),
        advice: fieldsWithElements.advice.value.trim(),
        doctor: fieldsWithElements.doctor.value.trim(),
    };

    const requiredFields = ['date', 'patientName', 'department', 'gender', 'birthYear', 'conclusion', 'advice', 'doctor'];
    const missing = requiredFields.filter(key => !fields[key]);

    if (missing.length) {
        showError('Ähli zerur meýdançalar dolduryň.');
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

    resultContainer.innerHTML = result;
}
