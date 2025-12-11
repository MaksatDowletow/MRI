// storage.js
// localStorage arkaly awtoýatda sakla / dikelt.

const STORAGE_KEY = "rsna_mri_report_draft";

export function saveDraft(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Autosave ýalňyşlygy", error);
  }
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Draft okamakda ýalňyşlyk", error);
    return null;
  }
}

export function clearDraft() {
  localStorage.removeItem(STORAGE_KEY);
}
