// schema.js
// RSNA/022 şablonynyň strukturasyny saklaýar. Her bölümde meýdançalar we olaryň görnüşleri görkezilýär.
// Bu maglumat renderForm.js tarapyndan dinamiki formany döretmek üçin ulanylýar.

export const SECTIONS = [
  {
    id: "patient",
    titleKey: "section.patient",
    fields: [
      { name: "patient_name", labelTm: "Familiýasy, ady", type: "text", required: true },
      { name: "patient_code", labelTm: "Näsagyň kody / ID", type: "text", required: true },
      { name: "age", labelTm: "Ýaşy", type: "number", placeholder: "45", required: true },
      { name: "gender", labelTm: "Jynsy", type: "select", options: ["Erkek", "Aýal"], required: true },
      { name: "birth_year", labelTm: "Doglan ýyly", type: "number", placeholder: "1975" },
      { name: "exam_date", labelTm: "Barlagyň senesi", type: "date", required: true },
      { name: "referrer", labelTm: "Ugratýan lukman", type: "text", placeholder: "Nörolog lukman" },
      { name: "clinical_note", labelTm: "Kliniki maglumat / ugradyş sebäbi", type: "textarea" },
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
        hint: "Birnäçe sebit/sekansiýany saýlap bilersiňiz",
      },
      { name: "artefacts", labelTm: "Artefaktlar", type: "textarea", placeholder: "Artefaktlar ýok" },
      { name: "slice_plane", labelTm: "Kesim ugry", type: "text", placeholder: "tra, sag, cor kesimlerde" },
      { name: "contrast", labelTm: "Kontrast ulanmasy", type: "select", options: ["Ulanylmady", "Kontrast berildi"] },
    ],
  },
  {
    id: "structures",
    titleKey: "section.structures",
    fields: [
      { name: "skull", labelTm: "Kelle çanagynyň gurluşy", type: "textarea" },
      { name: "symmetry", labelTm: "Simmetriýa", type: "textarea" },
      { name: "parenchyma", labelTm: "Beýni parenhimasynyň üýtgemeleri", type: "textarea" },
      { name: "ventricles", labelTm: "Ventrikulýar sistema / Serebrospinal suwuklyk", type: "textarea" },
      { name: "vascular", labelTm: "Damar gurluşlary", type: "textarea" },
      { name: "sinuses", labelTm: "Paranazal sinuslar / mastoid", type: "textarea" },
    ],
  },
  {
    id: "result",
    titleKey: "section.result",
    fields: [{ name: "conclusion", labelTm: "Netije", type: "textarea", required: true }],
  },
  {
    id: "advice",
    titleKey: "section.advice",
    fields: [{ name: "recommendation", labelTm: "Maslahat", type: "textarea" }],
  },
];

export const SECTION_ORDER = SECTIONS.map((section) => section.id);

export function createEmptyReportState() {
  return SECTIONS.reduce((acc, section) => {
    section.fields.forEach((field) => {
      const defaultValue =
        field.defaultValue !== undefined
          ? field.defaultValue
          : field.type === "multiselect"
          ? []
          : "";
      acc[field.name] = defaultValue;
    });
    return acc;
  }, {});
}
