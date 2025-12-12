const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./db");

const monitoringEndpoint = process.env.MONITORING_ENDPOINT || "";

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "renderer", "preload.js"),
      contextIsolation: true,
    },
  });

  win.loadFile(path.join(__dirname, "renderer", "index.html"));
}

app.whenReady().then(() => {
  db.initDb();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("patients:save", (event, patient) => db.savePatient(patient));
ipcMain.handle("studies:save", (event, study) => db.saveStudy(study));
ipcMain.handle("reports:save", (event, report) => db.saveBrainReport(report));

ipcMain.handle("patients:list", () => db.listPatients());
ipcMain.handle("studies:byPatient", (event, patientId) => db.listStudies(patientId));

ipcMain.on("telemetry:rum", (_event, metric) => {
  const message = `[RUM] ${metric.name}=${metric.value?.toFixed?.(2) ?? metric.value}`;
  console.log(message);
  if (monitoringEndpoint) {
    fetch(monitoringEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metric, source: "renderer" }),
    }).catch((err) => console.error("Failed to push RUM metric", err));
  }
});
