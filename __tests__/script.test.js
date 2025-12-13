const { describe, it, beforeEach } = require('node:test');
const assert = require('assert');
const { createTestDOM } = require('./helpers/simpleDom');

function setupForm(document) {
  const form = document.createElement('form');
  form.id = 'research-form';
  document.body.appendChild(form);

  const result = document.createElement('div');
  result.id = 'result';
  document.body.appendChild(result);

  const copyButton = document.createElement('button');
  copyButton.id = 'copyReport';
  copyButton.disabled = true;
  document.body.appendChild(copyButton);

  const templateButton = document.createElement('button');
  templateButton.id = 'fillTemplate';
  document.body.appendChild(templateButton);

  const profilePicker = document.createElement('select');
  profilePicker.id = 'profile-picker';
  document.body.appendChild(profilePicker);

  const applyProfileButton = document.createElement('button');
  applyProfileButton.id = 'applyProfile';
  document.body.appendChild(applyProfileButton);

  const profileNote = document.createElement('div');
  profileNote.id = 'profile-note';
  document.body.appendChild(profileNote);

  const fields = [
    'research-date',
    'patient-name',
    'department',
    'birth-year',
    'patient-code',
    'research-frequency',
    'artifact-notes',
    'skull-shape',
    'cranial-sutures',
    'skull-symmetry',
    'cranial-fossa',
    'postoperative-changes',
    'differentiation',
    'heterotopia',
    'hippocampus-symmetry',
    'hippocampus-lesions',
    'slice-planes',
    'parenchyma-changes',
    'liquor-spaces',
    'conclusion',
    'advice',
    'doctor',
  ];

  fields.forEach(id => {
    const wrapper = document.createElement('div');
    wrapper.className = 'field-group';
    const input = document.createElement('input');
    input.id = id;
    wrapper.appendChild(input);
    form.appendChild(wrapper);
  });

  const genderWrapper = document.createElement('div');
  const male = document.createElement('input');
  male.setAttribute('type', 'radio');
  male.setAttribute('name', 'gender');
  male.setAttribute('value', 'Erkek');
  male.value = 'Erkek';
  const female = document.createElement('input');
  female.setAttribute('type', 'radio');
  female.setAttribute('name', 'gender');
  female.setAttribute('value', 'Aýal');
  female.value = 'Aýal';
  genderWrapper.appendChild(male);
  genderWrapper.appendChild(female);
  form.appendChild(genderWrapper);

  const methodOne = document.createElement('input');
  methodOne.setAttribute('type', 'checkbox');
  methodOne.setAttribute('name', 'method');
  methodOne.value = 'Umumy';
  const methodTwo = document.createElement('input');
  methodTwo.setAttribute('type', 'checkbox');
  methodTwo.setAttribute('name', 'method');
  methodTwo.value = 'T1';
  form.appendChild(methodOne);
  form.appendChild(methodTwo);
}

function fillRequiredFields(document) {
  document.getElementById('research-date').value = '2025-12-11';
  document.getElementById('patient-name').value = 'Amanow Aman';
  document.getElementById('department').value = 'Nevrologiýa';
  document.getElementById('birth-year').value = '1990';
  document.getElementById('patient-code').value = 'ABC-123';
  document.getElementById('research-frequency').value = 'Ilkinji gezek.';
  document.getElementById('artifact-notes').value = 'Artefaktlar ýok.';
  document.getElementById('skull-shape').value = 'Mezosefal tipli.';
  document.getElementById('cranial-sutures').value = 'kadaly ýagdaýda.';
  document.getElementById('skull-symmetry').value = 'Simmetrik.';
  document.getElementById('cranial-fossa').value = 'Kadaly.';
  document.getElementById('postoperative-changes').value = 'ýok.';
  document.getElementById('differentiation').value = 'aýdyň.';
  document.getElementById('heterotopia').value = 'bellenmeýar.';
  document.getElementById('hippocampus-symmetry').value = 'Simmetrik.';
  document.getElementById('hippocampus-lesions').value = 'ojak ýok.';
  document.getElementById('slice-planes').value = 'tra, sag, cor kesimlerde';
  document.getElementById('parenchyma-changes').value = 'Üýtgeşme anyklanmaýar';
  document.getElementById('liquor-spaces').value = 'Kadaly giňişlikler';
  document.getElementById('conclusion').value = 'Netije ýazgysy';
  document.getElementById('advice').value = 'Maslahat ýazgysy';
  document.getElementById('doctor').value = 'Lukman';

  const gender = document.querySelector('input[name="gender"]');
  if (gender) {
    gender.checked = true;
  }

  const method = document.querySelector('input[name="method"]');
  if (method) {
    method.checked = true;
  }
}

function loadScript() {
  delete require.cache[require.resolve('../script')];
  return require('../script');
}

describe('renderSummary and copyReport', () => {
  let document;
  let window;
  let script;

  beforeEach(() => {
    ({ document, window } = createTestDOM());
    global.document = document;
    global.window = window;
    global.navigator = { clipboard: { writeText: async () => {} } };

    setupForm(document);
    script = loadScript();
  });

  it('marks missing required fields and avoids rendering a summary', () => {
    const copyButton = document.getElementById('copyReport');
    copyButton.disabled = true;

    script.renderSummary();

    const errorFields = document.querySelectorAll('.field-error');
    assert.ok(errorFields.length >= 8, 'Required fields should be marked as errors');

    const ariaInvalid = document.querySelectorAll('[aria-invalid="true"]');
    assert.ok(ariaInvalid.length >= 7, 'Inputs should include aria-invalid for missing values');

    const resultContainer = document.getElementById('result');
    assert.strictEqual(resultContainer.innerHTML, '');
    assert.strictEqual(copyButton.disabled, true);

    const messages = document.querySelectorAll('.message.error');
    assert.ok(messages.length > 0, 'Error message should be displayed');
  });

  it('renders summary and copies the report when fields are filled', async () => {
    fillRequiredFields(document);
    const copyButton = document.getElementById('copyReport');
    copyButton.disabled = true;

    script.renderSummary();

    const resultContainer = document.getElementById('result');
    assert.ok(resultContainer.innerHTML.includes('Umumy maglumatlar'));
    assert.strictEqual(copyButton.disabled, false);

    let copiedText = '';
    global.navigator.clipboard = {
      writeText: async text => {
        copiedText = text;
      },
    };

    await script.copyReport();

    assert.ok(copiedText.includes('Amanow Aman'));
    assert.ok(copiedText.includes('Netije ýazgysy'));

    const successMessages = document.querySelectorAll('.message.success');
    assert.ok(successMessages.length > 0, 'Copy success message should be shown');
  });
});
