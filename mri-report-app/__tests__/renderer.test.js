const { JSDOM } = require("jsdom");
const { collectPathologyGroup, generateReportText, humanArtefact } = require("../renderer/renderer");

describe("renderer utils", () => {
  test("humanArtefact maps codes", () => {
    expect(humanArtefact("ýok")).toBe("Artefaktlar tapylmady");
    expect(humanArtefact("hereket")).toBe("Hereketden dörän artefaktlar");
    expect(humanArtefact("metal_klips")).toBe("Metal klips projektsiýasyndaky artefakt");
    expect(humanArtefact("other")).toBe("");
  });

  test("generateReportText renders follow-up content", () => {
    const study = {
      modality: "MRI",
      region: "Beýni",
      study_date: "2024-01-01",
      is_followup: true,
      prev_study_date: "2023-12-01",
      clinical_info: "Neuro sx",
    };
    const report = {
      artefacts_type: "ýok",
      lesions_ischemic: "A",
      lesions_hemorrhagic: "B",
      lesions_demyelinating: "C",
      ventricles_info: "V",
      cisterns_info: "Cis",
      subarachnoid_info: "Sub",
      pituitary_info: "Pit",
      orbit_info: "Orb",
      temporal_bone_info: "Temp",
      cranial_nerves_info: "Nerve",
      angio_info: "Angio",
      conclusion: "Done",
      recommendations: "Rec",
      cysts_info: "Cyst",
      mass_info: "Mass",
    };

    const text = generateReportText(study, report);
    expect(text).toContain("Gaýtadan barlag, öňki barlag senesi: 2023-12-01");
    expect(text).toContain("Artefaktlar tapylmady");
    expect(text).toContain("Angio");
    expect(text).toContain("Maslahatlar");
  });

  test("collectPathologyGroup joins checkbox values and notes", () => {
    const dom = new JSDOM(`
      <input id="r-ischemic-note" value="extra" />
      <input type="checkbox" data-pathology="ischemic" value="First" checked />
      <input type="checkbox" data-pathology="ischemic" value="Second" />
    `);
    global.document = dom.window.document;

    expect(collectPathologyGroup("ischemic")).toBe("First; extra");
  });
});
