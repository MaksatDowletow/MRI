let currentPatientId = null;
let currentStudyId = null;

window.addEventListener("DOMContentLoaded", () => {
  wirePatientSection();
  wireReportSection();
  refreshPatients();
});

function wirePatientSection() {
  const saveBtn = document.getElementById("btn-save-patient");
  const loadBtn = document.getElementById("load-patients");

  saveBtn?.addEventListener("click", async () => {
    const patient = {
      full_name: document.getElementById("p-fullname")?.value || "",
      birth_date: document.getElementById("p-birth")?.value || "",
      gender: document.getElementById("p-gender")?.value || "",
      hospital_id: document.getElementById("p-id")?.value || "",
    };
    if (!patient.full_name) {
      setStatus("patient-status", "Ady ýazmaly.");
      return;
    }

    currentPatientId = await window.api.savePatient(patient);
    setStatus("patient-status", `Saklandy (ID: ${currentPatientId})`);
    refreshPatients();
  });

  loadBtn?.addEventListener("click", refreshPatients);
}

function wireReportSection() {
  const generateBtn = document.getElementById("btn-generate");
  generateBtn?.addEventListener("click", async () => {
    if (!currentPatientId) {
      alert("Ilki bilen pacient ýazylmaly.");
      return;
    }

    const study = {
      patient_id: currentPatientId,
      study_date: document.getElementById("s-date")?.value || new Date().toISOString().slice(0, 10),
      modality: "MRI",
      region: "Beýni",
      ref_physician: document.getElementById("s-ref")?.value || "",
      clinical_info: document.getElementById("s-clinical")?.value || "",
      is_followup: document.getElementById("s-is-followup")?.checked ? 1 : 0,
      prev_study_date: document.getElementById("s-prev-date")?.value || null,
    };
    currentStudyId = await window.api.saveStudy(study);

    const report = buildReportPayload();
    const reportId = await window.api.saveReport({ ...report, study_id: currentStudyId });

    const text = generateReportText(study, report);
    const output = document.getElementById("output-text");
    if (output) {
      output.value = text;
    }

    alert(`Hasabat saklandy (ID: ${reportId})`);
  });
}

function buildReportPayload() {
  const pathology = collectPathologySelections();
  return {
    artefacts_type: document.getElementById("r-artefacts")?.value || "",
    skull_shape: document.getElementById("r-skull-shape")?.value || "",
    skull_sutures: "",
    skull_form_symmetry: "",
    posterior_fossa: "",
    lesions_ischemic: pathology.ischemic,
    lesions_hemorrhagic: pathology.hemorrhagic,
    lesions_demyelinating: pathology.demyelinating,
    lesions_number: "",
    lesions_location: "",
    lesions_size: "",
    cysts_info: document.getElementById("r-cysts")?.value || "",
    mass_info: document.getElementById("r-mass")?.value || "",
    ventricles_info: document.getElementById("r-ventricles")?.value || "",
    cisterns_info: document.getElementById("r-cisterns")?.value || "",
    subarachnoid_info: document.getElementById("r-subarachnoid")?.value || "",
    pituitary_info: document.getElementById("r-pituitary")?.value || "",
    orbit_info: document.getElementById("r-orbit")?.value || "",
    temporal_bone_info: document.getElementById("r-temporal")?.value || "",
    cranial_nerves_info: document.getElementById("r-nerves")?.value || "",
    angio_info: document.getElementById("r-angio")?.value || "",
    conclusion: document.getElementById("r-conclusion")?.value || "",
    recommendations: document.getElementById("r-recommendations")?.value || "",
  };
}

function collectPathologySelections() {
  return {
    ischemic: collectPathologyGroup("ischemic"),
    hemorrhagic: collectPathologyGroup("hemorrhagic"),
    demyelinating: collectPathologyGroup("demyelinating"),
  };
}

function collectPathologyGroup(groupKey) {
  const selected = Array.from(document.querySelectorAll(`input[data-pathology='${groupKey}']`))
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value.trim())
    .filter(Boolean);

  const noteInput = document.getElementById(`r-${groupKey}-note`);
  const note = noteInput?.value.trim();
  if (note) {
    selected.push(note);
  }

  return selected.join("; ");
}

function generateReportText(study, r) {
  let txt = "";
  txt += "BEÝNI MRT – RSNA gurluşly hasabat\n\n";
  txt += "1) Umumy maglumatlar\n";
  txt += `Barlyk görnüşi: ${study.modality}, sebit: ${study.region}\n`;
  txt += `Barlag senesi: ${study.study_date}\n`;
  if (study.is_followup) {
    txt += `Gaýtadan barlag, öňki barlag senesi: ${study.prev_study_date || ""}\n`;
  }
  txt += `Kliniki maglumat: ${study.clinical_info}\n\n`;

  txt += "2) Barlag protokoly\n";
  txt += `Artefaktlar: ${humanArtefact(r.artefacts_type)}.\n\n`;

  txt += "3) Beýni parenhima we ojaklar\n";
  if (r.lesions_ischemic) txt += `Diskirkulýator üýtgemeler: ${r.lesions_ischemic}\n`;
  if (r.lesions_hemorrhagic) txt += `Gemorragik ojaklar: ${r.lesions_hemorrhagic}\n`;
  if (r.lesions_demyelinating) txt += `Demielinizasion üýtgemeler: ${r.lesions_demyelinating}\n`;
  txt += "\n";

  if (r.cysts_info) {
    txt += "4) Kistalar:\n";
    txt += `${r.cysts_info}\n\n`;
  }

  if (r.mass_info) {
    txt += "5) Dörän döremeler:\n";
    txt += `${r.mass_info}\n\n`;
  }

  txt += "6) Likwor giňişlikleri\n";
  if (r.ventricles_info) txt += `Injekler: ${r.ventricles_info}\n`;
  if (r.cisterns_info) txt += `Bazal sisternalar: ${r.cisterns_info}\n`;
  if (r.subarachnoid_info) txt += `Subarahnoidal giňişlikler: ${r.subarachnoid_info}\n`;
  txt += "\n";

  if (r.pituitary_info || r.orbit_info || r.temporal_bone_info || r.cranial_nerves_info) {
    txt += "7) Gipofiz, orbit, wagt süňki, kranial nerwler:\n";
    if (r.pituitary_info) txt += `Gipofiz: ${r.pituitary_info}\n`;
    if (r.orbit_info) txt += `Orbit: ${r.orbit_info}\n`;
    if (r.temporal_bone_info) txt += `Wagt süňki: ${r.temporal_bone_info}\n`;
    if (r.cranial_nerves_info) txt += `Kranial nerwler: ${r.cranial_nerves_info}\n`;
    txt += "\n";
  }

  if (r.angio_info) {
    txt += "8) MR-angiografiýa:\n";
    txt += `${r.angio_info}\n\n`;
  }

  txt += "9) Netije:\n";
  txt += `${r.conclusion}\n\n`;

  if (r.recommendations) {
    txt += "Maslahatlar:\n";
    txt += `${r.recommendations}\n`;
  }

  return txt;
}

function humanArtefact(code) {
  switch (code) {
    case "ýok":
      return "Artefaktlar tapylmady";
    case "hereket":
      return "Hereketden dörän artefaktlar";
    case "metal_klips":
      return "Metal klips projektsiýasyndaky artefakt";
    default:
      return "";
  }
}

async function refreshPatients() {
  const list = document.getElementById("patient-list");
  if (!list) return;
  const patients = await window.api.listPatients();
  if (!patients || patients.length === 0) {
    list.innerHTML = "<p class=\"muted\">Ýatda saklanan pacient ýok.</p>";
    return;
  }

  list.innerHTML = patients
    .map(
      (p) => `
        <button class="list-item" data-id="${p.id}">
          <strong>${p.full_name}</strong><br />
          <span class="muted">${p.birth_date || "?"} · ${p.gender || ""}</span>
        </button>
      `
    )
    .join("");

  list.querySelectorAll(".list-item").forEach((btn) => {
    btn.addEventListener("click", async () => {
      currentPatientId = Number(btn.dataset.id);
      setStatus("patient-status", `Saýlanan pacient ID: ${currentPatientId}`);
      await refreshStudies(currentPatientId);
    });
  });
}

async function refreshStudies(patientId) {
  const studies = await window.api.listStudies(patientId);
  if (studies.length > 0) {
    setStatus(
      "patient-status",
      `Saýlanan pacientde ${studies.length} barlag bar. Iň soňkysy: ${studies[0].study_date}.`
    );
  }
}

function setStatus(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
  }
}
