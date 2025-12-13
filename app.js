import {
  CTA_VARIANTS,
  getFunnelReport,
  getVariantCopy,
  getVariantKey,
  initAnalytics,
  recordCtaClick,
  recordFunnelStep,
} from "./analytics.js";
import { clearDraft, loadDraft, saveDraft } from "./storage.js";

function createBaseState() {
  return {
    patientName: "",
    patientId: "",
    age: "",
    examDate: new Date().toISOString().slice(0, 10),
    examContext: "Ilkinji gezek geçirilen MRT barlagy.",
    epilepsyCuts: false,
    customNotes: "",
    selections: {},
  };
}

let state = createBaseState();

let dbModulePromise = null;
let dbModule = null;
let snippetsPromise = null;
let snippetData = [];
let variantCopy = getVariantCopy();
let draftSaveTimer = null;
const sessionSteps = new Set();

const requiredFields = ["patientName", "age", "examDate"];
const fieldHelpers = {
  patientName: "Familiýa + ady iň az 3 harp bilen görkezmegiňizi haýyş edýäris.",
  patientId: "Kliniki ID ýa-da kart kody (islege görä).",
  age: "Ýaşy 0-120 aralygynda giriziň.",
  examDate: "Gelejekdäki senä ýol berilmeýär.",
  examContext: "Ilkinji/gaýtadan barlag, deňeşdirmeler ýaly jikme-jiklikleri ýazyň.",
};

document.addEventListener("DOMContentLoaded", () => {
  variantCopy = initAnalytics();
  renderShell();
  hydrateDraft();
  bindInteractions();
  scheduleSnippetLoad();
  applyStateToInputs();
  updateReportPreview();
  renderAnalyticsPanel();
  warmupDbWhenVisible();
});

function hydrateDraft() {
  const draft = loadDraft();
  if (!draft) return;
  state = {
    ...createBaseState(),
    ...draft,
    selections: draft.selections || {},
  };
  showInlineStatus("Autosaklanan taslak dikeldildi.");
}

function renderShell() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <section class="hero" id="introSection">
      <div class="hero-text">
        <p class="eyebrow">Awtomatlaşdyrylan forma</p>
        <h1>${variantCopy.heading}</h1>
        <p class="lead">
          Patologiýa wariantlaryny saýlaň, netije bölegi awtomatiki doldurylsyn. Protokoly SQL.js ammarynda
          saklap, islendik wagtda gaýtadan ýükläp ýa-da Word görnüşinde eksport edip bilersiňiz.
        </p>
        <div class="tags">
          <span class="tag">Patologiýa saýlaýjy</span>
          <span class="tag">SQL.js arkaly ýerli ammar</span>
          <span class="tag">Word eksporty</span>
        </div>
        <div class="hero-cta">
          <button id="primaryCta" class="btn primary-cta" data-cta-variant="${variantCopy.cta}">${variantCopy.cta}</button>
          <button id="secondaryCta" class="btn ghost" aria-label="Patologiýa wariantlaryna geç">Wariantlara seret</button>
        </div>
        <p class="muted cta-note">CTA düwmesi ilkinji ekranda goýlup, gönüden-göni forma bölümine eltýär.</p>
      </div>
      <div class="hero-panel">
        <h2>Çalt başlangyç</h2>
        <ol class="hero-list">
          <li>Umumy maglumatlary dolduryň, zerur bolsa epilepsiýa üçin aýratyn kesimleri işjeňleşdiriň.</li>
          <li>Islenýän patologiýa beýanlamalaryny belliklerden saýlaň.</li>
          <li>Netije blokyny göçüriň, SQL.js-e ýazdyryň ýa-da Word-faýl görnüşinde indiriň.</li>
        </ol>
        <p class="muted">Wariantlar RSNA.txt faýlyndaky möhüm böleklerden taýýarlanyldy.</p>
      </div>
    </section>

    <section class="card form-card" id="formSection">
      <div class="section-header">
        <div>
          <p class="eyebrow">Umumy maglumatlar</p>
          <h2 id="formHeading">Näsag we barlag barada</h2>
          <p class="muted" id="formDescription">Hasabatyň başyndaky hökmany maglumatlar.</p>
        </div>
        <div class="section-tools">
          <button id="resetForm" class="btn ghost" type="button">Ähli maglumatlary arassala</button>
          <div class="pill">Hasabat awtodolyşygi</div>
        </div>
      </div>
      <form class="form-grid" aria-labelledby="formHeading formDescription" id="reportForm" novalidate>
        <label class="form-field required">
          <span>Familiýasy, ady</span>
          <input data-field="patientName" type="text" placeholder="Amanow Aman" autocomplete="name" aria-describedby="hint-patientName" />
          <small class="field-hint" id="hint-patientName">${fieldHelpers.patientName}</small>
        </label>
        <label class="form-field">
          <span>Näsag kody / ID</span>
          <input data-field="patientId" type="text" placeholder="ID12345" autocomplete="off" aria-describedby="hint-patientId" />
          <small class="field-hint" id="hint-patientId">${fieldHelpers.patientId}</small>
        </label>
        <label class="form-field required">
          <span>Ýaşy</span>
          <input data-field="age" type="number" min="0" max="120" inputmode="numeric" pattern="\\d*" placeholder="45" aria-describedby="hint-age" />
          <small class="field-hint" id="hint-age">${fieldHelpers.age}</small>
        </label>
        <label class="form-field required">
          <span>Barlag senesi</span>
          <input data-field="examDate" type="date" max="${state.examDate}" value="${state.examDate}" aria-describedby="hint-examDate" />
          <small class="field-hint" id="hint-examDate">${fieldHelpers.examDate}</small>
        </label>
        <label class="form-field wide">
          <span>Barlag konteksti</span>
          <textarea data-field="examContext" rows="2" placeholder="Ilkinji gezek / gaýtadan barlag, öňki bilen deňeşdirmeler ..." aria-describedby="hint-examContext">${state.examContext}</textarea>
          <small class="field-hint" id="hint-examContext">${fieldHelpers.examContext}</small>
        </label>
        <label class="form-field toggle">
          <input data-field="epilepsyCuts" type="checkbox" />
          <span>Epilepsiýa ýagdaýynda ýörite gyýak kesimler ýerine ýetirildi</span>
        </label>
      </form>
    </section>

    <section class="content" id="snippetSection">
      <div class="section-header">
        <div>
          <p class="eyebrow">Patologiýa wariantlary</p>
          <h2 id="snippetHeading">Beýanlamalary bellik görnüşinde saýlaň</h2>
          <p class="muted" id="snippetDescription">Her karta kliniki taýdan degişli standart sözlemleri jemleýär; saýlananlary awtomatiki netije bölümine geçirýär.</p>
        </div>
        <div class="pill">RSNA.txt esasynda</div>
      </div>
      <div
        class="content-grid"
        id="snippetGrid"
        aria-busy="true"
        aria-labelledby="snippetHeading snippetDescription"
        role="group"
      >${renderSnippetSkeleton()}</div>
    </section>

    <section class="card note-card" id="notesSection">
      <div class="section-header">
        <div>
          <p class="eyebrow">Goşmaça bellik</p>
          <h2 id="notesHeading">Erkin ýazgy</h2>
          <p class="muted" id="notesDescription">Awtomatlaşdyrylmadyk jikme-jiklikleri şu ýerde belläň.</p>
        </div>
        <div class="pill">Islege görä</div>
      </div>
      <label class="form-field" for="customNotes">
        <span class="visually-hidden" id="notesLabel">Goşmaça bellik meýdany</span>
        <textarea
          id="customNotes"
          data-field="customNotes"
          rows="3"
          aria-labelledby="notesHeading notesDescription notesLabel"
          placeholder="Meselem: kontrast toplama ýok, dinamika boýunça üýtgeşme bar ..."
        ></textarea>
      </label>
    </section>

    <section class="card preview-card" id="previewSection">
      <div class="section-header">
        <div>
          <p class="eyebrow">Netije</p>
          <h2 id="previewHeading">Awtodöredilen tekst</h2>
          <p class="muted" id="previewDescription">Saýlanan wariantlaryň esasynda düzülen tertipli tekst.</p>
        </div>
        <div class="actions">
          <button id="copyReport" class="btn ghost" aria-label="Netije blokyny göçürmek">Köçürmek</button>
          <button id="exportDoc" class="btn" aria-label="Netijäni Word görnüşinde eksport etmek">Word görnüşinde eksport</button>
        </div>
      </div>
      <div class="inline-status" id="actionFeedback" role="status" aria-live="polite"></div>
      <div class="chip-row" id="selectionChips"></div>
      <textarea
        id="reportText"
        rows="12"
        readonly
        aria-labelledby="previewHeading previewDescription"
        aria-live="polite"
      ></textarea>
    </section>

    <section class="card db-card" id="storageSection">
      <div class="section-header">
        <div>
          <p class="eyebrow">Protokol ammary</p>
          <h2>SQL.js bilen ýerli ýatda saklamak</h2>
          <p class="muted">Döreden protokollaryňyzy internet bolmasa-da saklap, gaýtadan ulanyň.</p>
        </div>
        <div class="pill" id="dbStatus">Ýüklenýär...</div>
      </div>
      <div class="db-grid">
        <label class="form-field" for="protocolTitle">
          <span>Protokolyň ady</span>
          <input id="protocolTitle" type="text" placeholder="Mysal: Diskirkulýar 65 ýaş" />
        </label>
        <div class="db-actions">
          <button id="saveProtocol" class="btn">Ýatda saklamak</button>
          <button id="refreshProtocolList" class="btn ghost">Sanawy täzeden al</button>
        </div>
      </div>
      <div id="protocolList" class="protocol-list"></div>
    </section>

    <section class="card analytics-card" id="analyticsSection">
      <div class="section-header">
        <div>
          <p class="eyebrow">Analitika</p>
          <h2>Iň uly ýitgi bar bolan basgançak</h2>
          <p class="muted">Basgançaklaýyn geçişler boýunça sanly maglumatlar we A/B netijeleri.</p>
        </div>
        <div class="pill" id="dropoffBadge">Hasaplanýar...</div>
      </div>
      <div class="analytics-grid">
        <div>
          <h3>Basgançaklaýyn akym</h3>
          <ul class="funnel-list" id="funnelList"></ul>
        </div>
        <div>
          <h3>CTA wariantlary (A/B)</h3>
          <div class="variant-stats" id="variantStats"></div>
        </div>
      </div>
    </section>
  `;
}

function renderSnippetSkeleton() {
  return `
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
  `;
}

async function renderSnippetSection() {
  const grid = document.getElementById("snippetGrid");
  if (!grid) return;
  grid.innerHTML = renderSnippetSkeleton();
  grid.setAttribute("aria-busy", "true");

  loadSnippets()
    .then((snippets) => {
      grid.innerHTML = renderSnippetCards(snippets);
      bindSnippetInteractions();
      applyStateToInputs();
    })
    .catch((error) => {
      console.error("Patologiýa wariantlaryny ýüklemek şowsuz boldy", error);
      renderSnippetError(grid);
    })
    .finally(() => {
      grid.removeAttribute("aria-busy");
    });
}

function scheduleSnippetLoad() {
  const grid = document.getElementById("snippetGrid");
  if (!grid) return;

  const load = () => renderSnippetSection();
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          load();
          obs.disconnect();
        }
      },
      { rootMargin: "160px" },
    );
    observer.observe(grid);
  } else if ("requestIdleCallback" in window) {
    requestIdleCallback(load, { timeout: 500 });
  } else {
    setTimeout(load, 200);
  }
}

function renderSnippetCards(snippets) {
  if (!snippets?.length) {
    return `<p class="muted">Wariantlary ýüklemek başartmady.</p>`;
  }

  return `
    <div class="survey-list" role="list">
      ${snippets
        .map(
          (section, idx) => `
            <article
              class="survey-item selection-card"
              data-section="${section.id}"
              role="listitem"
              aria-labelledby="${section.id}-title"
            >
              <div class="survey-heading">
                <div class="survey-index">${idx + 1}</div>
                <div>
                  <p class="eyebrow">Patologiýa bölümi</p>
                  <h3 id="${section.id}-title">${section.title}</h3>
                </div>
              </div>
              <ul class="survey-options" aria-labelledby="${section.id}-title">
                ${section.options
                  .map(
                    (option, optionIndex) => `
                      <li class="survey-option">
                        <label class="option compact">
                          <input
                            type="checkbox"
                            data-category="${section.id}"
                            data-value="${option}"
                            id="${section.id}-${optionIndex}"
                          />
                          <span>${option}</span>
                        </label>
                      </li>
                    `,
                  )
                  .join("")}
              </ul>
            </article>
          `,
      )
      .join("")}
    </div>
  `;
}

function renderSnippetError(grid) {
  grid.innerHTML = `
    <div class="notice error" role="alert">
      <div>
        <p class="eyebrow">Ýükleme ýalňyşy</p>
        <p>Patologiýa wariantlaryny ýükläp bolmady. Internet birikmesini barlap, täzeden synanyşyň.</p>
      </div>
      <button id="retrySnippets" class="btn ghost">Täzeden synanyşyk</button>
    </div>
  `;

  const retryButton = grid.querySelector("#retrySnippets");
  if (retryButton) {
    retryButton.addEventListener("click", () => {
      renderSnippetSection();
    });
  }
}

function bindSnippetInteractions() {
  document.querySelectorAll("[data-category]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      toggleSelection(checkbox.dataset.category, checkbox.dataset.value, checkbox.checked);
      updateReportPreview();
    });
  });
}

function loadSnippets() {
  if (snippetData.length) return Promise.resolve(snippetData);
  if (!snippetsPromise) {
    snippetsPromise = import("./rsnaSnippets.js").then((module) => {
      snippetData = module.RSNA_SNIPPETS;
      return snippetData;
    });
  }
  return snippetsPromise;
}

function bindInteractions() {
  const form = document.getElementById("reportForm");
  if (form) {
    form.addEventListener("submit", (event) => event.preventDefault());
  }

  const primaryCta = document.getElementById("primaryCta");
  if (primaryCta) {
    primaryCta.addEventListener("click", () => {
      recordCtaClick();
      markFunnelStep("hero_cta");
      scrollToSection("formSection");
    });
  }

  const secondaryCta = document.getElementById("secondaryCta");
  if (secondaryCta) {
    secondaryCta.addEventListener("click", () => {
      scrollToSection("snippetSection");
    });
  }

  document.querySelectorAll("[data-field]").forEach((input) => {
    if (input.type === "checkbox") {
      input.addEventListener("change", () => {
        updateStateField(input.dataset.field, input.checked);
        updateReportPreview();
        validateField(input);
        markFunnelStep("form_start");
      });
    } else {
      input.addEventListener("input", () => {
        updateStateField(input.dataset.field, input.value);
        updateReportPreview();
        validateField(input);
        markFunnelStep("form_start");
      });
      input.addEventListener("blur", () => validateField(input));
    }
  });

  const copyButton = document.getElementById("copyReport");
  if (copyButton) {
    copyButton.addEventListener("click", copyReport);
  }

  const exportButton = document.getElementById("exportDoc");
  if (exportButton) {
    exportButton.addEventListener("click", exportWord);
  }

  const saveButton = document.getElementById("saveProtocol");
  if (saveButton) {
    saveButton.addEventListener("click", saveProtocolHandler);
  }

  const refreshButton = document.getElementById("refreshProtocolList");
  if (refreshButton) {
    refreshButton.addEventListener("click", () => refreshProtocols());
  }

  const resetButton = document.getElementById("resetForm");
  if (resetButton) {
    resetButton.addEventListener("click", resetFormState);
  }
}

function toggleSelection(category, value, isChecked) {
  const existing = new Set(state.selections[category] || []);
  if (isChecked) {
    existing.add(value);
    markFunnelStep("snippet_select");
  } else {
    existing.delete(value);
  }
  state.selections[category] = Array.from(existing);
  persistDraft();
}

function updateStateField(key, value) {
  state[key] = value;
  persistDraft();
}

function persistDraft() {
  if (draftSaveTimer) {
    clearTimeout(draftSaveTimer);
  }
  draftSaveTimer = window.setTimeout(() => {
    saveDraft(snapshotState());
  }, 300);
}

function buildReportText() {
  const lines = [];
  const headerParts = [];
  if (state.patientName) headerParts.push(`Ady: ${state.patientName}`);
  if (state.patientId) headerParts.push(`ID: ${state.patientId}`);
  if (state.age) headerParts.push(`Ýaşy: ${state.age}`);
  if (state.examDate) headerParts.push(`Sene: ${state.examDate}`);
  if (headerParts.length) {
    lines.push(`Umumy maglumatlar: ${headerParts.join(", ")}`);
  }

  const contextLines = [state.examContext].filter(Boolean);
  if (state.epilepsyCuts) {
    contextLines.push("Epilepsiýa üçin Silwiý aryklygyna paralel/perpendikulýar kesimler ýerine ýetirildi.");
  }
  if (contextLines.length) {
    lines.push(`Barlag konteksti: ${contextLines.join(" ")}`);
  }

  const sections = snippetData.length ? snippetData : [];
  sections.forEach((section) => {
    const selected = state.selections[section.id];
    if (selected && selected.length) {
      const heading = section.id === "result" ? "Netije" : section.title;
      lines.push(`${heading}:`);
      selected.forEach((item) => lines.push(`- ${item}`));
    }
  });

  if (state.customNotes) {
    lines.push(`Goşmaça bellik: ${state.customNotes}`);
  }

  return lines.join("\n");
}

function updateReportPreview() {
  const reportText = buildReportText();
  const preview = document.getElementById("reportText");
  const hasReport = Boolean(reportText.trim());
  if (hasReport && sessionSteps.has("form_start")) {
    markFunnelStep("report_ready");
  }
  if (preview) {
    preview.value = hasReport ? reportText : "Netije döretmek üçin maglumatlary giriziň.";
  }
  const chips = document.getElementById("selectionChips");
  if (chips) {
    const selected = Object.entries(state.selections)
      .flatMap(([category, values]) => values.map((value) => ({ category, value })));
    chips.innerHTML = selected
      .map((item) => `<span class="chip" title="${item.category}">${item.value}</span>`)
      .join("");
  }
}

function warmupDbWhenVisible() {
  const dbCard = document.querySelector(".db-card");
  if (!dbCard) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadDbModule();
        obs.disconnect();
      }
    },
    { rootMargin: "200px" },
  );

  observer.observe(dbCard);
}

function loadDbModule() {
  if (dbModulePromise) return dbModulePromise;
  dbModulePromise = import("./db.js").then(async (module) => {
    dbModule = module;
    await module.initDatabase(document.getElementById("dbStatus"));
    renderProtocolList();
    return module;
  });
  return dbModulePromise;
}

function renderProtocolList() {
  const list = document.getElementById("protocolList");
  if (!list) return;
  if (!dbModule) {
    list.innerHTML = `<p class="muted">SQL.js ýüklenýänçä garaşyň...</p>`;
    return;
  }

  dbModule.renderProtocolList(list, {
    onLoad: (id) => loadProtocol(id),
    onDelete: (id) => deleteProtocol(id),
  });
}

async function refreshProtocols() {
  await loadDbModule();
  renderProtocolList();
}

async function saveProtocolHandler() {
  const titleInput = document.getElementById("protocolTitle");
  const preview = document.getElementById("reportText");
  if (!titleInput || !preview) return;

  const title = titleInput.value.trim();
  if (!title) {
    showInlineStatus("Protokolyň adyny giriziň.", "error");
    return;
  }
  if (!preview.value) {
    showInlineStatus("Ilki bilen netije dörediň.", "error");
    return;
  }

  await loadDbModule();
  if (!dbModule?.isDatabaseReady()) return;

  dbModule.saveProtocol({ title, report: preview.value, state: snapshotState() });
  renderProtocolList();
  titleInput.value = "";
  showInlineStatus("Protokol üstünlikli saklandy.", "success");
  markFunnelStep("protocol_saved");
}

async function loadProtocol(id) {
  await loadDbModule();
  if (!dbModule) return;
  const record = dbModule.fetchProtocol(id);
  if (!record) return;
  const preview = document.getElementById("reportText");
  if (preview && record.report) {
    preview.value = record.report;
  }
  if (record.state) {
    restoreState(record.state);
  }
}

async function deleteProtocol(id) {
  await loadDbModule();
  if (!dbModule) return;
  dbModule.deleteProtocol(id);
  renderProtocolList();
}

function copyReport() {
  const preview = document.getElementById("reportText");
  if (!preview || !preview.value) return;
  navigator.clipboard
    .writeText(preview.value)
    .then(() => showInlineStatus("Netije göçürildi.", "success"))
    .catch(() => showInlineStatus("Göçürmek başartmady.", "error"));
}

function exportWord() {
  const preview = document.getElementById("reportText");
  if (!preview || !preview.value) {
    showInlineStatus("Eksport etmek üçin ilki netije dörediň.", "error");
    return;
  }
  const html = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          h1 { text-align: center; }
          pre { white-space: pre-wrap; font-family: inherit; }
        </style>
      </head>
      <body>
        <h1>Beýni MRT hasabaty</h1>
        <pre>${preview.value}</pre>
      </body>
    </html>
  `;
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `mri-report-${state.examDate || "bugun"}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showInlineStatus("Word eksporty başlady.", "success");
}

function snapshotState() {
  return JSON.parse(
    JSON.stringify({
      ...state,
      selections: state.selections,
    }),
  );
}

function restoreState(saved) {
  if (!saved) return;
  state = {
    ...createBaseState(),
    ...saved,
    selections: saved.selections || {},
  };
  applyStateToInputs();
  persistDraft();
}

function applyStateToInputs() {
  document.querySelectorAll("[data-field]").forEach((input) => {
    const key = input.dataset.field;
    const value = state[key];
    if (input.type === "date") {
      input.max = new Date().toISOString().slice(0, 10);
    }
    if (input.type === "checkbox") {
      input.checked = Boolean(value);
    } else if (value !== undefined) {
      input.value = value;
    }
  });

  document.querySelectorAll("[data-category]").forEach((checkbox) => {
    const selected = state.selections[checkbox.dataset.category] || [];
    checkbox.checked = selected.includes(checkbox.dataset.value);
  });

  updateReportPreview();
}

function resetFormState() {
  state = createBaseState();
  applyStateToInputs();
  updateReportPreview();
  clearDraft();
  showInlineStatus("Ähli meýdanlar arassalandy.", "success");
}

function validateField(input) {
  const key = input.dataset.field;
  const rawValue = input.type === "checkbox" ? input.checked : input.value.trim();
  let status = "hint";
  let message = fieldHelpers[key] || "";

  if (requiredFields.includes(key) && !rawValue) {
    status = "error";
    message = "Bu meýdan hökmany.";
  } else if (key === "patientName" && rawValue && rawValue.length < 3) {
    status = "error";
    message = "Iň az 3 harp giriziň.";
  } else if (key === "age" && rawValue) {
    const ageValue = Number(rawValue);
    if (Number.isNaN(ageValue) || ageValue < 0 || ageValue > 120) {
      status = "error";
      message = fieldHelpers.age;
    } else {
      status = "success";
      message = "Ýaş dogry görnüşde girizildi.";
    }
  } else if (key === "examDate" && rawValue) {
    const today = new Date().toISOString().slice(0, 10);
    if (rawValue > today) {
      status = "error";
      message = "Gelejekdäki sene kabul edilmeýär.";
    } else {
      status = "success";
      message = "Sene kabul edildi.";
    }
  } else if (rawValue) {
    status = "success";
    message = "Girizme kabul edildi.";
  }

  updateFieldState(key, status, message);
  return status !== "error";
}

function updateFieldState(key, status, message) {
  const hint = document.getElementById(`hint-${key}`);
  if (hint) {
    hint.textContent = message;
    hint.dataset.state = status;
  }
  const field = document.querySelector(`[data-field="${key}"]`)?.closest(".form-field");
  if (field) {
    field.dataset.state = status;
  }
}

function markFunnelStep(step) {
  if (sessionSteps.has(step)) return;
  sessionSteps.add(step);
  recordFunnelStep(step, { variant: getVariantKey() });
  renderAnalyticsPanel();
}

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function showInlineStatus(message, type = "info") {
  const area = document.getElementById("actionFeedback");
  if (!area) return;
  area.textContent = message;
  area.dataset.state = type;
}

function renderAnalyticsPanel() {
  const funnelList = document.getElementById("funnelList");
  const dropoffBadge = document.getElementById("dropoffBadge");
  const variantStats = document.getElementById("variantStats");
  if (!funnelList || !dropoffBadge || !variantStats) return;

  const report = getFunnelReport();
  const dropFrom = report.biggestDrop.from ? stepLabel(report.biggestDrop.from) : "Giriş";
  const dropTo = report.biggestDrop.to ? stepLabel(report.biggestDrop.to) : "Basgançak";
  dropoffBadge.textContent = report.biggestDrop.drop
    ? `Iň uly ýitgi: ${dropFrom} → ${dropTo} (-${report.biggestDrop.drop})`
    : "Ýitgi tapylmady";

  funnelList.innerHTML = report.steps
    .map(
      (step) => `
        <li class="funnel-row">
          <div>
            <span class="funnel-label">${stepLabel(step.id)}</span>
            <small class="muted">${step.count} çäre</small>
          </div>
          <div class="funnel-meter" aria-label="Basgançak meýilnamasy">
            <span style="width: ${Math.min(100, step.count * 10)}%"></span>
          </div>
        </li>
      `,
    )
    .join("");

  const variantMarkup = Object.keys(CTA_VARIANTS)
    .map((key) => {
      const stats = report.variantStats[key];
      const ctr = stats.views ? Math.round((stats.clicks / stats.views) * 1000) / 10 : 0;
      const isCurrent = report.variant === key ? "variant-active" : "";
      return `
        <div class="variant-card ${isCurrent}">
          <div class="variant-name">${key} warianty</div>
          <p class="variant-copy">${CTA_VARIANTS[key].heading}</p>
          <div class="variant-metrics">
            <span>${stats.views} görkezme</span>
            <span>${stats.clicks} basyş</span>
            <span>CTR: ${ctr}%</span>
          </div>
        </div>
      `;
    })
    .join("");
  variantStats.innerHTML = variantMarkup;
}

function stepLabel(id) {
  switch (id) {
    case "hero_cta":
      return "CTA basyldy";
    case "form_start":
      return "Forma başlandy";
    case "snippet_select":
      return "Patologiýa saýlandy";
    case "report_ready":
      return "Netije görkezildi";
    case "protocol_saved":
      return "Protokol saklandy";
    default:
      return id;
  }
}
