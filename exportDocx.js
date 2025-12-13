// exportDocx.js
// Ýönekeý Word (DOC) eksporty: hasabaty HTML görnüşinde ýygnap, .doc görnüşinde ýükleýär.

import { buildReportBlocks, generatePlainTextReport } from "./report.js";

function buildPatientHeader(blocks) {
  const patientBlock = blocks.find((block) => block.id === "patient");
  if (!patientBlock) return "";
  return `<div class="doc-header"><h2>Näsag we barlag</h2><ul>${patientBlock.lines
    .map((line) => `<li>${line}</li>`)
    .join("")}</ul></div>`;
}

export async function exportToDocx(reportData, blocks = []) {
  const plainText = generatePlainTextReport(reportData);
  if (!plainText) {
    alert("Ilki bilen gerekli meýdançalary dolduryň we hasabat dörediň.");
    return;
  }

  const sectionBlocks = blocks.length > 0 ? blocks : buildReportBlocks(reportData);
  const patientHeader = buildPatientHeader(sectionBlocks);
  const otherSections = sectionBlocks
    .filter((block) => block.id !== "patient")
    .map(
      (block) => `
        <section class="doc-section">
          <h3>${block.heading}</h3>
          <ul>
            ${block.lines.map((line) => `<li>${line}</li>`).join("")}
          </ul>
        </section>`
    )
    .join("\n");

  const html = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.5; }
          h1 { text-align: center; }
          h2, h3 { margin-bottom: 6px; }
          ul { padding-left: 18px; }
          .doc-section { margin-bottom: 10px; }
          .doc-header { border-bottom: 1px solid #ccc; margin-bottom: 12px; padding-bottom: 6px; }
        </style>
      </head>
      <body>
        <h1>RSNA/022 beýni MRT hasabaty</h1>
        ${patientHeader}
        ${otherSections}
      </body>
    </html>
  `;

  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const filename = `rsna-mri-${reportData.patient_name || "hasabat"}.doc`;
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
