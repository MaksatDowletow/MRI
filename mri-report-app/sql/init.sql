CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    birth_date TEXT,
    gender TEXT,
    hospital_id TEXT
);

CREATE TABLE IF NOT EXISTS studies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    study_date TEXT NOT NULL,
    modality TEXT DEFAULT 'MRI',
    region TEXT DEFAULT 'Beýni',
    ref_physician TEXT,
    clinical_info TEXT,
    is_followup INTEGER DEFAULT 0,
    prev_study_date TEXT,
    FOREIGN KEY(patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS brain_mri_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    study_id INTEGER NOT NULL,
    artefacts_type TEXT,
    skull_shape TEXT,
    skull_sutures TEXT,
    skull_form_symmetry TEXT,
    posterior_fossa TEXT,
    lesions_ischemic TEXT,
    lesions_hemorrhagic TEXT,
    lesions_demyelinating TEXT,
    lesions_number TEXT,
    lesions_location TEXT,
    lesions_size TEXT,
    cysts_info TEXT,
    mass_info TEXT,
    ventricles_info TEXT,
    cisterns_info TEXT,
    subarachnoid_info TEXT,
    pituitary_info TEXT,
    orbit_info TEXT,
    temporal_bone_info TEXT,
    cranial_nerves_info TEXT,
    angio_info TEXT,
    conclusion TEXT,
    recommendations TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(study_id) REFERENCES studies(id)
);
