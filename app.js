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
  `;
}

export function renderApp() {
  renderForm();
}

renderApp();
