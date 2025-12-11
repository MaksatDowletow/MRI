// renderForm.js
// SECTIONS sanawyna görä formany döredýär we ähli inputlary state bilen baglaýar.

import { SECTIONS } from "./schema.js";
import { reportState } from "./state.js";
import { translate } from "./i18n.js";

function createField(field) {
  const wrapper = document.createElement("div");
  wrapper.className = "form-field";

  const label = document.createElement("label");
  label.textContent = field.labelTm;
  label.setAttribute("for", field.name);

  let control;
  switch (field.type) {
    case "textarea":
      control = document.createElement("textarea");
      break;
    case "select":
      control = document.createElement("select");
      field.options?.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        control.appendChild(opt);
      });
      break;
    case "multiselect":
      control = document.createElement("select");
      control.multiple = true;
      field.options?.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        control.appendChild(opt);
      });
      break;
    default:
      control = document.createElement("input");
      control.type = field.type || "text";
  }

  control.id = field.name;
  control.name = field.name;

  const currentValue = reportState.getField(field.name);
  if (control.multiple && Array.isArray(currentValue)) {
    Array.from(control.options).forEach((opt) => {
      opt.selected = currentValue.includes(opt.value);
    });
  } else if (currentValue !== undefined) {
    control.value = currentValue;
  }

  control.addEventListener("input", (event) => {
    const value = control.multiple
      ? Array.from(control.selectedOptions).map((opt) => opt.value)
      : control.value;
    reportState.setField(field.name, value);
  });

  wrapper.appendChild(label);
  wrapper.appendChild(control);
  return wrapper;
}

function renderSection(section) {
  const sectionEl = document.createElement("section");
  sectionEl.className = "card form-section";

  const heading = document.createElement("h2");
  heading.textContent = translate(section.titleKey, section.titleKey);
  sectionEl.appendChild(heading);

  const grid = document.createElement("div");
  grid.className = "form-grid";

  section.fields.forEach((field) => {
    const fieldEl = createField(field);
    grid.appendChild(fieldEl);
  });

  sectionEl.appendChild(grid);
  return sectionEl;
}

export function renderForm(root) {
  root.innerHTML = "";
  SECTIONS.forEach((section) => {
    const sectionEl = renderSection(section);
    root.appendChild(sectionEl);
  });
}
