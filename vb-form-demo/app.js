const vbForm = document.getElementById("vbForm");
const dumpPanel = document.getElementById("dumpPanel");
const caption = document.getElementById("formCaption");
const dumpButton = document.getElementById("btnDump");

caption.textContent = "Карточка пациента";

const controlBlueprints = [
  {
    id: "lblName",
    type: "label",
    text: "Фамилия и имя",
    x: 16,
    y: 18,
    width: 180,
  },
  {
    id: "inputName",
    type: "text",
    name: "fullName",
    placeholder: "Например, Иванов А.А.",
    x: 16,
    y: 38,
    width: 260,
  },
  {
    id: "lblAge",
    type: "label",
    text: "Возраст",
    x: 296,
    y: 18,
    width: 120,
  },
  {
    id: "inputAge",
    type: "number",
    name: "age",
    min: 0,
    max: 110,
    x: 296,
    y: 38,
    width: 120,
  },
  {
    id: "lblVisit",
    type: "label",
    text: "Дата обследования",
    x: 436,
    y: 18,
    width: 180,
  },
  {
    id: "inputVisit",
    type: "text",
    name: "visitDate",
    placeholder: "ДД.ММ.ГГГГ",
    x: 436,
    y: 38,
    width: 150,
  },
  {
    id: "lblComplaint",
    type: "label",
    text: "Жалобы",
    x: 16,
    y: 86,
    width: 120,
  },
  {
    id: "inputComplaint",
    type: "textarea",
    name: "complaint",
    placeholder: "Опишите жалобы пациента...",
    x: 16,
    y: 106,
    width: 570,
    height: 100,
  },
  {
    id: "lblProtocol",
    type: "label",
    text: "Короткий протокол",
    x: 16,
    y: 224,
    width: 200,
  },
  {
    id: "inputProtocol",
    type: "select",
    name: "protocol",
    options: [
      { value: "", label: "Не выбран" },
      { value: "baseline", label: "Базовый" },
      { value: "vascular", label: "Сосудистый" },
      { value: "postop", label: "Послеоперационный" },
    ],
    x: 16,
    y: 244,
    width: 220,
  },
  {
    id: "checkContrast",
    type: "checkbox",
    name: "withContrast",
    label: "Контрастное усиление нужно",
    x: 260,
    y: 244,
    width: 240,
  },
  {
    id: "lblNotes",
    type: "label",
    text: "Примечания",
    x: 16,
    y: 284,
    width: 120,
  },
  {
    id: "inputNotes",
    type: "text",
    name: "notes",
    placeholder: "Например, левша, аллергии...",
    x: 16,
    y: 304,
    width: 420,
  },
];

const state = {
  fullName: "",
  age: "",
  visitDate: "",
  complaint: "",
  protocol: "",
  withContrast: false,
  notes: "",
};

function applyPosition(element, blueprint) {
  element.style.left = `${blueprint.x}px`;
  element.style.top = `${blueprint.y}px`;
  if (blueprint.width) {
    element.style.width = `${blueprint.width}px`;
  }
  if (blueprint.height) {
    element.style.height = `${blueprint.height}px`;
  }
}

function createControl(blueprint) {
  const wrapper = document.createElement("div");
  wrapper.className = "vb-control";
  wrapper.id = blueprint.id;
  applyPosition(wrapper, blueprint);

  switch (blueprint.type) {
    case "label": {
      const label = document.createElement("label");
      label.textContent = blueprint.text;
      wrapper.append(label);
      return wrapper;
    }
    case "text":
    case "number": {
      const label = document.createElement("label");
      label.textContent = blueprint.text ?? "";
      if (label.textContent) {
        label.htmlFor = blueprint.id + "Input";
        wrapper.append(label);
      }
      const input = document.createElement("input");
      input.type = blueprint.type;
      input.name = blueprint.name;
      input.id = blueprint.id + "Input";
      input.placeholder = blueprint.placeholder ?? "";
      if (blueprint.min !== undefined) input.min = blueprint.min;
      if (blueprint.max !== undefined) input.max = blueprint.max;
      input.addEventListener("input", () => {
        state[blueprint.name] = input.value;
      });
      wrapper.append(input);
      return wrapper;
    }
    case "textarea": {
      const label = document.createElement("label");
      label.textContent = blueprint.text ?? "";
      label.htmlFor = blueprint.id + "Input";
      wrapper.append(label);
      const textarea = document.createElement("textarea");
      textarea.name = blueprint.name;
      textarea.id = blueprint.id + "Input";
      textarea.placeholder = blueprint.placeholder ?? "";
      textarea.addEventListener("input", () => {
        state[blueprint.name] = textarea.value;
      });
      wrapper.append(textarea);
      return wrapper;
    }
    case "select": {
      const label = document.createElement("label");
      label.textContent = blueprint.text ?? "";
      label.htmlFor = blueprint.id + "Input";
      wrapper.append(label);
      const select = document.createElement("select");
      select.name = blueprint.name;
      select.id = blueprint.id + "Input";
      blueprint.options?.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option.value;
        opt.textContent = option.label;
        select.append(opt);
      });
      select.addEventListener("change", () => {
        state[blueprint.name] = select.value;
      });
      wrapper.append(select);
      return wrapper;
    }
    case "checkbox": {
      wrapper.classList.add("vb-checkbox");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = blueprint.name;
      input.id = blueprint.id + "Input";
      input.addEventListener("change", () => {
        state[blueprint.name] = input.checked;
      });
      const label = document.createElement("label");
      label.htmlFor = input.id;
      label.textContent = blueprint.label ?? "";
      wrapper.append(input, label);
      return wrapper;
    }
    default:
      return wrapper;
  }
}

function renderForm() {
  const fragment = document.createDocumentFragment();
  controlBlueprints.forEach((blueprint) => {
    const control = createControl(blueprint);
    fragment.append(control);
  });
  vbForm.append(fragment);
}

function dumpData() {
  dumpPanel.textContent = JSON.stringify(state, null, 2);
}

dumpButton.addEventListener("click", dumpData);

renderForm();
