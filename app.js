const state = {
  patientName: "",
  patientId: "",
  age: "",
  examDate: new Date().toISOString().slice(0, 10),
  examContext: "Ilkinji gezek geçirilen MRT barlagy.",
  epilepsyCuts: false,
  customNotes: "",
  selections: {},
};

let dbModulePromise = null;
let dbModule = null;
let snippetsPromise = null;
let snippetData = [];

document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  bindInteractions();
  await renderSnippetSection();
  applyStateToInputs();
  updateReportPreview();
  warmupDbWhenVisible();
});

function renderShell() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <section class="hero" id="introSection">
      <div class="hero-text">
        <p class="eyebrow">Awtomatlaşdyrylan forma</p>
        <h1>Beýni MRT hasabatlaryny kliniki logika bilen ýygna</h1>
        <p class="lead">
          Patologiýa wariantlaryny saýlaň, Netije bölegi awtomatiki dolsun. Protokoly SQL.js bazasynda
          saklap, islendik wagtda gaýtadan ýükleýärsiňiz we Word görnüşinde eksport edýärsiňiz.
        </p>
        <div class="tags">
          <span class="tag">Patologiýa saýlaýjy</span>
          <span class="tag">SQL.js saklaýyş</span>
          <span class="tag">DOC eksporty</span>
        </div>
      </div>
      <div class="hero-panel">
        <h2>Çalt başlangyç</h2>
        <ol class="hero-list">
          <li>Umumy maglumatlary dolduryň we epilepsiýa kesimlerini işjeňleşdiriň.</li>
          <li>Isleýän patologiýa beýanlamalaryňyzy belliklerden saýlaň.</li>
          <li>Netije blokyny göçüriň, SQL.js-e ýazdyryň ýa-da Word görnüşinde indiriň.</li>
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
        <div class="pill">Hasabat awtodolyşygi</div>
      </div>
      <form class="form-grid" aria-labelledby="formHeading formDescription" id="reportForm" novalidate>
        <label class="form-field">
          <span>Familiýasy, ady</span>
          <input data-field="patientName" type="text" placeholder="Amanow Aman" />
        </label>
        <label class="form-field">
          <span>Näsag kody / ID</span>
          <input data-field="patientId" type="text" placeholder="ID12345" />
        </label>
        <label class="form-field">
          <span>Ýaşy</span>
          <input data-field="age" type="number" min="0" placeholder="45" />
        </label>
        <label class="form-field">
          <span>Barlag senesi</span>
          <input data-field="examDate" type="date" value="${state.examDate}" />
        </label>
        <label class="form-field wide">
          <span>Barlag konteksti</span>
          <textarea data-field="examContext" rows="2" placeholder="Ilkinji gezek / gaýtadan barlag, öňki bilen deňeşdirmeler ...">${state.examContext}</textarea>
        </label>
        <label class="form-field toggle">
          <input data-field="epilepsyCuts" type="checkbox" />
          <span>Epilepsiýa ýagdaýynda ýörite kosý kesimler ýerine ýetirildi</span>
        </label>
      </form>
    </section>

    <section class="content" id="snippetSection">
      <div class="section-header">
        <div>
          <p class="eyebrow">Patologiýa wariantlary</p>
          <h2 id="snippetHeading">Beýanlamalary bellik görnüşinde saýlaň</h2>
          <p class="muted" id="snippetDescription">Her karta kliniki taýdan degişli standart sözlem toplumy bolup, saýlananlary awtomatiki netije girizýär.</p>
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
          <p class="muted" id="notesDescription">Awtomatlaşdyrma üpjün etmeýän jikme-jiklikleri goşuň.</p>
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
          <p class="muted" id="previewDescription">Saýlanan wariantlar esasynda düzülen görnüşli tekst.</p>
        </div>
        <div class="actions">
          <button id="copyReport" class="btn ghost" aria-label="Netije blokyny göçürmek">Köçürmek</button>
          <button id="exportDoc" class="btn" aria-label="Netijäni Word görnüşinde eksport etmek">Word görnüşinde eksport</button>
        </div>
      </div>
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
          <p class="muted">Döreden protokollaryňyzy offline görnüşde saklap, gaýtadan ulanyň.</p>
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

  const snippets = await loadSnippets();
  grid.innerHTML = renderSnippetCards(snippets);
  grid.removeAttribute("aria-busy");
  bindSnippetInteractions();
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

  document.querySelectorAll("[data-field]").forEach((input) => {
    if (input.type === "checkbox") {
      input.addEventListener("change", () => {
        state[input.dataset.field] = input.checked;
        updateReportPreview();
      });
    } else {
      input.addEventListener("input", () => {
        state[input.dataset.field] = input.value;
        updateReportPreview();
      });
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
}

function toggleSelection(category, value, isChecked) {
  const existing = new Set(state.selections[category] || []);
  if (isChecked) {
    existing.add(value);
  } else {
    existing.delete(value);
  }
  state.selections[category] = Array.from(existing);
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
  if (preview) {
    preview.value = reportText;
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
    alert("Protokolyň adyny giriziň.");
    return;
  }
  if (!preview.value) {
    alert("Ilki bilen netije dörediň.");
    return;
  }

  await loadDbModule();
  if (!dbModule?.isDatabaseReady()) return;

  dbModule.saveProtocol({ title, report: preview.value, state: snapshotState() });
  renderProtocolList();
  titleInput.value = "";
  alert("Protokol üstünlikli saklandy.");
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
    .then(() => alert("Netije göçürildi."))
    .catch(() => alert("Göçürmek başartmady."));
}

function exportWord() {
  const preview = document.getElementById("reportText");
  if (!preview || !preview.value) {
    alert("Eksport etmek üçin netije döredilýär.");
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
  Object.keys(state).forEach((key) => {
    if (key === "selections") return;
    const defaultValue = typeof state[key] === "boolean" ? false : "";
    state[key] = saved[key] ?? defaultValue;
  });
  state.selections = saved.selections || {};
  applyStateToInputs();
}

function applyStateToInputs() {
  document.querySelectorAll("[data-field]").forEach((input) => {
    const key = input.dataset.field;
    const value = state[key];
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
