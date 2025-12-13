function stripTags(content) {
  return String(content || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

class ClassList {
  constructor(element) {
    this.element = element;
    this.set = new Set();
  }

  add(...tokens) {
    tokens.filter(Boolean).forEach(token => this.set.add(token));
    this._sync();
  }

  remove(...tokens) {
    tokens.forEach(token => this.set.delete(token));
    this._sync();
  }

  toggle(token, force) {
    if (force === undefined) {
      if (this.set.has(token)) {
        this.set.delete(token);
        this._sync();
        return false;
      }
      this.set.add(token);
      this._sync();
      return true;
    }

    if (force) {
      this.set.add(token);
    } else {
      this.set.delete(token);
    }
    this._sync();
    return !!force;
  }

  contains(token) {
    return this.set.has(token);
  }

  _sync() {
    this.element._className = Array.from(this.set).join(' ');
  }
}

class Element {
  constructor(tagName, document) {
    this.tagName = tagName.toLowerCase();
    this.document = document;
    this.attributes = new Map();
    this.children = [];
    this.parent = null;
    this.classList = new ClassList(this);
    this.dataset = {};
    this.textContent = '';
    this._innerHTML = '';
    this.value = '';
    this.checked = false;
    this._listeners = new Map();
    this._className = '';
  }

  get id() {
    return this.attributes.get('id') || '';
  }

  set id(value) {
    if (value) {
      this.attributes.set('id', value);
      this.document?._registerId(value, this);
    } else {
      this.attributes.delete('id');
    }
  }

  get className() {
    return this._className;
  }

  set className(value) {
    this.setAttribute('class', value);
  }

  setAttribute(name, value) {
    if (name === 'id') {
      this.id = value;
      return;
    }

    if (name === 'class') {
      this.classList.set = new Set(String(value).split(/\s+/).filter(Boolean));
      this.classList._sync();
      return;
    }

    if (name === 'value') {
      this.value = String(value);
    }

    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    if (name === 'class') {
      return this._className;
    }
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }

  hasAttribute(name) {
    if (name === 'class') {
      return this._className.length > 0;
    }
    return this.attributes.has(name);
  }

  removeAttribute(name) {
    if (name === 'id') {
      this.id = '';
      return;
    }
    if (name === 'class') {
      this.classList.set.clear();
      this.classList._sync();
      return;
    }
    this.attributes.delete(name);
  }

  toggleAttribute(name, force) {
    if (force === undefined) {
      if (this.hasAttribute(name)) {
        this.removeAttribute(name);
        return false;
      }
      this.setAttribute(name, '');
      return true;
    }

    if (force) {
      this.setAttribute(name, '');
    } else {
      this.removeAttribute(name);
    }
    return !!force;
  }

  appendChild(child) {
    child.parent = this;
    this.children.push(child);
    return child;
  }

  prepend(child) {
    child.parent = this;
    this.children.unshift(child);
    return child;
  }

  addEventListener(event, handler) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event).push(handler);
  }

  dispatchEvent(event) {
    const listeners = this._listeners.get(event.type) || [];
    listeners.forEach(listener => listener(event));
  }

  focus() {
    // no-op for tests
  }

  select() {
    // stub for textarea selections
  }

  closest(selector) {
    let current = this;
    while (current) {
      if (current._matches(selector)) return current;
      current = current.parent;
    }
    return null;
  }

  querySelectorAll(selector) {
    const matches = [];
    for (const child of this.children) {
      if (child._matches(selector)) {
        matches.push(child);
      }
      matches.push(...child.querySelectorAll(selector));
    }
    return matches;
  }

  querySelector(selector) {
    for (const child of this.children) {
      if (child._matches(selector)) {
        return child;
      }
      const nested = child.querySelector(selector);
      if (nested) return nested;
    }
    return null;
  }

  _matches(selector) {
    const trimmed = selector.trim();

    if (trimmed.includes(',')) {
      return trimmed.split(',').some(part => this._matches(part));
    }

    if (trimmed.endsWith(':checked')) {
      const baseSelector = trimmed.replace(':checked', '');
      return this._matches(baseSelector) && !!this.checked;
    }

    if (trimmed.startsWith('.')) {
      const classes = trimmed
        .slice(1)
        .split('.')
        .filter(Boolean);

      return classes.every(cls => this.classList.contains(cls));
    }

    if (trimmed.startsWith('#')) {
      return this.id === trimmed.slice(1);
    }

    const attributeMatch = trimmed.match(/^([a-z0-9_-]+)?\[([^=\]]+)(="?([^\]"]+)"?)?\]$/i);
    if (attributeMatch) {
      const [, tag, attr, , value] = attributeMatch;
      if (tag && this.tagName !== tag.toLowerCase()) return false;
      const currentValue = this.getAttribute(attr);
      if (value === undefined) return currentValue !== null;
      return currentValue === value;
    }

    return this.tagName === trimmed.toLowerCase();
  }

  get innerHTML() {
    if (this.children.length) {
      return this.children.map(child => child.outerHTML || child.innerHTML || '').join('');
    }
    return this._innerHTML || '';
  }

  set innerHTML(value) {
    this.children = [];
    this._innerHTML = String(value);
    this.textContent = stripTags(value);
  }

  get innerText() {
    if (this.children.length) {
      return this.children.map(child => child.innerText).join('');
    }
    return stripTags(this._innerHTML || this.textContent);
  }

  get outerHTML() {
    const attrs = [];
    if (this.id) attrs.push(`id="${this.id}"`);
    if (this.className) attrs.push(`class="${this.className}"`);
    for (const [key, value] of this.attributes.entries()) {
      if (key === 'id' || key === 'class') continue;
      attrs.push(`${key}="${value}"`);
    }
    const open = `<${this.tagName}${attrs.length ? ' ' + attrs.join(' ') : ''}>`;
    const content = this.children.length ? this.children.map(child => child.outerHTML || child.innerHTML).join('') : this._innerHTML || this.textContent;
    return `${open}${content}</${this.tagName}>`;
  }
}

class Document extends Element {
  constructor() {
    super('document', null);
    this.document = this;
    this.body = new Element('body', this);
    this._idMap = new Map();
    this._listeners = new Map();
  }

  createElement(tag) {
    return new Element(tag, this);
  }

  getElementById(id) {
    return this._idMap.get(id) || null;
  }

  _registerId(id, element) {
    this._idMap.set(id, element);
  }

  addEventListener(event, handler) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event).push(handler);
  }

  dispatchEvent(event) {
    const listeners = this._listeners.get(event.type) || [];
    listeners.forEach(listener => listener(event));
  }

  querySelectorAll(selector) {
    return this.body.querySelectorAll(selector);
  }

  querySelector(selector) {
    return this.body.querySelector(selector);
  }

  execCommand() {
    // noop for legacy copy fallback
  }
}

function createTestDOM() {
  const document = new Document();
  const window = { document };
  return { document, window };
}

module.exports = { createTestDOM, Element, Document };
