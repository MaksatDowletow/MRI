const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "mri_reports.db");
let db;

function initDb() {
  db = new Database(dbPath);
  const initSql = fs.readFileSync(path.join(__dirname, "sql", "init.sql"), "utf8");
  db.exec(initSql);
}

function savePatient(patient) {
  const stmt = db.prepare(
    `INSERT INTO patients (full_name, birth_date, gender, hospital_id)
     VALUES (@full_name, @birth_date, @gender, @hospital_id)`
  );
  const info = stmt.run(patient);
  return info.lastInsertRowid;
}

function saveStudy(study) {
  const stmt = db.prepare(
    `INSERT INTO studies (patient_id, study_date, modality, region, ref_physician, clinical_info, is_followup, prev_study_date)
     VALUES (@patient_id, @study_date, @modality, @region, @ref_physician, @clinical_info, @is_followup, @prev_study_date)`
  );
  const info = stmt.run(study);
  return info.lastInsertRowid;
}

function saveBrainReport(report) {
  const stmt = db.prepare(
    `INSERT INTO brain_mri_reports (
      study_id,
      artefacts_type,
      skull_shape,
      skull_sutures,
      skull_form_symmetry,
      posterior_fossa,
      lesions_ischemic,
      lesions_hemorrhagic,
      lesions_demyelinating,
      lesions_number,
      lesions_location,
      lesions_size,
      cysts_info,
      mass_info,
      ventricles_info,
      cisterns_info,
      subarachnoid_info,
      pituitary_info,
      orbit_info,
      temporal_bone_info,
      cranial_nerves_info,
      angio_info,
      conclusion,
      recommendations
    ) VALUES (
      @study_id,
      @artefacts_type,
      @skull_shape,
      @skull_sutures,
      @skull_form_symmetry,
      @posterior_fossa,
      @lesions_ischemic,
      @lesions_hemorrhagic,
      @lesions_demyelinating,
      @lesions_number,
      @lesions_location,
      @lesions_size,
      @cysts_info,
      @mass_info,
      @ventricles_info,
      @cisterns_info,
      @subarachnoid_info,
      @pituitary_info,
      @orbit_info,
      @temporal_bone_info,
      @cranial_nerves_info,
      @angio_info,
      @conclusion,
      @recommendations
    )`
  );
  const info = stmt.run(report);
  return info.lastInsertRowid;
}

function listPatients() {
  return db.prepare("SELECT * FROM patients ORDER BY id DESC").all();
}

function listStudies(patientId) {
  return db
    .prepare("SELECT * FROM studies WHERE patient_id = @patientId ORDER BY study_date DESC")
    .all({ patientId });
}

module.exports = {
  initDb,
  savePatient,
  saveStudy,
  saveBrainReport,
  listPatients,
  listStudies,
};
