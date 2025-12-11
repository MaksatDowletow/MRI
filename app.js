function renderForm() {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  const today = new Date().toISOString().split('T')[0];

  appRoot.innerHTML = `
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
            <option value="kadaly ýagdaýda.">kadaly ýagdaýda.</option>
            <option value="synostoz alamatly.">synostoz alamatly.</option>
          </select>
        </label>
      </div>
      <div class="form-row">
        <label>
          Simmetriýa:
          <select name="symmetry" data-label-tm="Simmetriýa:">
            <option value="Simmetrik.">Simmetrik.</option>
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
            <option value="ýok.">ýok.</option>
            <option value="bar (şu ýerde beýan ediň).">bar (şu ýerde beýan ediň).</option>
          </select>
        </label>
        <div class="conditional-field" data-related="postoperativeChanges">
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
            <option value="bellenmeýar.">bellenmeýar.</option>
            <option value="bar (şu ýerde beýan ediň).">bar (şu ýerde beýan ediň).</option>
          </select>
        </label>
        <div class="conditional-field" data-related="heterotopia">
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
            <option value="Simmetrik.">Simmetrik.</option>
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
  `;

  setupConditionalFields(appRoot);
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

export function renderApp() {
  renderForm();
}

renderApp();
