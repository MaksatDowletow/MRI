// schema.js
// RSNA/022 şablonynyň strukturasyny saklaýar. Her bölümde meýdançalar we olaryň görnüşleri görkezilýär.
// Bu maglumat renderForm.js tarapyndan dinamiki formany döretmek üçin ulanylýar.

export const SECTIONS = [
  {
    id: "general",
    titleKey: "section.general",
    fields: [
      { name: "exam_date", labelTm: "Barlagyň senesi ?", type: "date" },
      { name: "patient_name", labelTm: "Familiyasy, ady ?", type: "text" },
      { name: "department", labelTm: "Bölüm ?", type: "text" },
      { name: "gender", labelTm: "Jynsy", type: "select", options: ["Erkek", "Aýal"] },
      { name: "birth_year", labelTm: "Doglan ýyly ?", type: "text" },
      { name: "patient_code", labelTm: "Näsagyň kody ?", type: "text" },
    ],
  },
  {
    id: "flow",
    titleKey: "section.flow",
    fields: [
      {
        name: "exam_types",
        labelTm: "Barlag usuly",
        type: "multiselect",
        options: ["Umumy", "T1", "T2", "T2_tirm", "Diffuz", "MRT angiografiýa"],
      },
      { name: "artefacts", labelTm: "Artefaktlar", type: "textarea" },
      { name: "slice_plane", labelTm: "Kesim ugry", type: "text" },
    ],
  },
  {
    id: "structures",
    titleKey: "section.structures",
    fields: [
      { name: "skull", labelTm: "Kelle çanagynyň gurluşy", type: "textarea" },
      { name: "symmetry", labelTm: "Simmetriýa", type: "textarea" },
      { name: "parenchyma", labelTm: "Beýni parenhimasynyň üýtgemeleri", type: "textarea" },
    ],
  },
  {
    id: "result",
    titleKey: "section.result",
    fields: [{ name: "conclusion", labelTm: "Netije", type: "textarea" }],
  },
  {
    id: "advice",
    titleKey: "section.advice",
    fields: [{ name: "recommendation", labelTm: "Maslahat", type: "textarea" }],
  },
];

export const SECTION_ORDER = SECTIONS.map((section) => section.id);
