// report.js
// reportState maglumatlaryna görä Turkmençe hasabat tekstini döredýär.

import { SECTIONS } from "./schema.js";

const SECTION_LABELS = {
  general: "Umumy maglumatlar:",
  flow: "Barlag akymy:",
  structures: "Gurluşlar we simmetriýa:",
  result: "Netije:",
  advice: "Maslahat:",
};

function formatLine(label, value) {
  if (!value || (Array.isArray(value) && value.length === 0)) return "";
  if (Array.isArray(value)) {
    return `- ${label} ${value.join(", ")}`;
  }
  return `- ${label} ${value}`;
}

export function generatePlainTextReport(reportData) {
  const blocks = SECTIONS.map((section) => {
    const heading = SECTION_LABELS[section.id] || section.id;
    const lines = section.fields
      .map((field) => formatLine(field.labelTm, reportData[field.name]))
      .filter(Boolean)
      .join("\n");

    if (!lines) return "";
    return `${heading}\n${lines}`;
  }).filter(Boolean);

  return blocks.join("\n\n");
}
