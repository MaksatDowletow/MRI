// app.js
// Programma giriş nokady. State-i inisializirleýär, formany döredýär we düwmeler üçin handler goşýar.

import { CLINICAL_PROFILES } from "./profiles.js";
import { reportState } from "./state.js";
import { renderForm } from "./renderForm.js";
import { generatePlainTextReport } from "./report.js";
import { loadDraft, saveDraft, clearDraft } from "./storage.js";
import { translate } from "./i18n.js";
import { exportToDocx } from "./exportDocx.js";

const appRoot = document.getElementById("app");
const previewSection = document.getElementById("reportPreview");
const previewContent = document.getElementById("reportPreviewContent");

function applyProfileDefaults(profileId) {
  const profile = CLINICAL_PROFILES[profileId];
  if (!profile) return;
  Object.entries(profile.defaults).forEach(([key, value]) => reportState.setField(key, value));
  renderForm(document.getElementById("formContainer"));
}

function renderShell() {
  if (!appRoot) return;
  appRoot.innerHTML = `
    <section class="card">
      <div class="form-section">
        <h2>${translate("section.profile", "Auto Intake")}</h2>
        <div class="form-grid">
          <div class="form-field">
            <label for="profileSelect">Kliniki profil</label>
            <select id="profileSelect" name="profile">
              <option value="">Profil saýlaň</option>
              ${Object.values(CLINICAL_PROFILES)
                .map((profile) => `<option value="${profile.id}">${profile.label}</option>`)
                .join("")}
            </select>
          </div>
        </div>
      </div>
      <div id="formContainer"></div>
      <div class="actions">
        <button id="btn-generate">Hasabat döret</button>
        <button id="btn-clear" type="button">Arassala / täzele</button>
        <button id="btn-export" type="button">DOCX eksporty (draft)</button>
      </div>
    </section>
  `;
}

function attachHandlers() {
  const profileSelect = document.getElementById("profileSelect");
  profileSelect?.addEventListener("change", (event) => {
    if (profileSelect.value) {
      applyProfileDefaults(profileSelect.value);
    }
  });

  const generateBtn = document.getElementById("btn-generate");
  generateBtn?.addEventListener("click", () => {
    const reportText = generatePlainTextReport(reportState.data);
    if (previewSection && previewContent) {
      previewContent.textContent = reportText;
      previewSection.hidden = !reportText;
    }
  });

  const clearBtn = document.getElementById("btn-clear");
  clearBtn?.addEventListener("click", () => {
    reportState.init({});
    clearDraft();
    renderForm(document.getElementById("formContainer"));
    if (previewSection && previewContent) {
      previewContent.textContent = "";
      previewSection.hidden = true;
    }
  });

  const exportBtn = document.getElementById("btn-export");
  exportBtn?.addEventListener("click", async () => {
    await exportToDocx(reportState.data);
  });
}

function setupAutosave() {
  reportState.subscribe((data) => {
    saveDraft(data);
  });
}

function init() {
  const draft = loadDraft();
  reportState.init(draft || {});

  renderShell();
  renderForm(document.getElementById("formContainer"));
  attachHandlers();
  setupAutosave();
}

init();
