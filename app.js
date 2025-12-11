const CLINICAL_PROFILES = {
  kadaly: {
    label: 'Kadaly MRT (profilaktika)',
    description: 'Kadaly profil: anyk ojak ýok, artefaktlar ýok, standart kesimlerde doly protokol.',
    defaults: {
      methods: ['methodGeneral', 'methodT1', 'methodT2', 'methodT2Tirm', 'methodDiffuz', 'methodAngiography'],
      examType: 'first',
      artifacts: 'none',
      sliceDirection: 'tra, sag, cor kesimlerde.',
    },
  },
  dyscirculatory: {
    label: 'Diskirkulýator ojakly',
    description: '',
    defaults: {},
  },
  postoperative: {
    label: 'Operasiýadan soňky gözegçilik',
    description: '',
    defaults: {},
  },
};

const DRAFT_STORAGE_KEY = 'mri_brain_rsna_draft';

function renderForm() {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  const today = new Date().toISOString().split('T')[0];

  appRoot.innerHTML = `
    <form id="reportForm">
      <div id="draftStatus" class="draft-status" hidden aria-live="polite"></div>
      <section class="card card-profile">
        <div class="card-profile__header">
          <div>
            <h2>Auto Intake</h2>
            <p class="card-description">Profil saýlap, meýdançalary awtomatiki dolduryň</p>
          </div>
          <div class="form-row card-profile__control">
            <label>
              Kliniki profil
              <select name="clinicalProfile" aria-label="Kliniki profil">
                <option value="">Profil saýlaň</option>
                ${Object.entries(CLINICAL_PROFILES)
                  .map(([key, profile]) => `<option value="${key}">${profile.label}</option>`)
                  .join('')}
              </select>
            </label>
          </div>
        </div>
        <p class="card-note">${CLINICAL_PROFILES.kadaly.description}</p>
      </section>

      <section class="card section-general">
        <h2>Umumy maglumatlar</h2>
        <div class="form-row">
          <label>
            Barlagyň senesi ?
            <input type="date" name="examDate" data-label-tm="Barlagyň senesi ?" value="${today}" />
          </label>
        </div>
        <div class="form-row">
          <label>
            Familiyasy, ady ?
            <input type="text" name="patientName" data-label-tm="Familiyasy, ady ?" />
          </label>
        </div>
        <div class="form-row">
          <label>
            Bölüm ?
            <input type="text" name="department" data-label-tm="Bölüm ?" />
          </label>
        </div>
        <div class="form-row">
          <span data-label-tm="Jynsy">Jynsy</span>
          <div class="options-group" role="group" aria-label="Jynsy">
            <label class="option-item">
              <input type="radio" name="gender" value="erkek" data-label-tm="Jynsy" />
              <span>Erkek</span>
            </label>
            <label class="option-item">
              <input type="radio" name="gender" value="ayal" data-label-tm="Jynsy" />
              <span>Aýal</span>
            </label>
          </div>
        </div>
        <div class="form-row">
          <label>
            Doglan ýyly ?
            <input type="date" name="birthDate" data-label-tm="Doglan ýyly ?" />
          </label>
        </div>
        <div class="form-row">
          <label>
            Näsagyň kody ?
            <input type="text" name="patientCode" data-label-tm="Näsagyň kody ?" />
          </label>
        </div>
      </section>

      <section class="card section-flow">
        <h2>Barlag akymy</h2>
        <div class="form-row">
          <span data-label-tm="Barlag usuly">Barlag usuly</span>
          <div class="options-group" role="group" aria-label="Barlag usuly">
            <label class="option-item">
              <input type="checkbox" name="methodGeneral" data-label-tm="Barlag usuly" />
              <span>Umumy</span>
            </label>
            <label class="option-item">
              <input type="checkbox" name="methodT1" data-label-tm="Barlag usuly" />
              <span>T1</span>
            </label>
            <label class="option-item">
              <input type="checkbox" name="methodT2" data-label-tm="Barlag usuly" />
              <span>T2</span>
            </label>
            <label class="option-item">
              <input type="checkbox" name="methodT2Tirm" data-label-tm="Barlag usuly" />
              <span>T2_tirm</span>
            </label>
            <label class="option-item">
              <input type="checkbox" name="methodDiffuz" data-label-tm="Barlag usuly" />
              <span>Diffuz</span>
            </label>
            <label class="option-item">
              <input type="checkbox" name="methodAngiography" data-label-tm="Barlag usuly" />
              <span>MRT angiografiýa</span>
            </label>
            <label class="option-item">
              <input type="checkbox" name="methodFlair" data-label-tm="Barlag usuly" />
              <span>FLAIR</span>
            </label>
          </div>
        </div>
        <div class="form-row">
          <label>
            Barlag ?
            <select name="examType" data-label-tm="Barlag ?">
              <option value="first">Ilkinji gezek.</option>
              <option value="repeat">Gaýtadan gözegçilik.</option>
            </select>
          </label>
        </div>
        <div class="form-row">
          <label>
            Artefaktlar ?
            <select name="artifacts" data-label-tm="Artefaktlar ?">
              <option value="none">Artefaktlar ýok.</option>
              <option value="minor">Az artefaktlar.</option>
              <option value="significant">Ep-esli artefaktlar.</option>
            </select>
          </label>
        </div>
        <div class="form-row">
          <label>
            Kesim ugry ?
            <input type="text" name="sliceDirection" data-label-tm="Kesim ugry ?" placeholder="mysal: tra, sag, cor kesimlerde" />
          </label>
        </div>
      </section>

      <section class="card section-structures">
        <h2>Gurluşlar we simmetriýa</h2>
        <div class="form-row">
          <label>
            Kelle çanak:
            <select name="skullShape" data-label-tm="Kelle çanak:">
              <option value="Mezosefal tipli." selected>Mezosefal tipli.</option>
              <option value="Dolihosefal tipli.">Dolihosefal tipli.</option>
              <option value="Brahisefal tipli.">Brahisefal tipli.</option>
            </select>
          </label>
        </div>
        <div class="form-row">
          <label>
            Tikinleri:
            <select name="sutures" data-label-tm="Tikinleri:">
              <option value="kadaly ýagdaýda." selected>kadaly ýagdaýda.</option>
              <option value="synostoz alamatly.">synostoz alamatly.</option>
            </select>
          </label>
        </div>
        <div class="form-row">
          <label>
            Simmetriýa:
            <select name="symmetry" data-label-tm="Simmetriýa:">
              <option value="Simmetrik." selected>Simmetrik.</option>
              <option value="Asimmetrik.">Asimmetrik.</option>
            </select>
          </label>
        </div>
        <div class="form-row">
          <label>
            Kelleçanagyň çukurjuklary:
            <textarea name="cranialFossa" data-label-tm="Kelleçanagyň çukurjuklary:" rows="3">Kadaly.</textarea>
          </label>
        </div>
        <div class="form-row">
          <label>
            Operasiýadan soňky üýtgemeleri:
            <select name="postoperativeChanges" data-label-tm="Operasiýadan soňky üýtgemeleri:">
              <option value="ýok." selected>ýok.</option>
              <option value="bar (şu ýerde beýan ediň).">bar (şu ýerde beýan ediň).</option>
            </select>
          </label>
          <div class="conditional-field" data-related="postoperativeChanges" hidden>
            <label class="nested-field">
              <span>Giňişleýin beýan</span>
              <textarea name="postoperativeChangesDetails" data-label-tm="Operasiýadan soňky üýtgemeleri (beýan)" rows="3"></textarea>
            </label>
          </div>
        </div>
        <div class="form-row">
          <label>
            Ak we çal maddanyň differensasiýasy:
            <textarea name="whiteGrayMatterDifferentiation" data-label-tm="Ak we çal maddanyň differensasiýasy:" rows="3">aýdyň. Ojaklaýyn üýtgemeleri bellenmeýär.</textarea>
          </label>
        </div>
        <div class="form-row">
          <label>
            Geterotopiýa:
            <select name="heterotopia" data-label-tm="Geterotopiýa:">
              <option value="bellenmeýar." selected>bellenmeýar.</option>
              <option value="bar (şu ýerde beýan ediň).">bar (şu ýerde beýan ediň).</option>
            </select>
          </label>
          <div class="conditional-field" data-related="heterotopia" hidden>
            <label class="nested-field">
              <span>Giňişleýin beýan</span>
              <textarea name="heterotopiaDetails" data-label-tm="Geterotopiýa (beýan)" rows="3"></textarea>
            </label>
          </div>
        </div>
        <div class="form-row">
          <label>
            Gippokamp simmetriýasy:
            <select name="hippocampalSymmetry" data-label-tm="Gippokamp simmetriýasy:">
              <option value="Simmetrik." selected>Simmetrik.</option>
              <option value="Asimmetrik.">Asimmetrik.</option>
            </select>
          </label>
        </div>
        <div class="form-row">
          <label>
            Gippokampdaky ojaklar:
            <textarea name="hippocampalFoci" data-label-tm="Gippokampdaky ojaklar:" rows="3">ojaklaýyn üýtgeşme ýok.</textarea>
          </label>
        </div>
        <div class="form-row">
          <label>
            Beýni parenhimasynyň ojaklaýyn üýtgemeleri:
            <textarea name="parenchymaLesions" data-label-tm="Beýni parenhimasynyň ojaklaýyn üýtgemeleri:" rows="3"></textarea>
          </label>
        </div>
      </section>

      <section class="card section-outcome">
        <h2>Netije we maslahat</h2>
        <div class="form-row">
          <label>
            Netije ?
            <textarea name="netije" data-label-tm="Netije ?" rows="3"></textarea>
          </label>
        </div>
        <div class="form-row">
          <label>
            Maslahat ?
            <textarea name="maslahat" data-label-tm="Maslahat ?" rows="3"></textarea>
          </label>
        </div>
        <div class="form-row">
          <label>
            Lukman ?
            <input type="text" name="doctorName" data-label-tm="Lukman ?" />
          </label>
        </div>
        <div class="action-buttons" role="group" aria-label="Hasabat amallary">
          <button type="button" id="btn-generate-report">Hasabat döret</button>
          <button type="button" id="btn-fill-rsna">RSNA şablonyny doldur</button>
          <button type="button" id="btn-export-docx">Word görnüşde ýükle</button>
          <button type="button" id="btn-copy-text">Nusgany göçür</button>
          <button type="button" id="btn-reset-draft">Arassala / Täze hasabat</button>
        </div>
      </section>

      <section id="reportPreview" class="card report-preview" hidden>
        <div class="report-preview__header">
          <h2>Hasabat deslapky görnüşi</h2>
          <p>RSNA stili boýunça taýýarlanan tekst.</p>
        </div>
        <pre id="reportPreviewContent"></pre>
      </section>
    </form>
  `;

  setupClinicalProfiles(appRoot);
  setupConditionalFields(appRoot);
  setupReportActions(appRoot);
  setupAutosave(appRoot);
  restoreDraftIfAvailable(appRoot);
}

function applyClinicalProfile(profileKey, root) {
  const profile = CLINICAL_PROFILES[profileKey];

  if (!profile || !profile.defaults) return;

  const { methods = [], examType, artifacts, sliceDirection } = profile.defaults;

  const methodCheckboxes = root.querySelectorAll('input[type="checkbox"][name^="method"]');

  methodCheckboxes.forEach((checkbox) => {
    const shouldCheck = methods.includes(checkbox.name);
    checkbox.checked = shouldCheck;
  });

  const updateFieldValue = (selector, value) => {
    if (!value) return;
    const field = root.querySelector(selector);
    if (!field) return;
    field.value = value;
  };

  updateFieldValue('select[name="examType"]', examType);
  updateFieldValue('select[name="artifacts"]', artifacts);
  updateFieldValue('input[name="sliceDirection"]', sliceDirection);
}

function setupClinicalProfiles(root) {
  const select = root.querySelector('select[name="clinicalProfile"]');
  if (!select) return;

  select.addEventListener('change', () => {
    applyClinicalProfile(select.value, root);
  });
}

function setupConditionalFields(root) {
  const conditionalConfigs = [
    {
      selectName: 'postoperativeChanges',
      triggerValue: 'bar (şu ýerde beýan ediň).',
      relatedSelector: '[data-related="postoperativeChanges"]',
    },
    {
      selectName: 'heterotopia',
      triggerValue: 'bar (şu ýerde beýan ediň).',
      relatedSelector: '[data-related="heterotopia"]',
    },
  ];

  conditionalConfigs.forEach(({ selectName, triggerValue, relatedSelector }) => {
    const selectEl = root.querySelector(`select[name="${selectName}"]`);
    const relatedField = root.querySelector(relatedSelector);

    if (!selectEl || !relatedField) return;

    const toggleField = () => {
      const shouldShow = selectEl.value === triggerValue;
      relatedField.hidden = !shouldShow;
    };

    selectEl.addEventListener('change', toggleField);
    toggleField();
  });
}

function updateDraftStatus(message, type = 'autosaved') {
  const statusEl = document.getElementById('draftStatus');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.hidden = !message;
  statusEl.classList.toggle('is-restored', type === 'restored');
}

function saveDraft(reportData) {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(reportData));
    updateDraftStatus('Draft autosaved', 'autosaved');
  } catch (error) {
    console.error('Draft saklanylanda ýalňyşlyk boldy', error);
  }
}

function fillFormWithData(data, root) {
  const form = root.querySelector('#reportForm');
  if (!form || !data) return;

  const elements = form.querySelectorAll('input[name], select[name], textarea[name]');

  elements.forEach((el) => {
    const { name, type } = el;
    const value = data[name];

    if (value === undefined) return;

    if (type === 'checkbox') {
      el.checked = Boolean(value);
      return;
    }

    if (type === 'radio') {
      el.checked = value === el.value;
      return;
    }

    el.value = value;
  });

  const changeTargets = form.querySelectorAll('select[name], input[type="radio"], input[type="checkbox"]');
  changeTargets.forEach((el) => {
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

function restoreDraftIfAvailable(root) {
  const rawDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
  if (!rawDraft) return;

  try {
    const parsedDraft = JSON.parse(rawDraft);
    const shouldRestore = confirm('Saklanan taslama tapyldy. Dikeltmek isleýärsiňizmi?');

    if (shouldRestore) {
      fillFormWithData(parsedDraft, root);
      updateDraftStatus('DRAFT dikeldildi', 'restored');
    }
  } catch (error) {
    console.error('Taslama maglumatlaryny dikeltmek başartmady', error);
  }
}

function setupAutosave(root) {
  const form = root.querySelector('#reportForm');
  if (!form) return;

  const handleDraftSave = () => {
    const reportData = collectFormData();
    saveDraft(reportData);
  };

  form.addEventListener('input', handleDraftSave);
  form.addEventListener('change', handleDraftSave);
}

function buildDocxTemplateData(reportData) {
  const methodLabels = {
    methodGeneral: 'Umumy',
    methodT1: 'T1',
    methodT2: 'T2',
    methodT2Tirm: 'T2_tirm',
    methodDiffuz: 'Diffuz',
    methodAngiography: 'MRT angiografiýa',
    methodFlair: 'FLAIR',
  };

  const selectedMethods = Object.entries(methodLabels)
    .filter(([key]) => reportData[key])
    .map(([, label]) => label)
    .join(', ');

  const examTypeMap = {
    first: 'Ilkinji gezek.',
    repeat: 'Gaýtadan gözegçilik.',
  };

  const artifactsMap = {
    none: 'Artefaktlar ýok.',
    minor: 'Az artefaktlar.',
    significant: 'Ep-esli artefaktlar.',
  };

  return {
    ...reportData,
    methods: selectedMethods || 'Saýlanmady.',
    examType: examTypeMap[reportData.examType] || reportData.examType || '-',
    artifacts: artifactsMap[reportData.artifacts] || reportData.artifacts || '-',
    postoperativeChangesDetails:
      reportData.postoperativeChanges === 'bar (şu ýerde beýan ediň).' ? reportData.postoperativeChangesDetails || '' : '',
    heterotopiaDetails:
      reportData.heterotopia === 'bar (şu ýerde beýan ediň).' ? reportData.heterotopiaDetails || '' : '',
  };
}

/**
 * DOCX şablonyny taýýarlamak boýunça gollanma (binaryň üsti bilen däl, diňe tekst görnüşinde)
 * 1. Word-da täze boş dokument açyň, "Faýl" → "Sakla" görnüşinden DOCX saýlaň.
 * 2. Aşakdaky meýdanlary tekst hökmünde ýerleşdiriň (her placeholder bir w:t blokda gysylmazdan durmalydyr):
 *    - "Familiýasy, ady: {{patientName}}"
 *    - "Barlag senesi: {{examDate}}"
 *    - "Bölüm: {{department}}"
 *    - "Jynsy: {{gender}}"
 *    - "Doglan ýyly: {{birthDate}}"
 *    - "Näsag kody: {{patientCode}}"
 *    - "Barlag usullary: {{methods}}"
 *    - "Barlag görnüşi: {{examType}}"
 *    - "Artefaktlar: {{artifacts}}"
 *    - "Kesim ugry: {{sliceDirection}}"
 *    - "Netije: {{netije}}"
 *    - "Maslahat: {{maslahat}}"
 *    - "Lukmanyň ady: {{doctorName}}"
 *    Beýleki meýdanlaryň atlaryny hem setData sanawyna laýyklykda goşup bilersiňiz (mysal: postoperativeChanges,
 *    postoperativeChangesDetails, heterotopia, heterotopiaDetails we ş.m.).
 * 3. Şablony öz adyňyz bilen saklaň we konsoldan şu buýrugy ulanyp base64 hataryna öwürüň (binaryňy repo goýmazlyk
 *    üçin):
 *    base64 -w 0 siziň_faýlyňyz.docx > my_template_base64.txt
 * 4. Döreden hataryňyzy aşakdaky EMBEDDED_TEMPLATE_BASE64 üýtgeýjisine goýuň (setirlerdäki aralyklar aýratyn ýoýulýar,
 *    sebäbi base64ToArrayBuffer boşluklary awtomatik aýyrýar).
 */

// Repo-da binar faýl saklamazlyk üçin şablony base64 görnüşinde göni kodyň içinde saklaýarys.
const EMBEDDED_TEMPLATE_BASE64 = `
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
`;

function base64ToArrayBuffer(base64) {
  const normalized = base64.replace(/\s+/g, '');
  const binaryString = atob(normalized);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

async function exportToDocx(reportData) {
  const preparedData = buildDocxTemplateData(reportData);

  try {
    const arrayBuffer = base64ToArrayBuffer(EMBEDDED_TEMPLATE_BASE64);
    const zip = new PizZip(arrayBuffer);
    const doc = new window.docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.setData(preparedData);
    doc.render();

    const output = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    const safePatientName = (reportData.patientName || 'nasag')
      .replace(/\s+/g, '_')
      .replace(/[^\w-]/g, '');
    const safeExamDate = (reportData.examDate || 'senesiz').replace(/[^0-9-]/g, '');
    const fileName = `MRI_brain_RSNA_${safePatientName || 'nasag'}_${safeExamDate || 'senesiz'}.docx`;

    saveAs(output, fileName);
  } catch (error) {
    console.error('DOCX eksport ýalňyşlygy', error);
    alert(
      'Şablon DOCX faýlyny ýüklemek ýa-da taýýarlamak başartmady. Faýlyň elýeterdigini we internet birikmesini barlaň we täzeden synanyşyň.',
    );
  }
}

function collectFormData() {
  const form = document.getElementById('reportForm');
  if (!form) return {};

  const reportData = {};
  const elements = form.querySelectorAll('input[name], select[name], textarea[name]');

  elements.forEach((el) => {
    const { name, type } = el;

    if (type === 'checkbox') {
      reportData[name] = el.checked;
      return;
    }

    if (type === 'radio') {
      if (!(name in reportData)) {
        reportData[name] = '';
      }
      if (el.checked) {
        reportData[name] = el.value;
      }
      return;
    }

    reportData[name] = el.value;
  });

  return reportData;
}

function generatePlainTextReport(reportData) {
  const methodLabels = {
    methodGeneral: 'Umumy',
    methodT1: 'T1',
    methodT2: 'T2',
    methodT2Tirm: 'T2_tirm',
    methodDiffuz: 'Diffuz',
    methodAngiography: 'MRT angiografiýa',
    methodFlair: 'FLAIR',
  };

  const selectedMethods = Object.entries(methodLabels)
    .filter(([key]) => reportData[key])
    .map(([, label]) => label)
    .join(', ');

  const examTypeMap = {
    first: 'Ilkinji gezek.',
    repeat: 'Gaýtadan gözegçilik.',
  };

  const artifactsMap = {
    none: 'Artefaktlar ýok.',
    minor: 'Az artefaktlar.',
    significant: 'Ep-esli artefaktlar.',
  };

  const examTypeText = examTypeMap[reportData.examType] || reportData.examType || '-';
  const artifactsText = artifactsMap[reportData.artifacts] || reportData.artifacts || '-';
  const methodsText = selectedMethods || 'Saýlanmady.';

  const postoperativeText = reportData.postoperativeChanges || '';
  const postoperativeDetails = reportData.postoperativeChangesDetails
    ? `\n  Giňişleýin: ${reportData.postoperativeChangesDetails}`
    : '';

  const heterotopiaText = reportData.heterotopia || '';
  const heterotopiaDetails = reportData.heterotopiaDetails
    ? `\n  Giňişleýin: ${reportData.heterotopiaDetails}`
    : '';

  const blocks = [
    `Umumy maglumatlar\n- Barlagyň senesi: ${reportData.examDate || '-'}\n- Familiyasy, ady: ${
      reportData.patientName || '-'
    }\n- Bölüm: ${reportData.department || '-'}\n- Jynsy: ${reportData.gender || '-'}\n- Doglan ýyly: ${
      reportData.birthDate || '-'
    }\n- Näsagyň kody: ${reportData.patientCode || '-'}`,
    `Barlag akymy\n- Barlag usuly: ${methodsText}\n- Barlag: ${examTypeText}\n- Artefaktlar: ${artifactsText}\n- Kesim ugry: ${
      reportData.sliceDirection || '-'
    }`,
    `Gurluşlar we simmetriýa\n- Kelle çanak: ${reportData.skullShape || '-'}\n- Tikinleri: ${
      reportData.sutures || '-'
    }\n- Simmetriýa: ${reportData.symmetry || '-'}\n- Kelleçanagyň çukurjuklary: ${
      reportData.cranialFossa || '-'
    }\n- Operasiýadan soňky üýtgemeleri: ${postoperativeText}${postoperativeDetails}\n- Ak we çal maddanyň differensasiýasy: ${
      reportData.whiteGrayMatterDifferentiation || '-'
    }\n- Geterotopiýa: ${heterotopiaText}${heterotopiaDetails}\n- Gippokamp simmetriýasy: ${
      reportData.hippocampalSymmetry || '-'
    }\n- Gippokampdaky ojaklar: ${reportData.hippocampalFoci || '-'}\n- Beýni parenhimasynyň ojaklaýyn üýtgemeleri: ${
      reportData.parenchymaLesions || '-'
    }`,
    `Netije\n${reportData.netije || ''}`,
    `Maslahat\n${reportData.maslahat || ''}`,
    `Lukman: ${reportData.doctorName || ''}`,
  ];

  return blocks.join('\n\n');
}

function setupReportActions(root) {
  const generateBtn = root.querySelector('#btn-generate-report');
  const copyBtn = root.querySelector('#btn-copy-text');
  const rsnaBtn = root.querySelector('#btn-fill-rsna');
  const exportBtn = root.querySelector('#btn-export-docx');
  const resetBtn = root.querySelector('#btn-reset-draft');
  const previewSection = root.querySelector('#reportPreview');
  const previewContent = root.querySelector('#reportPreviewContent');
  const form = root.querySelector('#reportForm');

  let lastReportText = '';

  const showPreview = (text) => {
    if (!previewSection || !previewContent) return;
    previewContent.textContent = text;
    previewSection.hidden = !text;
  };

  generateBtn?.addEventListener('click', () => {
    const data = collectFormData();
    const reportText = generatePlainTextReport(data);
    lastReportText = reportText;
    showPreview(reportText);
  });

  copyBtn?.addEventListener('click', async () => {
    const text = lastReportText || previewContent?.textContent || '';
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      copyBtn.classList.add('is-success');
      copyBtn.textContent = 'Göçürildi';
      setTimeout(() => {
        copyBtn.classList.remove('is-success');
        copyBtn.textContent = 'Nusgany göçür';
      }, 1800);
    } catch (error) {
      console.error('Clipboard ýalňyşlygy', error);
    }
  });

  rsnaBtn?.addEventListener('click', () => {
    console.info('RSNA şablonyny doldur: ösüş tapgyry.');
  });

  exportBtn?.addEventListener('click', async () => {
    const data = collectFormData();
    await exportToDocx(data);
  });

  resetBtn?.addEventListener('click', () => {
    form?.reset();
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    updateDraftStatus('', 'autosaved');

    const changeTargets = form?.querySelectorAll('select[name], input[type="radio"], input[type="checkbox"]') || [];
    changeTargets.forEach((el) => {
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    if (previewSection && previewContent) {
      previewContent.textContent = '';
      previewSection.hidden = true;
    }
  });
}

export function renderApp() {
  renderForm();
}

renderApp();
