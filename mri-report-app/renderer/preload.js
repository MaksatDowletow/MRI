const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  savePatient: (data) => ipcRenderer.invoke("patients:save", data),
  saveStudy: (data) => ipcRenderer.invoke("studies:save", data),
  saveReport: (data) => ipcRenderer.invoke("reports:save", data),
  listPatients: () => ipcRenderer.invoke("patients:list"),
  listStudies: (patientId) => ipcRenderer.invoke("studies:byPatient", patientId),
});
