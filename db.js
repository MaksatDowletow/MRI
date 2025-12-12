const DB_KEY = "rsna_protocol_db";
const SQL_WASM_BASE = "https://cdn.jsdelivr.net/npm/sql.js@1.9.0/dist/";

let SQL = null;
let db = null;

export async function initDatabase(statusElement) {
  if (db) {
    if (statusElement) statusElement.textContent = "Işjeň";
    return db;
  }

  try {
    SQL = await loadSqlJs();
    const persisted = localStorage.getItem(DB_KEY);
    db = persisted ? new SQL.Database(toUint8Array(persisted)) : new SQL.Database();
    db.run(
      `CREATE TABLE IF NOT EXISTS protocols (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        report TEXT NOT NULL,
        created_at TEXT NOT NULL,
        state_json TEXT
      )`,
    );
    ensureStateColumn();
    if (statusElement) statusElement.textContent = "Işjeň";
  } catch (error) {
    console.error("SQL.js ýüklemekde ýalňyşlyk", error);
    if (statusElement) statusElement.textContent = "Ýalňyşlyk";
    throw error;
  }

  return db;
}

export function isDatabaseReady() {
  return Boolean(db);
}

export function renderProtocolList(listElement, { onLoad, onDelete }) {
  if (!listElement) return;
  if (!db) {
    listElement.innerHTML = `<p class="muted">SQL.js ýüklenýänçä garaşyň...</p>`;
    return;
  }

  const stmt = db.prepare("SELECT id, title, created_at FROM protocols ORDER BY created_at DESC");
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();

  if (!rows.length) {
    listElement.innerHTML = `<p class="muted">Entäk saklanan protokol ýok.</p>`;
    return;
  }

  listElement.innerHTML = rows
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

  listElement.querySelectorAll("[data-load]").forEach((btn) => {
    btn.addEventListener("click", () => onLoad?.(Number(btn.dataset.load)));
  });

  listElement.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => onDelete?.(Number(btn.dataset.delete)));
  });
}

export function saveProtocol({ title, report, state }) {
  if (!db) return;
  const stmt = db.prepare(
    "INSERT INTO protocols (title, report, created_at, state_json) VALUES (?, ?, ?, ?)",
  );
  stmt.run([title, report, new Date().toISOString(), JSON.stringify(state)]);
  stmt.free();
  persistDb();
}

export function fetchProtocol(id) {
  if (!db) return null;
  const stmt = db.prepare("SELECT report, state_json FROM protocols WHERE id = ?");
  stmt.bind([id]);
  let result = null;
  if (stmt.step()) {
    const { report, state_json: stateJson } = stmt.getAsObject();
    result = { report, state: safeParse(stateJson) };
  }
  stmt.free();
  return result;
}

export function deleteProtocol(id) {
  if (!db) return;
  const stmt = db.prepare("DELETE FROM protocols WHERE id = ?");
  stmt.run([id]);
  stmt.free();
  persistDb();
}

function ensureStateColumn() {
  if (!db) return;
  const info = db.exec("PRAGMA table_info('protocols')");
  const hasStateColumn = info?.[0]?.values?.some((col) => col[1] === "state_json");
  if (!hasStateColumn) {
    db.run("ALTER TABLE protocols ADD COLUMN state_json TEXT");
    persistDb();
  }
}

function persistDb() {
  if (!db) return;
  const data = db.export();
  localStorage.setItem(DB_KEY, toBase64(data));
}

function loadSqlJs() {
  if (SQL) return Promise.resolve(SQL);
  if (window.initSqlJs) {
    return window.initSqlJs({ locateFile: (file) => `${SQL_WASM_BASE}${file}` });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${SQL_WASM_BASE}sql-wasm.js`;
    script.async = true;

    script.onload = () => {
      if (window.initSqlJs) {
        window
          .initSqlJs({ locateFile: (file) => `${SQL_WASM_BASE}${file}` })
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error("initSqlJs globala goşulmady"));
      }
    };

    script.onerror = () => reject(new Error("SQL.js skripti ýüklenmedi"));
    document.head.appendChild(script);
  });
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

function safeParse(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn("State formatyny okap bolmady", error);
    return null;
  }
}
