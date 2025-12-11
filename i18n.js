// i18n.js
// UI ýazgylaryny TM/RU/EN boýunça terjimelemek üçin ýönekeý funksiýa.

const DICTIONARY = {
  tm: {
    "section.patient": "Näsag / barlag maglumatlary",
    "section.flow": "Barlag akymy",
    "section.structures": "Gurluşlar we simmetriýa",
    "section.result": "Netije",
    "section.advice": "Maslahat",
  },
};

let currentLocale = "tm";

export function setLocale(locale) {
  currentLocale = locale;
}

export function translate(key, fallback = "") {
  return DICTIONARY[currentLocale]?.[key] || fallback || key;
}
