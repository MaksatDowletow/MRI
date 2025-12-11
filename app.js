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

function renderForm() {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  const today = new Date().toISOString().split('T')[0];

  appRoot.innerHTML = `
    <form id="reportForm">
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
  const previewSection = root.querySelector('#reportPreview');
  const previewContent = root.querySelector('#reportPreviewContent');

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

  exportBtn?.addEventListener('click', () => {
    console.info('Word görnüşine eksport: ösüş tapgyry.');
  });
}

export function renderApp() {
  renderForm();
}

renderApp();
