// app.js
// Programma giriş nokady. State-i inisializirleýär, formany döredýär we düwmeler üçin handler goşýar.

import { CLINICAL_PROFILES } from "./profiles.js";
import { reportState } from "./state.js";
import { renderForm } from "./renderForm.js";
import { buildReportBlocks, generatePlainTextReport } from "./report.js";
import { loadDraft, saveDraft, clearDraft } from "./storage.js";
import { translate } from "./i18n.js";
import { exportToDocx } from "./exportDocx.js";
import { SECTIONS, createEmptyReportState } from "./schema.js";
import { RSNA_SNIPPETS } from "./rsnaSnippets.js";

const appRoot = document.getElementById("app");
const previewSection = document.getElementById("reportPreview");
const previewContent = document.getElementById("reportPreviewContent");
let profileDescriptionEl = null;
let snippetStatusEl = null;

function renderProfileDescription(profile) {
  if (!profileDescriptionEl) {
    profileDescriptionEl = document.getElementById("profileDescription");
  }
  if (!profileDescriptionEl) return;
  if (!profile) {
    profileDescriptionEl.textContent = "Profil saýlanmady.";
    return;
  }
  profileDescriptionEl.textContent = profile.description || "Deslapky dolduryş gurnalan profil.";
}

function applyProfileDefaults(profileId) {
  const profile = CLINICAL_PROFILES[profileId];
  if (!profile) return;
  if (reportState.isDirty()) {
    const confirmed = window.confirm("Saýlanan profil häzirki maglumatlary üýtgedip biler. Dowam etmelimi?");
    if (!confirmed) return;
  }
  Object.entries(profile.defaults).forEach(([key, value]) => reportState.setField(key, value));
  renderForm(document.getElementById("formContainer"));
  renderProfileDescription(profile);
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
            <p id="profileDescription" class="profile-description">Profil saýlanmady.</p>
          </div>
        </div>
      </div>
      <div id="formContainer"></div>
      <div id="validationNotice" class="notice" hidden>
        <strong>Gerekli meýdançalar doldurylyp bilinmedi.</strong>
        <span class="notice__text"></span>
      </div>
      <div class="actions">
        <button id="btn-generate">Hasabat döret</button>
        <button id="btn-clear" type="button">Arassala / täzele</button>
        <button id="btn-export" type="button">Word eksporty</button>
      </div>
    </section>
    <section id="snippetPanel" class="card snippet-panel">
      <div class="snippet-panel__header">
        <div>
          <h2>RSNA.txt patologiýa ýazgylary</h2>
          <p>Dokumentdäki ähli patologik beýanlamalaryň türkmençe gysga wariantlary. Düzülýän meýdan seçilen bolsa, wariant şol ýere goşular; seçilmedik bolsa, tekst clipboard-a kopiýalanar.</p>
        </div>
        <p id="snippetStatus" class="snippet-panel__status" aria-live="polite"></p>
      </div>
      <div id="snippetsContainer" class="snippet-groups"></div>
    </section>
  `;
}

function updateSnippetStatus(message) {
  if (!snippetStatusEl) return;
  snippetStatusEl.textContent = message || "";
  if (message) {
    setTimeout(() => {
      snippetStatusEl.textContent = "";
    }, 2500);
  }
}

function insertSnippet(text) {
  const active = document.activeElement;
  const isTextControl =
    active &&
    (active.tagName === "TEXTAREA" ||
      (active.tagName === "INPUT" && ["text", "number"].includes(active.type)));

  if (isTextControl) {
    const existing = active.value || "";
    const needsNewline = existing && !existing.endsWith("\n");
    const spacer = existing ? (needsNewline ? "\n" : "") : "";
    active.value = `${existing}${spacer}${text}`;
    active.dispatchEvent(new Event("input", { bubbles: true }));
    active.focus();
    updateSnippetStatus("Tekst meýdana goşuldy.");
    return;
  }

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => updateSnippetStatus("Tekst clipboard-a kopiýalandy."));
    return;
  }

  window.prompt("Teksti kopiýa ediň:", text);
}

function renderSnippets() {
  const container = document.getElementById("snippetsContainer");
  if (!container) return;
  container.innerHTML = "";

  RSNA_SNIPPETS.forEach((group) => {
    const details = document.createElement("details");
    details.className = "snippet-group";
    details.open = true;

    const summary = document.createElement("summary");
    summary.textContent = group.title;
    details.appendChild(summary);

    const list = document.createElement("div");
    list.className = "snippet-chip-list";

    group.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "snippet-chip";
      button.textContent = option;
      button.addEventListener("click", () => insertSnippet(option));
      list.appendChild(button);
    });

    details.appendChild(list);
    container.appendChild(details);
  });
}

function attachHandlers() {
  const profileSelect = document.getElementById("profileSelect");
  profileSelect?.addEventListener("change", (event) => {
    if (profileSelect.value) {
      applyProfileDefaults(profileSelect.value);
    }
    const selectedProfile = CLINICAL_PROFILES[profileSelect.value];
    renderProfileDescription(selectedProfile);
  });

  const generateBtn = document.getElementById("btn-generate");
  generateBtn?.addEventListener("click", () => {
    const valid = validateRequiredFields();
    const reportText = generatePlainTextReport(reportState.data);
    if (previewSection && previewContent) {
      previewContent.textContent = reportText || "Gerekli maglumatlar girizileniňden soň hasabat şu ýerde peýda bolar.";
      previewSection.hidden = !valid || !reportText;
    }
  });

  const clearBtn = document.getElementById("btn-clear");
  clearBtn?.addEventListener("click", () => {
    resetValidationState();
    reportState.init(createEmptyReportState());
    clearDraft();
    renderForm(document.getElementById("formContainer"));
    renderProfileDescription(null);
    if (previewSection && previewContent) {
      previewContent.textContent = "";
      previewSection.hidden = true;
    }
  });

  const exportBtn = document.getElementById("btn-export");
  exportBtn?.addEventListener("click", async () => {
    const valid = validateRequiredFields();
    if (!valid) return;
    await exportToDocx(reportState.data, buildReportBlocks(reportState.data));
  });
}

function setupAutosave() {
  reportState.subscribe((data) => {
    saveDraft(data);
  });
}

function init() {
  const draft = loadDraft();
  reportState.init(draft || createEmptyReportState());

  renderShell();
  renderForm(document.getElementById("formContainer"));
  snippetStatusEl = document.getElementById("snippetStatus");
  renderSnippets();
  renderProfileDescription(null);
  attachHandlers();
  setupAutosave();
}

function validateRequiredFields() {
  resetValidationState();
  const missing = [];
  SECTIONS.forEach((section) => {
    section.fields.forEach((field) => {
      if (!field.required) return;
      const value = reportState.getField(field.name);
      const isEmpty = Array.isArray(value) ? value.length === 0 : !value;
      const control = document.getElementById(field.name);
      control?.classList.toggle("input-error", isEmpty);
      control?.setAttribute("aria-invalid", isEmpty);
      control?.closest(".form-field")?.classList.toggle("form-field--error", isEmpty);
      if (isEmpty) {
        missing.push(field.labelTm);
      }
    });
  });

  const notice = document.getElementById("validationNotice");
  if (notice) {
    notice.hidden = missing.length === 0;
    const text = notice.querySelector(".notice__text");
    if (text) {
      text.textContent = missing.length > 0 ? `Dolduryň: ${missing.join(", ")}` : "";
    }
  }

  return missing.length === 0;
}

function resetValidationState() {
  document.querySelectorAll(".input-error").forEach((el) => {
    el.classList.remove("input-error");
    el.removeAttribute("aria-invalid");
  });
  document.querySelectorAll(".form-field--error").forEach((el) => {
    el.classList.remove("form-field--error");
  });

  const notice = document.getElementById("validationNotice");
  if (notice) {
    notice.hidden = true;
    const text = notice.querySelector(".notice__text");
    if (text) text.textContent = "";
  }
}

init();
