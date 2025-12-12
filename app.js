import initSqlJs from "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.9.0/sql-wasm.js";
import { RSNA_SNIPPETS } from "./rsnaSnippets.js";

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

const DB_KEY = "rsna_protocol_db";
let SQL = null;
let db = null;
let dbReadyPromise = null;

document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  bindInteractions();
  dbReadyPromise = initDatabase();
  await dbReadyPromise;
  renderProtocolList();
  updateReportPreview();
});

function renderShell() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <section class="hero">
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

    <section class="card form-card">
      <div class="section-header">
        <div>
          <p class="eyebrow">Umumy maglumatlar</p>
          <h2>Näsag we barlag barada</h2>
          <p class="muted">Hasabatyň başyndaky hökmany maglumatlar.</p>
        </div>
        <div class="pill">Hasabat awtodolyşygi</div>
      </div>
      <div class="form-grid">
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
      </div>
    </section>

    <section class="content">
      <div class="section-header">
        <div>
          <p class="eyebrow">Patologiýa wariantlary</p>
          <h2>Beýanlamalary bellik görnüşinde saýlaň</h2>
          <p class="muted">Her karta kliniki taýdan degişli standart sözlem toplumy bolup, saýlananlary awtomatiki netije girizýär.</p>
        </div>
        <div class="pill">RSNA.txt esasynda</div>
      </div>
      <div class="content-grid">${renderSnippetCards()}</div>
    </section>

    <section class="card note-card">
      <div class="section-header">
        <div>
          <p class="eyebrow">Goşmaça bellik</p>
          <h2>Erkin ýazgy</h2>
          <p class="muted">Awtomatlaşdyrma üpjün etmeýän jikme-jiklikleri goşuň.</p>
        </div>
        <div class="pill">Islege görä</div>
      </div>
      <textarea data-field="customNotes" rows="3" placeholder="Meselem: kontrast toplama ýok, dinamika boýunça üýtgeşme bar ..."></textarea>
    </section>

    <section class="card preview-card">
      <div class="section-header">
        <div>
          <p class="eyebrow">Netije</p>
          <h2>Awtodöredilen tekst</h2>
          <p class="muted">Saýlanan wariantlar esasynda düzülen görnüşli tekst.</p>
        </div>
        <div class="actions">
          <button id="copyReport" class="btn ghost">Köçürmek</button>
          <button id="exportDoc" class="btn">Word görnüşinde eksport</button>
        </div>
      </div>
      <div class="chip-row" id="selectionChips"></div>
      <textarea id="reportText" rows="12" readonly></textarea>
    </section>

    <section class="card db-card">
      <div class="section-header">
        <div>
          <p class="eyebrow">Protokol ammary</p>
          <h2>SQL.js bilen ýerli ýatda saklamak</h2>
          <p class="muted">Döreden protokollaryňyzy offline görnüşde saklap, gaýtadan ulanyň.</p>
        </div>
        <div class="pill" id="dbStatus">Ýüklenýär...</div>
      </div>
      <div class="db-grid">
        <div class="form-field">
          <span>Protokolyň ady</span>
          <input id="protocolTitle" type="text" placeholder="Mysal: Diskirkulýar 65 ýaş" />
        </div>
        <div class="db-actions">
          <button id="saveProtocol" class="btn">Ýatda saklamak</button>
          <button id="refreshProtocolList" class="btn ghost">Sanawy täzeden al</button>
        </div>
      </div>
      <div id="protocolList" class="protocol-list"></div>
    </section>
  `;
}

function renderSnippetCards() {
  return RSNA_SNIPPETS.map(
    (section) => `
      <article class="content-card selection-card" data-section="${section.id}">
        <div class="card-header">
          <p class="eyebrow">Patologiýa bölümi</p>
          <h3>${section.title}</h3>
        </div>
        <div class="option-list">
          ${section.options
            .map(
              (option, idx) => `
                <label class="option">
                  <input type="checkbox" data-category="${section.id}" data-value="${option}" id="${section.id}-${idx}" />
                  <span>${option}</span>
                </label>
              `,
            )
            .join("")}
        </div>
      </article>
    `,
  ).join("");
}

function bindInteractions() {
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

  document.querySelectorAll("[data-category]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      toggleSelection(checkbox.dataset.category, checkbox.dataset.value, checkbox.checked);
      updateReportPreview();
    });
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
    refreshButton.addEventListener("click", () => renderProtocolList());
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

  RSNA_SNIPPETS.forEach((section) => {
    const selected = state.selections[section.id];
    if (selected && selected.length) {
      lines.push(`${section.title}:`);
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

async function initDatabase() {
  const status = document.getElementById("dbStatus");
  try {
    SQL = await initSqlJs({
      locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.9.0/${file}`,
    });
    const persisted = localStorage.getItem(DB_KEY);
    db = persisted ? new SQL.Database(toUint8Array(persisted)) : new SQL.Database();
    db.run(
      `CREATE TABLE IF NOT EXISTS protocols (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        report TEXT NOT NULL,
        created_at TEXT NOT NULL
      )`,
    );
    if (status) status.textContent = "Işjeň";
  } catch (error) {
    console.error("SQL.js ýüklemekde ýalňyşlyk", error);
    if (status) status.textContent = "Ýalňyşlyk";
  }
}

function persistDb() {
  if (!db) return;
  const data = db.export();
  localStorage.setItem(DB_KEY, toBase64(data));
}

function renderProtocolList() {
  const list = document.getElementById("protocolList");
  if (!list) return;
  if (!db) {
    list.innerHTML = `<p class="muted">SQL.js ýüklenýänçä garaşyň...</p>`;
    return;
  }
  const stmt = db.prepare("SELECT id, title, created_at FROM protocols ORDER BY created_at DESC");
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();

  if (!rows.length) {
    list.innerHTML = `<p class="muted">Entäk saklanan protokol ýok.</p>`;
    return;
  }

  list.innerHTML = rows
    .map(
      (row) => `
        <div class="protocol-row">
          <div>
            <p class="protocol-title">${row.title}</p>
            <p class="muted">${new Date(row.created_at).toLocaleString()}</p>
          </div>
          <div class="row-actions">
            <button class="btn ghost" data-load="${row.id}">Ýükle</button>
            <button class="btn ghost danger" data-delete="${row.id}">Pozmak</button>
          </div>
        </div>
      `,
    )
    .join("");

  list.querySelectorAll("[data-load]").forEach((btn) => {
    btn.addEventListener("click", () => loadProtocol(Number(btn.dataset.load)));
  });

  list.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => deleteProtocol(Number(btn.dataset.delete)));
  });
}

function saveProtocolHandler() {
  const titleInput = document.getElementById("protocolTitle");
  const preview = document.getElementById("reportText");
  if (!db || !titleInput || !preview) return;

  const title = titleInput.value.trim();
  if (!title) {
    alert("Protokolyň adyny giriziň.");
    return;
  }
  if (!preview.value) {
    alert("Ilki bilen netije dörediň.");
    return;
  }

  const stmt = db.prepare("INSERT INTO protocols (title, report, created_at) VALUES (?, ?, ?)");
  stmt.run([title, preview.value, new Date().toISOString()]);
  stmt.free();
  persistDb();
  renderProtocolList();
  titleInput.value = "";
  alert("Protokol üstünlikli saklandy.");
}

function loadProtocol(id) {
  if (!db) return;
  const stmt = db.prepare("SELECT report FROM protocols WHERE id = ?");
  stmt.bind([id]);
  if (stmt.step()) {
    const { report } = stmt.getAsObject();
    const preview = document.getElementById("reportText");
    if (preview) {
      preview.value = report;
    }
  }
  stmt.free();
}

function deleteProtocol(id) {
  if (!db) return;
  const stmt = db.prepare("DELETE FROM protocols WHERE id = ?");
  stmt.run([id]);
  stmt.free();
  persistDb();
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

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function toUint8Array(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
