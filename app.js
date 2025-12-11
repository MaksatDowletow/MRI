import { renderForm } from "./renderForm.js";
import { reportState } from "./state.js";
import { buildReportBlocks, generatePlainTextReport } from "./report.js";
import { translate } from "./i18n.js";
import { SECTIONS } from "./schema.js";

function createHero() {
  return `
    <section class="card hero">
      <div class="hero-header">
        <p class="eyebrow">RSNA MRI</p>
        <h1>RSNA görnüşli kelle beýni MRT hasabaty</h1>
        <p class="lead">
          Formanyň meýdançalary RSNA-niň MRI hasabat şablonlarynyň gurluşyna görä bölünýär.
          Barlag maglumatlaryny dolduryň, düwmä basyň we taýýar tekst şablonyny göçüriň.
        </p>
      </div>
      <ul class="hero-list">
        <li><strong>Strukturalaşdyrylan forma:</strong> näsag maglumatlary, kliniki bellikler we protokol bölümleri.</li>
        <li><strong>JS işlediji:</strong> "Hasabaty döret" düwmesi maglumatlary täzeleýär we göçürmäge taýýar edýär.</li>
        <li><strong>RSNA şablony:</strong> kliniki maglumatlar, tapyndylar, netijä we maslahatlar üçin aýratyn ýerler.</li>
      </ul>
    </section>
  `;
}

function createLayout() {
  return `
    ${createHero()}
    <div class="split-grid" aria-live="polite">
      <section class="card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Forma</p>
            <h2>${translate("section.patient", "Näsag maglumatlary")}</h2>
            <p class="muted">Bölümler RSNA MRI raportynyň standart böleklerine görä tertiplendi.</p>
          </div>
          <div class="actions-inline">
            <button id="reset-form" class="ghost" type="button">Arassala</button>
            <button id="generate-report" class="primary" type="button">Hasabaty döret</button>
          </div>
        </div>
        <div id="form-container"></div>
        <div class="form-actions">
          <button id="copy-json" class="ghost" type="button">JSON görnüşde sakla</button>
          <p class="helper-text">Meýdançalar dolduryldygyça hasabat we JSON bloklary awto täzeleýär.</p>
        </div>
      </section>
      <section class="card report-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">RSNA šablony</p>
            <h2>Hasabat görkezmesi</h2>
            <p class="muted">"Hasabaty döret" ýa-da meýdançalary dolduranyňyzdan soň, bloklar şu ýerde peýda bolýar.</p>
          </div>
          <button id="copy-text" class="ghost" type="button">Teksti göçür</button>
        </div>
        <div id="report-preview" class="report-preview" aria-live="polite"></div>
        <div class="report-meta">
          <h3>RSNA bölümleriniň sanawy</h3>
          <ul>
            ${SECTIONS.map((section) => `<li><strong>${translate(section.titleKey, section.titleKey)}</strong>: ${section.fields.length} meýdança</li>`).join("")}
          </ul>
        </div>
        <div class="code-block">
          <div class="code-heading">
            <span class="eyebrow">JSON schema snapshot</span>
            <span class="muted">Formadaky maglumatlaryň häzirki görnüşi</span>
          </div>
          <pre id="report-json"></pre>
        </div>
      </section>
    </div>
    <section class="card info-panel">
      <h2>RSNA MRI hasabaty barada gysga düşündiriş</h2>
      <div class="info-grid">
        <div>
          <h3>Strukturalaşdyrylan bloklar</h3>
          <p>RSNA derejesinde hasabatlar kliniki maglumatlar, tapyndylar (findings) we netijä görä bölünýär. Bu sahypada şol logika bilen maglumat ýygnalýar.</p>
          <ul class="muted-list">
            <li>Kliniki maglumatlar we ugradyş sebäbi.</li>
            <li>Protokol we sekansiýalar: T1, T2, FLAIR, DWI we angiografiýa bellikleri.</li>
            <li>Tapyndylar: parenhima, garynjyklar, damarlar, sinuslar.</li>
            <li>Netije we maslahat: gysga diagnostiki netijeler.</li>
          </ul>
        </div>
        <div>
          <h3>Ulanyş görkezmeleri</h3>
          <p>Formadan maglumat giriziň, soňra "Hasabaty döret" düwmesine basyp tekst şablonyny alyň. JSON snapshot bloky maglumatlary başga ulgamlar bilen integrasiýa etmek üçin amatlydyr.</p>
          <p class="muted">RSNA görnüşli şablonlary okuw/demo maksadynda ulanyp bilersiňiz; teksti özüňize görä üýtgetmekden erkin.</p>
        </div>
      </div>
    </section>
  `;
}

function renderPreview(container, data) {
  if (!container) return;
  const blocks = buildReportBlocks(data);
  if (blocks.length === 0) {
    container.innerHTML = '<p class="muted">Hasabat üçin maglumat giriziň we düwmä basyň. Bölümleýin tekst şu ýerde peýda bolar.</p>';
    return;
  }

  const content = blocks
    .map(
      (block) => `
        <article class="report-block" id="report-${block.id}">
          <h3>${block.heading}</h3>
          <ul>${block.lines.map((line) => `<li>${line}</li>`).join("")}</ul>
        </article>
      `,
    )
    .join("");

  container.innerHTML = content;
}

function renderJson(container, data) {
  if (!container) return;
  container.textContent = JSON.stringify(data, null, 2);
}

function wireActions() {
  const formContainer = document.getElementById("form-container");
  const previewContainer = document.getElementById("report-preview");
  const jsonContainer = document.getElementById("report-json");
  const generateButton = document.getElementById("generate-report");
  const resetButton = document.getElementById("reset-form");
  const copyTextButton = document.getElementById("copy-text");
  const copyJsonButton = document.getElementById("copy-json");

  reportState.init();
  renderForm(formContainer);
  renderPreview(previewContainer, reportState.data);
  renderJson(jsonContainer, reportState.data);

  const rerender = () => {
    renderPreview(previewContainer, reportState.data);
    renderJson(jsonContainer, reportState.data);
  };

  reportState.subscribe(rerender);

  generateButton?.addEventListener("click", () => {
    rerender();
    generateButton.classList.add("success-state");
    setTimeout(() => generateButton.classList.remove("success-state"), 1000);
  });

  resetButton?.addEventListener("click", () => {
    reportState.init();
    renderForm(formContainer);
    rerender();
  });

  copyTextButton?.addEventListener("click", async () => {
    const text = generatePlainTextReport(reportState.data);
    if (!text) return;
    await navigator.clipboard?.writeText(text);
    copyTextButton.textContent = "Göçürildi";
    setTimeout(() => (copyTextButton.textContent = "Teksti göçür"), 1200);
  });

  copyJsonButton?.addEventListener("click", async () => {
    const json = JSON.stringify(reportState.data, null, 2);
    await navigator.clipboard?.writeText(json);
    copyJsonButton.textContent = "JSON göçürildi";
    setTimeout(() => (copyJsonButton.textContent = "JSON görnüşde sakla"), 1200);
  });
}

export function renderApp() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = createLayout();
  wireActions();
}

renderApp();
