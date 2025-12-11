// report.js
// reportState maglumatlaryna görä Turkmençe hasabat tekstini döredýär.

import { SECTIONS } from "./schema.js";

const SECTION_LABELS = {
  patient: "Näsag we ugradyş barada:",
  flow: "Barlag akymy:",
  structures: "Gurluşlar we simmetriýa:",
  result: "Netije:",
  advice: "Maslahat:",
};

function formatLine(label, value) {
  if (!value || (Array.isArray(value) && value.length === 0)) return "";
  if (Array.isArray(value)) {
    return `- ${label}: ${value.join(", ")}`;
  }
  return `- ${label}: ${value}`;
}

export function buildReportBlocks(reportData) {
  return SECTIONS.map((section) => {
    const heading = SECTION_LABELS[section.id] || section.id;
    const lines = section.fields
      .map((field) => formatLine(field.labelTm, reportData[field.name]))
      .filter(Boolean);

    return { id: section.id, heading, lines };
  }).filter((block) => block.lines.length > 0);
}

export function generatePlainTextReport(reportData) {
  const blocks = buildReportBlocks(reportData).map((block) => `${block.heading}\n${block.lines.join("\n")}`);
  return blocks.join("\n\n");
}
