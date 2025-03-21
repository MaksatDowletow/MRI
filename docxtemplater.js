"use strict";

var _excluded = ["modules"];
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var DocUtils = require("./doc-utils.js");
DocUtils.traits = require("./traits.js");
DocUtils.moduleWrapper = require("./module-wrapper.js");
var createScope = require("./scope-manager.js");
var Lexer = require("./lexer.js");
var commonModule = require("./modules/common.js");
function deprecatedMessage(obj, message) {
  if (obj.hideDeprecations === true) {
    return;
  }
  // eslint-disable-next-line no-console
  console.warn(message);
}
function deprecatedMethod(obj, method) {
  if (obj.hideDeprecations === true) {
    return;
  }
  return deprecatedMessage(obj, "Deprecated method \".".concat(method, "\", view upgrade guide : https://docxtemplater.com/docs/api/#upgrade-guide, stack : ").concat(new Error().stack));
}
var _require = require("./errors.js"),
  throwMultiError = _require.throwMultiError,
  throwResolveBeforeCompile = _require.throwResolveBeforeCompile,
  throwRenderInvalidTemplate = _require.throwRenderInvalidTemplate,
  throwRenderTwice = _require.throwRenderTwice,
  XTInternalError = _require.XTInternalError,
  throwFileTypeNotIdentified = _require.throwFileTypeNotIdentified,
  throwFileTypeNotHandled = _require.throwFileTypeNotHandled,
  throwApiVersionError = _require.throwApiVersionError;
var logErrors = require("./error-logger.js");
var collectContentTypes = require("./collect-content-types.js");
var getDefaults = DocUtils.getDefaults,
  str2xml = DocUtils.str2xml,
  xml2str = DocUtils.xml2str,
  moduleWrapper = DocUtils.moduleWrapper,
  concatArrays = DocUtils.concatArrays,
  uniq = DocUtils.uniq,
  getDuplicates = DocUtils.getDuplicates,
  stableSort = DocUtils.stableSort,
  pushArray = DocUtils.pushArray;
var ctXML = "[Content_Types].xml";
var relsFile = "_rels/.rels";
var currentModuleApiVersion = [3, 44, 0];
function dropUnsupportedFileTypesModules(doc) {
  doc.modules = doc.modules.filter(function (module) {
    if (!module.supportedFileTypes) {
      return true;
    }
    if (!Array.isArray(module.supportedFileTypes)) {
      throw new Error("The supportedFileTypes field of the module must be an array");
    }
    var isSupportedModule = module.supportedFileTypes.includes(doc.fileType);
    if (!isSupportedModule) {
      module.on("detached");
    }
    return isSupportedModule;
  });
}
function verifyErrors(doc) {
  var compiled = doc.compiled;
  doc.errors = concatArrays(Object.keys(compiled).map(function (name) {
    return compiled[name].allErrors;
  }));
  if (doc.errors.length !== 0) {
    if (doc.options.errorLogging) {
      logErrors(doc.errors, doc.options.errorLogging);
    }
    throwMultiError(doc.errors);
  }
}
var Docxtemplater = /*#__PURE__*/function () {
  function Docxtemplater(zip) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$modules = _ref.modules,
      modules = _ref$modules === void 0 ? [] : _ref$modules,
      options = _objectWithoutProperties(_ref, _excluded);
    _classCallCheck(this, Docxtemplater);
    this.targets = [];
    this.rendered = false;
    this.scopeManagers = {};
    this.compiled = {};
    this.modules = [commonModule()];
    this.xmlDocuments = {};
    if (arguments.length === 0) {
      deprecatedMessage(this, "Deprecated docxtemplater constructor with no arguments, view upgrade guide : https://docxtemplater.com/docs/api/#upgrade-guide, stack : ".concat(new Error().stack));
      this.hideDeprecations = true;
      this.setOptions(options);
    } else {
      this.hideDeprecations = true;
      this.setOptions(options);
      if (!zip || !zip.files || typeof zip.file !== "function") {
        throw new Error("The first argument of docxtemplater's constructor must be a valid zip file (jszip v2 or pizzip v3)");
      }
      if (!Array.isArray(modules)) {
        throw new Error("The modules argument of docxtemplater's constructor must be an array");
      }
      for (var _i2 = 0; _i2 < modules.length; _i2++) {
        var _module = modules[_i2];
        this.attachModule(_module);
      }
      this.loadZip(zip);
      this.compile();
      this.v4Constructor = true;
    }
    this.hideDeprecations = false;
  }
  return _createClass(Docxtemplater, [{
    key: "verifyApiVersion",
    value: function verifyApiVersion(neededVersion) {
      neededVersion = neededVersion.split(".").map(function (i) {
        return parseInt(i, 10);
      });
      if (neededVersion.length !== 3) {
        throwApiVersionError("neededVersion is not a valid version", {
          neededVersion: neededVersion,
          explanation: "the neededVersion must be an array of length 3"
        });
      }
      if (neededVersion[0] !== currentModuleApiVersion[0]) {
        throwApiVersionError("The major api version do not match, you probably have to update docxtemplater with npm install --save docxtemplater", {
          neededVersion: neededVersion,
          currentModuleApiVersion: currentModuleApiVersion,
          explanation: "moduleAPIVersionMismatch : needed=".concat(neededVersion.join("."), ", current=").concat(currentModuleApiVersion.join("."))
        });
      }
      if (neededVersion[1] > currentModuleApiVersion[1]) {
        throwApiVersionError("The minor api version is not uptodate, you probably have to update docxtemplater with npm install --save docxtemplater", {
          neededVersion: neededVersion,
          currentModuleApiVersion: currentModuleApiVersion,
          explanation: "moduleAPIVersionMismatch : needed=".concat(neededVersion.join("."), ", current=").concat(currentModuleApiVersion.join("."))
        });
      }
      if (neededVersion[1] === currentModuleApiVersion[1] && neededVersion[2] > currentModuleApiVersion[2]) {
        throwApiVersionError("The patch api version is not uptodate, you probably have to update docxtemplater with npm install --save docxtemplater", {
          neededVersion: neededVersion,
          currentModuleApiVersion: currentModuleApiVersion,
          explanation: "moduleAPIVersionMismatch : needed=".concat(neededVersion.join("."), ", current=").concat(currentModuleApiVersion.join("."))
        });
      }
      return true;
    }
  }, {
    key: "setModules",
    value: function setModules(obj) {
      for (var _i4 = 0, _this$modules2 = this.modules; _i4 < _this$modules2.length; _i4++) {
        var _module2 = _this$modules2[_i4];
        _module2.set(obj);
      }
    }
  }, {
    key: "sendEvent",
    value: function sendEvent(eventName) {
      for (var _i6 = 0, _this$modules4 = this.modules; _i6 < _this$modules4.length; _i6++) {
        var _module3 = _this$modules4[_i6];
        _module3.on(eventName);
      }
    }
  }, {
    key: "attachModule",
    value: function attachModule(module) {
      if (this.v4Constructor) {
        throw new XTInternalError("attachModule() should not be called manually when using the v4 constructor");
      }
      deprecatedMethod(this, "attachModule");
      var moduleType = _typeof(module);
      if (moduleType === "function") {
        throw new XTInternalError("Cannot attach a class/function as a module. Most probably you forgot to instantiate the module by using `new` on the module.");
      }
      if (!module || moduleType !== "object") {
        throw new XTInternalError("Cannot attachModule with a falsy value");
      }
      if (module.requiredAPIVersion) {
        this.verifyApiVersion(module.requiredAPIVersion);
      }
      if (module.attached === true) {
        if (typeof module.clone === "function") {
          module = module.clone();
        } else {
          throw new Error("Cannot attach a module that was already attached : \"".concat(module.name, "\". The most likely cause is that you are instantiating the module at the root level, and using it for multiple instances of Docxtemplater"));
        }
      }
      module.attached = true;
      var wrappedModule = moduleWrapper(module);
      this.modules.push(wrappedModule);
      wrappedModule.on("attached");
      if (this.fileType) {
        dropUnsupportedFileTypesModules(this);
      }
      return this;
    }
  }, {
    key: "setOptions",
    value: function setOptions(options) {
      var _this$delimiters, _this$delimiters2;
      if (this.v4Constructor) {
        throw new Error("setOptions() should not be called manually when using the v4 constructor");
      }
      deprecatedMethod(this, "setOptions");
      if (!options) {
        throw new Error("setOptions should be called with an object as first parameter");
      }
      this.options = {};
      var defaults = getDefaults();
      for (var key in defaults) {
        var defaultValue = defaults[key];
        this.options[key] = options[key] != null ? options[key] : this[key] || defaultValue;
        this[key] = this.options[key];
      }
      (_this$delimiters = this.delimiters).start && (_this$delimiters.start = DocUtils.utf8ToWord(this.delimiters.start));
      (_this$delimiters2 = this.delimiters).end && (_this$delimiters2.end = DocUtils.utf8ToWord(this.delimiters.end));
      return this;
    }
  }, {
    key: "loadZip",
    value: function loadZip(zip) {
      if (this.v4Constructor) {
        throw new Error("loadZip() should not be called manually when using the v4 constructor");
      }
      deprecatedMethod(this, "loadZip");
      if (zip.loadAsync) {
        throw new XTInternalError("Docxtemplater doesn't handle JSZip version >=3, please use pizzip");
      }
      this.zip = zip;
      this.updateFileTypeConfig();
      this.modules = concatArrays([this.fileTypeConfig.baseModules.map(function (moduleFunction) {
        return moduleFunction();
      }), this.modules]);
      for (var _i8 = 0, _this$modules6 = this.modules; _i8 < _this$modules6.length; _i8++) {
        var _module4 = _this$modules6[_i8];
        _module4.zip = this.zip;
        _module4.docxtemplater = this;
      }
      dropUnsupportedFileTypesModules(this);
      return this;
    }
  }, {
    key: "precompileFile",
    value: function precompileFile(fileName) {
      var currentFile = this.createTemplateClass(fileName);
      currentFile.preparse();
      this.compiled[fileName] = currentFile;
    }
  }, {
    key: "compileFile",
    value: function compileFile(fileName) {
      this.compiled[fileName].parse();
    }
  }, {
    key: "getScopeManager",
    value: function getScopeManager(to, currentFile, tags) {
      var _this$scopeManagers;
      (_this$scopeManagers = this.scopeManagers)[to] || (_this$scopeManagers[to] = createScope({
        tags: tags,
        parser: this.parser,
        cachedParsers: currentFile.cachedParsers
      }));
      return this.scopeManagers[to];
    }
  }, {
    key: "resolveData",
    value: function resolveData(data) {
      var _this = this;
      deprecatedMethod(this, "resolveData");
      var errors = [];
      if (!Object.keys(this.compiled).length) {
        throwResolveBeforeCompile();
      }
      return Promise.resolve(data).then(function (data) {
        _this.data = data;
        _this.setModules({
          data: _this.data,
          Lexer: Lexer
        });
        _this.mapper = _this.modules.reduce(function (value, module) {
          return module.getRenderedMap(value);
        }, {});
        return Promise.all(Object.keys(_this.mapper).map(function (to) {
          var _this$mapper$to = _this.mapper[to],
            from = _this$mapper$to.from,
            data = _this$mapper$to.data;
          return Promise.resolve(data).then(function (data) {
            var currentFile = _this.compiled[from];
            currentFile.filePath = to;
            currentFile.scopeManager = _this.getScopeManager(to, currentFile, data);
            return currentFile.resolveTags(data).then(function (result) {
              currentFile.scopeManager.finishedResolving = true;
              return result;
            }, function (errs) {
              Array.prototype.push.apply(errors, errs);
            });
          });
        })).then(function (resolved) {
          if (errors.length !== 0) {
            if (_this.options.errorLogging) {
              logErrors(errors, _this.options.errorLogging);
            }
            throwMultiError(errors);
          }
          return concatArrays(resolved);
        });
      });
    }
  }, {
    key: "reorderModules",
    value: function reorderModules() {
      /**
       * Modules will be sorted according to priority.
       *
       * Input example:
       * [
       *   { priority: 1, name: "FooMod" },
       *   { priority: -1, name: "XMod" },
       *   { priority: 4, name: "OtherMod" }
       * ]
       *
       * Output example (sorted by priority in descending order):
       * [
       *   { priority: 4, name: "OtherMod" },
       *   { priority: 1, name: "FooMod" },
       *   { priority: -1, name: "XMod" }
       * ]
       */
      this.modules = stableSort(this.modules, function (m1, m2) {
        return (m2.priority || 0) - (m1.priority || 0);
      });
    }
  }, {
    key: "throwIfDuplicateModules",
    value: function throwIfDuplicateModules() {
      var duplicates = getDuplicates(this.modules.map(function (_ref2) {
        var name = _ref2.name;
        return name;
      }));
      if (duplicates.length > 0) {
        throw new XTInternalError("Detected duplicate module \"".concat(duplicates[0], "\""));
      }
    }
  }, {
    key: "compile",
    value: function compile() {
      var _this2 = this;
      deprecatedMethod(this, "compile");
      this.updateFileTypeConfig();
      this.throwIfDuplicateModules();
      this.reorderModules();
      if (Object.keys(this.compiled).length) {
        return this;
      }
      this.options = this.modules.reduce(function (options, module) {
        return module.optionsTransformer(options, _this2);
      }, this.options);
      this.options.xmlFileNames = uniq(this.options.xmlFileNames);
      for (var _i10 = 0, _this$options$xmlFile2 = this.options.xmlFileNames; _i10 < _this$options$xmlFile2.length; _i10++) {
        var fileName = _this$options$xmlFile2[_i10];
        var content = this.zip.files[fileName].asText();
        this.xmlDocuments[fileName] = str2xml(content);
      }
      this.setModules({
        zip: this.zip,
        xmlDocuments: this.xmlDocuments
      });
      this.getTemplatedFiles();
      /*
       * Loop inside all templatedFiles (ie xml files with content).
       * Sometimes they don't exist (footer.xml for example)
       */
      for (var _i12 = 0, _this$templatedFiles2 = this.templatedFiles; _i12 < _this$templatedFiles2.length; _i12++) {
        var _fileName = _this$templatedFiles2[_i12];
        if (this.zip.files[_fileName] != null) {
          this.precompileFile(_fileName);
        }
      }
      for (var _i14 = 0, _this$templatedFiles4 = this.templatedFiles; _i14 < _this$templatedFiles4.length; _i14++) {
        var _fileName2 = _this$templatedFiles4[_i14];
        if (this.zip.files[_fileName2] != null) {
          this.compileFile(_fileName2);
        }
      }
      this.setModules({
        compiled: this.compiled
      });
      verifyErrors(this);
      return this;
    }
  }, {
    key: "getRelsTypes",
    value: function getRelsTypes() {
      var rootRels = this.zip.files[relsFile];
      var rootRelsXml = rootRels ? str2xml(rootRels.asText()) : null;
      var rootRelationships = rootRelsXml ? rootRelsXml.getElementsByTagName("Relationship") : [];
      var relsTypes = {};
      for (var _i16 = 0; _i16 < rootRelationships.length; _i16++) {
        var relation = rootRelationships[_i16];
        relsTypes[relation.getAttribute("Target")] = relation.getAttribute("Type");
      }
      return relsTypes;
    }
  }, {
    key: "getContentTypes",
    value: function getContentTypes() {
      var contentTypes = this.zip.files[ctXML];
      var contentTypeXml = contentTypes ? str2xml(contentTypes.asText()) : null;
      var overrides = contentTypeXml ? contentTypeXml.getElementsByTagName("Override") : null;
      var defaults = contentTypeXml ? contentTypeXml.getElementsByTagName("Default") : null;
      return {
        overrides: overrides,
        defaults: defaults,
        contentTypes: contentTypes,
        contentTypeXml: contentTypeXml
      };
    }
  }, {
    key: "updateFileTypeConfig",
    value: function updateFileTypeConfig() {
      var fileType;
      if (this.zip.files.mimetype) {
        fileType = "odt";
      }
      this.relsTypes = this.getRelsTypes();
      var _this$getContentTypes = this.getContentTypes(),
        overrides = _this$getContentTypes.overrides,
        defaults = _this$getContentTypes.defaults,
        contentTypes = _this$getContentTypes.contentTypes,
        contentTypeXml = _this$getContentTypes.contentTypeXml;
      if (contentTypeXml) {
        this.filesContentTypes = collectContentTypes(overrides, defaults, this.zip);
        this.invertedContentTypes = DocUtils.invertMap(this.filesContentTypes);
        this.setModules({
          contentTypes: this.contentTypes,
          invertedContentTypes: this.invertedContentTypes
        });
      }
      for (var _i18 = 0, _this$modules8 = this.modules; _i18 < _this$modules8.length; _i18++) {
        var _module5 = _this$modules8[_i18];
        fileType = _module5.getFileType({
          zip: this.zip,
          contentTypes: contentTypes,
          contentTypeXml: contentTypeXml,
          overrides: overrides,
          defaults: defaults,
          doc: this
        }) || fileType;
      }
      if (fileType === "odt") {
        throwFileTypeNotHandled(fileType);
      }
      if (!fileType) {
        throwFileTypeNotIdentified(this.zip);
      }
      for (var _i20 = 0, _this$modules10 = this.modules; _i20 < _this$modules10.length; _i20++) {
        var _module6 = _this$modules10[_i20];
        for (var _i22 = 0, _ref4 = _module6.xmlContentTypes || []; _i22 < _ref4.length; _i22++) {
          var contentType = _ref4[_i22];
          pushArray(this.options.xmlFileNames, this.invertedContentTypes[contentType] || []);
        }
      }
      this.fileType = fileType;
      dropUnsupportedFileTypesModules(this);
      this.fileTypeConfig = this.options.fileTypeConfig || this.fileTypeConfig || Docxtemplater.FileTypeConfig[this.fileType]();
      return this;
    }
  }, {
    key: "renderAsync",
    value: function renderAsync(data) {
      var _this3 = this;
      this.hideDeprecations = true;
      var promise = this.resolveData(data);
      this.hideDeprecations = false;
      return promise.then(function () {
        return _this3.render();
      });
    }
  }, {
    key: "render",
    value: function render(data) {
      if (this.rendered) {
        throwRenderTwice();
      }
      this.rendered = true;
      if (Object.keys(this.compiled).length === 0) {
        this.compile();
      }
      if (this.errors.length > 0) {
        throwRenderInvalidTemplate();
      }
      if (arguments.length > 0) {
        this.data = data;
      }
      this.setModules({
        data: this.data,
        Lexer: Lexer
      });
      this.mapper || (this.mapper = this.modules.reduce(function (value, module) {
        return module.getRenderedMap(value);
      }, {}));
      var output = [];
      for (var to in this.mapper) {
        var _this$mapper$to2 = this.mapper[to],
          from = _this$mapper$to2.from,
          _data = _this$mapper$to2.data;
        var currentFile = this.compiled[from];
        currentFile.scopeManager = this.getScopeManager(to, currentFile, _data);
        currentFile.render(to);
        output.push([to, currentFile.content, currentFile]);
        delete currentFile.content;
      }
      for (var _i24 = 0; _i24 < output.length; _i24++) {
        var outputPart = output[_i24];
        var _outputPart = _slicedToArray(outputPart, 3),
          content = _outputPart[1],
          _currentFile = _outputPart[2];
        for (var _i26 = 0, _this$modules12 = this.modules; _i26 < _this$modules12.length; _i26++) {
          var _module7 = _this$modules12[_i26];
          if (_module7.preZip) {
            var result = _module7.preZip(content, _currentFile);
            if (typeof result === "string") {
              outputPart[1] = result;
            }
          }
        }
      }
      for (var _i28 = 0; _i28 < output.length; _i28++) {
        var _output$_i = _slicedToArray(output[_i28], 2),
          _to = _output$_i[0],
          _content = _output$_i[1];
        this.zip.file(_to, _content, {
          createFolders: true
        });
      }
      verifyErrors(this);
      this.sendEvent("syncing-zip");
      this.syncZip();
      // The synced-zip event is used in the subtemplate module for example
      this.sendEvent("synced-zip");
      return this;
    }
  }, {
    key: "syncZip",
    value: function syncZip() {
      for (var fileName in this.xmlDocuments) {
        this.zip.remove(fileName);
        var content = xml2str(this.xmlDocuments[fileName]);
        this.zip.file(fileName, content, {
          createFolders: true
        });
      }
    }
  }, {
    key: "setData",
    value: function setData(data) {
      deprecatedMethod(this, "setData");
      this.data = data;
      return this;
    }
  }, {
    key: "getZip",
    value: function getZip() {
      return this.zip;
    }
  }, {
    key: "createTemplateClass",
    value: function createTemplateClass(path) {
      var content = this.zip.files[path].asText();
      return this.createTemplateClassFromContent(content, path);
    }
  }, {
    key: "createTemplateClassFromContent",
    value: function createTemplateClassFromContent(content, filePath) {
      var xmltOptions = {
        filePath: filePath,
        contentType: this.filesContentTypes[filePath],
        relsType: this.relsTypes[filePath]
      };
      var defaults = getDefaults();
      var defaultKeys = pushArray(Object.keys(defaults), ["filesContentTypes", "fileTypeConfig", "fileType", "modules"]);
      for (var _i30 = 0; _i30 < defaultKeys.length; _i30++) {
        var key = defaultKeys[_i30];
        xmltOptions[key] = this[key];
      }
      return new Docxtemplater.XmlTemplater(content, xmltOptions);
    }
  }, {
    key: "getFullText",
    value: function getFullText(path) {
      return this.createTemplateClass(path || this.fileTypeConfig.textPath(this)).getFullText();
    }
  }, {
    key: "getTemplatedFiles",
    value: function getTemplatedFiles() {
      this.templatedFiles = this.fileTypeConfig.getTemplatedFiles(this.zip);
      pushArray(this.templatedFiles, this.targets);
      this.templatedFiles = uniq(this.templatedFiles);
      return this.templatedFiles;
    }
  }]);
}();
Docxtemplater.DocUtils = DocUtils;
Docxtemplater.Errors = require("./errors.js");
Docxtemplater.XmlTemplater = require("./xml-templater.js");
Docxtemplater.FileTypeConfig = require("./file-type-config.js");
Docxtemplater.XmlMatcher = require("./xml-matcher.js");
module.exports = Docxtemplater;
module.exports["default"] = Docxtemplater;
