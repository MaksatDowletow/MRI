// state.js
// Ýönekeý observable görnüşli state dolandyryşy. reportState data modelini saklaýar.

const listeners = [];

export const reportState = {
  data: {},

  init(initialData = {}) {
    this.data = { ...initialData };
    this.notify();
  },

  setField(name, value) {
    this.data = { ...this.data, [name]: value };
    this.notify();
  },

  getField(name) {
    return this.data[name];
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
