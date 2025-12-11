// state.js
// Ýönekeý observable görnüşli state dolandyryşy. reportState data modelini saklaýar.

import { createEmptyReportState } from "./schema.js";

const listeners = [];

export const reportState = {
  data: createEmptyReportState(),
  baseState: createEmptyReportState(),

  init(initialData = {}) {
    this.baseState = createEmptyReportState();
    this.data = { ...this.baseState, ...initialData };
    this.notify();
  },

  setField(name, value) {
    this.data = { ...this.data, [name]: value };
    this.notify();
  },

  getField(name) {
    return this.data[name];
  },

  isDirty() {
    return Object.entries(this.data).some(([key, value]) => {
      const baseValue = this.baseState[key];
      if (Array.isArray(value)) {
        return value.length > 0 && JSON.stringify(value) !== JSON.stringify(baseValue || []);
      }
      return value !== baseValue && value !== "" && value !== null && value !== undefined;
    });
  },

  subscribe(listener) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index >= 0) listeners.splice(index, 1);
    };
  },

  notify() {
    listeners.forEach((listener) => listener(this.data));
  },
};
