const { contextBridge, ipcRenderer } = require("electron");
const { onCLS, onINP, onLCP } = require("web-vitals");

const sendRumMetric = (metric) => ipcRenderer.send("telemetry:rum", metric);
onCLS(sendRumMetric);
onINP(sendRumMetric);
onLCP(sendRumMetric);

contextBridge.exposeInMainWorld("api", {
  savePatient: (data) => ipcRenderer.invoke("patients:save", data),
  saveStudy: (data) => ipcRenderer.invoke("studies:save", data),
  saveReport: (data) => ipcRenderer.invoke("reports:save", data),
  listPatients: () => ipcRenderer.invoke("patients:list"),
  listStudies: (patientId) => ipcRenderer.invoke("studies:byPatient", patientId),
});

contextBridge.exposeInMainWorld("telemetry", {
  captureRum: sendRumMetric,
});

contextBridge.exposeInMainWorld("mriConfig", {
  sentryDsn: process.env.SENTRY_DSN || "",
  monitoringEndpoint: process.env.MONITORING_ENDPOINT || "",
});
