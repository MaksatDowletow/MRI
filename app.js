const highlights = [
  {
    title: "Beýni MRT barada gysgaça",
    text: "Bu sahypa RSNA görnüşli beýni MRT hasabatynyň iň wajyp böleklerini düşnükli görnüşde jemleýär. Ulanyjylar esasy maglumatlary okap, degişli bölümleri çalt tapyp bilerler.",
  },
  {
    title: "Näme üçin täzeleindik?",
    text: "Öňki forma we awtomatlaşdyrylan logika doly arassalandy. Indi diňe mazmuny beýan edýän, ýönekeý we okalmagy ýeňil görnüşde täsirli gollanma berýär.",
  },
  {
    title: "Kimler üçin?",
    text: "Radiologlar, lukmanlar we talyplar üçin düşündiriş. Dizaýn mobil enjamlar üçin hem amatly edilip, möhüm maglumatlary gönüden-göni görkezýär.",
  },
];

const sections = [
  {
    heading: "Esasy maglumatlar",
    body: "Hasabatyň girişinde barlagyň senesi, ugradyş maksady we näsagynyň esas üçin maglumatlary ýerleşýär. Beýannamalar gysga, düşünilişi aňsat bolmaly.",
    bullets: [
      "Barlygy tassyklaýan giriş bölegi",
      "Ugradyş sebäbi we kliniki belgi",
      "Barlag senesi we enjamynyň görnüşi",
    ],
  },
  {
    heading: "Protokol we sekansiýalar",
    body: "MRI sekansiýalarynyň tertibi we aýratynlyklary aýdylýar. T1, T2, FLAIR, DWI ýaly esasy bloklaryň her biri aýratyn bellik görnüşinde sanalýar.",
    bullets: [
      "T1/T2/FLAIR sekansiýalarynyň aýratynlyklary",
      "DWI/ADC bellikleri we gadaganlyk tapgylary",
      "Gadyrlandyrylan angiografiýa ýa-da kontrast goşundysy",
    ],
  },
  {
    heading: "Tapyndylar",
    body: "Beýni parenhimasynyň ýagdaýy, garynjyklar, damarlar we sinuslar boýunça tapyndylar gysga maddalar görnüşinde görkezilýär.",
    bullets: [
      "Parenhima we hemisferalaryň simmetriýasy",
      "Garynjyk ulgamy we likwor dolanyşygy",
      "Damarlaryň geçijiligi we sinuslaryň ýagdaşy",
    ],
  },
  {
    heading: "Netije we maslahat",
    body: "Netije bölüminde gysga diagnostiki netijeler we zerur bolsa maslahat goşulýar. Bu bölek näsagyň gatnaşygy üçin iň gysga we düşünilişli görnüşde ýazylýar.",
    bullets: [
      "Diagnozy görkezýän jemleýji jümle",
      "Gerek halatynda goşmaça barlag ýa-da dinamika",
      "Lukman üçin düşündiriş we maslahatlar",
    ],
  },
];

const notes = [
  "Maglumatlar diňe görkezme maksadynda berilýär; kliniki kararlaryň ýerine geçmeýär.",
  "Dizaýn we kod täzeden ýazyldy, öňki maglumatlar we forma logikasy arassalandy.",
  "Sahypa Turkmen dilinde taýýarlanyldy we gysga maddalar görnüşinde okalmaga ýeňil edildi.",
];

function createHighlights() {
  return highlights
    .map(
      (item) => `
        <article class="info-card">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `,
    )
    .join("");
}

function createSectionList() {
  return sections
    .map(
      (section) => `
        <article class="content-card">
          <div class="card-header">
            <p class="eyebrow">Bölüm</p>
            <h3>${section.heading}</h3>
          </div>
          <p class="muted">${section.body}</p>
          <ul>
            ${section.bullets.map((point) => `<li>${point}</li>`).join("")}
          </ul>
        </article>
      `,
    )
    .join("");
}

function createNotes() {
  return notes.map((note) => `<li>${note}</li>`).join("");
}

function renderApp() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <section class="hero">
      <div class="hero-text">
        <p class="eyebrow">Täzeden gurlan sahypa</p>
        <h1>Beýni MRT baradaky maglumatlaryň gysga beýany</h1>
        <p class="lead">
          Saýt doly täzelenip, diňe esasy maglumatlary ýetirýän ýönekeý görnüşde taýýarlanyldy. Köne forma gurluşy we
          awtomatlaşdyrylan logika öçürildi.
        </p>
        <div class="tags">
          <span class="tag">Täze dizaýn</span>
          <span class="tag">Ýönekeý mazmun</span>
          <span class="tag">RSNA nukdaýnazary</span>
        </div>
      </div>
      <div class="hero-panel">
        <h2>Gysga görkezme</h2>
        <p>
          Bu panelde möhüm maglumatlaryň sanawy ýerleşýär. Her bir bölümi okap, öz işiňizde ulanyp bilersiňiz. Dizaýn
          mobil we stol kompýuterleri üçin deň derejede amatly.
        </p>
        <ul class="hero-list">
          <li>Giriş, protokol, tapyndylar we netijä bölünýär.</li>
          <li>Tekstler gysga we düşünilişli görnüşde saklanylýar.</li>
          <li>Öňki maglumatlar we kod gurluşy arassalandy.</li>
        </ul>
      </div>
    </section>

    <section class="grid highlights">
      ${createHighlights()}
    </section>

    <section class="content">
      <div class="section-header">
        <div>
          <p class="eyebrow">Mazmun</p>
          <h2>RSNA görnüşindäki beýni MRT bölekleri</h2>
          <p class="muted">Her bölümde nähili maglumatlar ýerleşýändigi gysgaça düşündirilýär.</p>
        </div>
        <div class="badge">Täze logika</div>
      </div>
      <div class="content-grid">${createSectionList()}</div>
    </section>

    <section class="notes">
      <h2>Goşmaça bellikler</h2>
      <ul>
        ${createNotes()}
      </ul>
    </section>
  `;
}

renderApp();
