(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/@fnando/streamdeck/dist/events.js
  var require_events = __commonJS({
    "node_modules/@fnando/streamdeck/dist/events.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.InspectorEvents = exports.ActionEvents = exports.PluginEvents = exports.Events = void 0;
      var Events = class {
        debug(...args) {
          console.log(`[${this.constructor.name}]`, ...args);
        }
        handleMessage(_event) {
        }
        handleDidReceiveGlobalSettings(event) {
          this.debug("Received didReceiveGlobalSettings event:", event);
        }
        handleDidReceiveSettings(event) {
          this.debug("Received didReceiveSettings event:", event);
        }
        handleDidConnectToSocket() {
          this.debug("Received didConnectToSocket event");
        }
      };
      __name(Events, "Events");
      exports.Events = Events;
      var PluginEvents = class extends Events {
        handleTitleParametersDidChange(event) {
          this.debug("Received titleParametersDidChange event:", event);
        }
        handleDeviceDidConnect(event) {
          this.debug("Received deviceDidConnect event:", event);
        }
        handleDeviceDidDisconnect(event) {
          this.debug("Received deviceDidDisconnect event:", event);
        }
        handleApplicationDidLaunch(event) {
          this.debug("Received applicationDidLaunch event:", event);
        }
        handleApplicationDidTerminate(event) {
          this.debug("Received applicationDidTerminate event:", event);
        }
        handleSystemDidWakeUp(event) {
          this.debug("Received systemDidWakeUp event:", event);
        }
      };
      __name(PluginEvents, "PluginEvents");
      exports.PluginEvents = PluginEvents;
      var ActionEvents = class extends Events {
        handleKeyDown(event) {
          this.debug("Received keyDown event:", event);
        }
        handleKeyUp(event) {
          this.debug("Received keyUp event:", event);
        }
        handleWillAppear(event) {
          this.debug("Received willAppear event:", event);
        }
        handleWillDisappear(event) {
          this.debug("Received willDisappear event:", event);
        }
        handlePropertyInspectorDidAppear(event) {
          this.debug("Received propertyInspectorDidAppear event:", event);
        }
        handlePropertyInspectorDidDisappear(event) {
          this.debug("Received propertyInspectorDidAppear event:", event);
        }
        handleSendToPlugin(event) {
          this.debug("Received sendToPlugin event:", event);
        }
      };
      __name(ActionEvents, "ActionEvents");
      exports.ActionEvents = ActionEvents;
      var InspectorEvents = class extends Events {
        handleSendToPropertyInspector(event) {
          this.debug("Received sendToPropertyInspector event:", event);
        }
      };
      __name(InspectorEvents, "InspectorEvents");
      exports.InspectorEvents = InspectorEvents;
    }
  });

  // node_modules/@fnando/streamdeck/dist/OS.js
  var require_OS = __commonJS({
    "node_modules/@fnando/streamdeck/dist/OS.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.OS = void 0;
      var OS = class {
        constructor(params) {
          this.minimumVersion = params.minimumVersion;
          this.platform = params.platform;
        }
        toManifest() {
          return {
            Platform: this.platform,
            MinimumVersion: this.minimumVersion
          };
        }
      };
      __name(OS, "OS");
      exports.OS = OS;
    }
  });

  // node_modules/@fnando/streamdeck/dist/runHandler.js
  var require_runHandler = __commonJS({
    "node_modules/@fnando/streamdeck/dist/runHandler.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.runHandler = void 0;
      function runHandler(target, data) {
        const event = data.event;
        const handlerName = `handle${event[0].toUpperCase()}${event.substring(1)}`;
        const handler = target[handlerName];
        if (handler) {
          handler.call(target, Object.assign({ event: data.event }, data.payload));
          return;
        }
      }
      __name(runHandler, "runHandler");
      exports.runHandler = runHandler;
    }
  });

  // node_modules/@fnando/streamdeck/dist/Plugin.js
  var require_Plugin = __commonJS({
    "node_modules/@fnando/streamdeck/dist/Plugin.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Plugin = void 0;
      var events_1 = require_events();
      var OS_1 = require_OS();
      var runHandler_1 = require_runHandler();
      var Plugin2 = class extends events_1.PluginEvents {
        get id() {
          return false ? `dev.${this.idInternal}` : this.idInternal;
        }
        constructor(params) {
          var _a, _b;
          super();
          this.version = "";
          this.sdkVersion = 2;
          this.url = "";
          this.name = "";
          this.author = "";
          this.minimumSoftwareVersion = "5.0";
          this.category = "";
          this.description = "";
          this.actions = [];
          this.os = [];
          this.uuid = "";
          this.description = params.description;
          this.url = params.url;
          this.author = params.author;
          this.name = params.name;
          this.idInternal = params.id;
          this.actions = params.actions;
          this.version = params.version;
          this.category = (_a = params.category) !== null && _a !== void 0 ? _a : "";
          this.os = (_b = params.os) !== null && _b !== void 0 ? _b : [
            new OS_1.OS({ platform: "windows", minimumVersion: "10" }),
            new OS_1.OS({ platform: "mac", minimumVersion: "10.11" })
          ];
          this.actions.forEach((action) => {
            action.plugin = this;
          });
        }
        run() {
          const plugin = this;
          window.connectElgatoStreamDeckSocket = /* @__PURE__ */ __name(function connectElgatoStreamDeckSocket(port, uuid, registerEvent, _info) {
            const socket = new WebSocket(`ws://127.0.0.1:${port}`);
            plugin.socket = socket;
            plugin.uuid = uuid;
            socket.onopen = () => {
              plugin.send({ event: registerEvent, uuid });
              setTimeout(() => {
                plugin.getGlobalSettings();
                plugin.getSettings();
                plugin.handleDidConnectToSocket();
              }, 300);
            };
            socket.onmessage = ({ data: rawData }) => {
              const data = JSON.parse(rawData);
              if (data.event === "didReceiveGlobalSettings") {
                const payload = {
                  event: data.event,
                  settings: data.payload.settings
                };
                plugin.handleDidReceiveGlobalSettings(payload);
                plugin.actions.forEach((action2) => {
                  action2.handleDidReceiveGlobalSettings(payload);
                });
                return;
              }
              const action = plugin.actions.find((a) => a.uuid === data.action);
              if (!action) {
                (0, runHandler_1.runHandler)(plugin, data);
                return;
              }
              action.context = data.context;
              action.device = data.device;
              (0, runHandler_1.runHandler)(action, data);
              action.handleMessage(data);
            };
          }, "connectElgatoStreamDeckSocket");
        }
        send(payload) {
          var _a;
          (_a = this.socket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(payload));
        }
        toManifest() {
          const snippet = {
            Author: this.author,
            Actions: this.actions.map((a) => a.toManifest()),
            CodePath: "plugin.html",
            Icon: "images/plugin",
            Name: this.name,
            Description: this.description,
            PropertyInspectorPath: "inspector.html",
            Version: this.version,
            SDKVersion: this.sdkVersion,
            Software: { MinimumVersion: this.minimumSoftwareVersion },
            OS: this.os.map((o) => o.toManifest())
          };
          const optionals = [
            ["Category", this.category, this.category + (false ? " (dev)" : "")],
            ["URL", this.url, this.url]
          ];
          if (this.category) {
            snippet.CategoryIcon = "images/category";
          }
          optionals.forEach(([prop, condition, value]) => {
            if (condition) {
              snippet[prop] = value;
            }
          });
          return snippet;
        }
        getGlobalSettings() {
          this.send({
            event: "getGlobalSettings",
            context: this.uuid
          });
        }
        setGlobalSettings(payload) {
          this.send({
            event: "setGlobalSettings",
            context: this.uuid,
            payload
          });
          this.getGlobalSettings();
        }
        getSettings() {
          this.send({
            event: "getSettings",
            context: this.uuid
          });
        }
        setSettings(payload) {
          this.send({
            event: "setSettings",
            context: this.uuid,
            payload
          });
          this.getSettings();
        }
      };
      __name(Plugin2, "Plugin");
      exports.Plugin = Plugin2;
    }
  });

  // node_modules/@fnando/streamdeck/dist/State.js
  var require_State = __commonJS({
    "node_modules/@fnando/streamdeck/dist/State.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.State = void 0;
      var State = class {
        constructor(params) {
          var _a, _b, _c, _d, _e;
          this.showTitle = true;
          this.name = "";
          this.title = "";
          this.image = "";
          this.multiActionImage = "";
          this.action = params.action;
          this.image = params.image;
          this.multiActionImage = (_a = params.multiActionImage) !== null && _a !== void 0 ? _a : "";
          this.showTitle = (_b = params.showTitle) !== null && _b !== void 0 ? _b : true;
          this.name = (_c = params.name) !== null && _c !== void 0 ? _c : "";
          this.title = (_d = params.title) !== null && _d !== void 0 ? _d : "";
          this.fontSize = (_e = params.fontSize) !== null && _e !== void 0 ? _e : 16;
          this.align = params.align;
          this.underline = params.underline;
          this.fontStyle = params.fontStyle;
          this.titleColor = params.titleColor;
        }
        toManifest() {
          const actionName = this.action.constructor.name;
          const baseImagePath = `images/actions/${actionName}/${this.image}`;
          const snippet = { Image: baseImagePath };
          const optionals = [
            [
              "MultiActionImage",
              this.multiActionImage,
              `src/images/actions/${actionName}/${this.multiActionImage}`
            ],
            ["Name", this.name, this.name],
            ["Title", this.title, this.title],
            ["ShowTitle", this.showTitle === false, this.showTitle],
            ["FontSize", this.fontSize, String(this.fontSize)],
            ["FontUnderline", this.underline, this.underline],
            ["FontStyle", this.fontStyle, this.fontStyle],
            ["TitleAlignment", this.align, this.align],
            ["TitleColor", this.titleColor, this.titleColor]
          ];
          optionals.forEach(([prop, condition, value]) => {
            if (condition) {
              snippet[prop] = value;
            }
          });
          return snippet;
        }
      };
      __name(State, "State");
      exports.State = State;
    }
  });

  // node_modules/@fnando/streamdeck/dist/Target.js
  var require_Target = __commonJS({
    "node_modules/@fnando/streamdeck/dist/Target.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Target = void 0;
      var Target;
      (function(Target2) {
        Target2[Target2["both"] = 0] = "both";
        Target2[Target2["hardware"] = 1] = "hardware";
        Target2[Target2["software"] = 2] = "software";
      })(Target = exports.Target || (exports.Target = {}));
    }
  });

  // node_modules/@fnando/streamdeck/dist/Action.js
  var require_Action = __commonJS({
    "node_modules/@fnando/streamdeck/dist/Action.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Action = void 0;
      var events_1 = require_events();
      var State_1 = require_State();
      var Target_1 = require_Target();
      var Action = class extends events_1.ActionEvents {
        constructor(params) {
          var _a, _b, _c;
          super();
          this.tooltip = "";
          this.hasMultiActionSupport = true;
          this.inspectorName = "";
          this.states = [];
          this.plugin = void 0;
          this.context = "";
          this.device = "";
          this.name = params.name;
          this.tooltip = (_a = params.tooltip) !== null && _a !== void 0 ? _a : "";
          this.hasMultiActionSupport = (_b = params.hasMultiActionSupport) !== null && _b !== void 0 ? _b : true;
          this.inspectorName = (_c = params.inspectorName) !== null && _c !== void 0 ? _c : "";
          this.states = params.states.map((s) => new State_1.State(Object.assign({ action: this }, s)));
        }
        get uuid() {
          return `${this.plugin.id}.${this.constructor.name.toLowerCase()}`;
        }
        toManifest() {
          const snippet = {
            Icon: `images/actions/${this.constructor.name}`,
            UUID: this.uuid,
            Name: this.name + (false ? " (dev)" : ""),
            States: this.states.map((s) => s.toManifest())
          };
          const optionals = [
            [
              "PropertyInspectorPath",
              this.inspectorName,
              `inspectors/${this.inspectorName}.html`
            ],
            ["Tooltip", this.tooltip, this.tooltip],
            [
              "SupportedInMultiActions",
              this.hasMultiActionSupport === false,
              this.hasMultiActionSupport
            ]
          ];
          optionals.forEach(([prop, condition, value]) => {
            if (condition) {
              snippet[prop] = value;
            }
          });
          return snippet;
        }
        get id() {
          return `${this.plugin.id}.${this.constructor.name}`;
        }
        send(payload) {
          this.debug("Sending event:", payload);
          this.plugin.send(payload);
        }
        setTitle(input, { target = Target_1.Target.both, state } = {
          target: Target_1.Target.both
        }) {
          this.send({
            event: "setTitle",
            context: this.context,
            payload: {
              title: String(input),
              target,
              state
            }
          });
        }
        setImage(input, { target = Target_1.Target.both, state } = {
          target: Target_1.Target.both
        }) {
          this.send({
            event: "setImage",
            context: this.context,
            payload: {
              image: String(input),
              target,
              state
            }
          });
        }
        showAlert({ target = Target_1.Target.both, state } = {
          target: Target_1.Target.both
        }) {
          this.send({
            event: "showAlert",
            context: this.context,
            payload: {
              target,
              state
            }
          });
        }
        setSettings(payload) {
          this.send({
            event: "setSettings",
            context: this.context,
            payload
          });
          this.getSettings();
        }
        getSettings() {
          this.send({
            event: "getSettings",
            context: this.context
          });
        }
        setGlobalSettings(payload) {
          this.send({
            event: "setGlobalSettings",
            context: this.plugin.uuid,
            payload
          });
          this.getGlobalSettings();
        }
        getGlobalSettings() {
          this.send({
            event: "getGlobalSettings",
            context: this.plugin.uuid
          });
        }
        logMessage(message) {
          this.send({
            event: "logMessage",
            payload: { message }
          });
        }
        sendToPropertyInspector(payload) {
          this.send({
            action: this.id,
            event: "sendToPropertyInspector",
            context: this.context,
            payload
          });
        }
        openURL(url) {
          this.send({
            event: "openUrl",
            payload: { url }
          });
        }
        showOK({ target = Target_1.Target.both, state } = {
          target: Target_1.Target.both
        }) {
          this.plugin.send({
            event: "showOk",
            context: this.context,
            payload: {
              target,
              state
            }
          });
        }
        setState(state) {
          this.plugin.send({
            event: "setState",
            context: this.context,
            payload: { state }
          });
        }
        switchToProfile(profile) {
          this.plugin.send({
            event: "switchToProfile",
            context: this.context,
            device: this.device,
            payload: { profile }
          });
        }
      };
      __name(Action, "Action");
      exports.Action = Action;
    }
  });

  // node_modules/@fnando/streamdeck/dist/Inspector.js
  var require_Inspector = __commonJS({
    "node_modules/@fnando/streamdeck/dist/Inspector.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Inspector = void 0;
      var events_1 = require_events();
      var runHandler_1 = require_runHandler();
      var Inspector2 = class extends events_1.InspectorEvents {
        constructor({ plugin }) {
          super();
          this.uuid = "";
          this.plugin = plugin;
        }
        send(payload) {
          var _a;
          this.debug("Sending event:", payload);
          (_a = this.socket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(payload));
        }
        setGlobalSettings(payload) {
          this.send({
            event: "setGlobalSettings",
            context: this.uuid,
            payload
          });
          this.getGlobalSettings();
        }
        setSettings(payload) {
          this.send({
            event: "setSettings",
            context: this.uuid,
            payload
          });
          this.getSettings();
        }
        getGlobalSettings() {
          this.send({ event: "getGlobalSettings", context: this.uuid });
        }
        getSettings() {
          this.send({ event: "getSettings", context: this.uuid });
        }
        openURL(url) {
          this.send({ event: "openUrl", payload: { url } });
        }
        logMessage(message) {
          this.send({ event: "logMessage", payload: { message } });
        }
        run() {
          const inspector = this;
          window.connectElgatoStreamDeckSocket = /* @__PURE__ */ __name(function connectElgatoStreamDeckSocket(port, uuid, registerEvent, _info, _actionInfo) {
            const socket = new WebSocket(`ws://127.0.0.1:${port}`);
            inspector.socket = socket;
            inspector.uuid = uuid;
            socket.onmessage = ({ data: rawData }) => {
              const data = JSON.parse(rawData);
              if (data.event === "didReceiveGlobalSettings") {
                inspector.handleDidReceiveGlobalSettings({
                  event: data.event,
                  settings: data.payload.settings
                });
                return;
              }
              (0, runHandler_1.runHandler)(inspector, data);
            };
            socket.onopen = () => {
              inspector.send({ event: registerEvent, uuid });
              setTimeout(() => {
                inspector.getGlobalSettings();
                inspector.getSettings();
                inspector.handleDidConnectToSocket();
              }, 300);
            };
          }, "connectElgatoStreamDeckSocket");
        }
      };
      __name(Inspector2, "Inspector");
      exports.Inspector = Inspector2;
    }
  });

  // node_modules/@fnando/streamdeck/dist/index.js
  var require_dist = __commonJS({
    "node_modules/@fnando/streamdeck/dist/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      __exportStar(require_Plugin(), exports);
      __exportStar(require_Action(), exports);
      __exportStar(require_State(), exports);
      __exportStar(require_Inspector(), exports);
      __exportStar(require_events(), exports);
    }
  });

  // src/inspector.ts
  var import_streamdeck = __toESM(require_dist());
  var DefaultPropertyInspector = class extends import_streamdeck.Inspector {
    /**
     * {@inheritdoc}
     */
    constructor(args) {
      super(args);
      const fields = document.querySelectorAll("input, textarea, select, pi-authentication, pi-icon");
      fields.forEach((field) => {
        field.addEventListener("change", (e) => this.handleFieldUpdated(e));
      });
    }
    /**
     * {@inheritdoc}
     */
    handleDidConnectToSocket() {
      super.handleDidConnectToSocket();
      document.querySelectorAll("a[target=_blank]").forEach((el) => {
        el.addEventListener("click", (ev) => {
          this.openURL(el.getAttribute("href"));
          ev.preventDefault();
        });
      });
    }
    /**
     * {@inheritdoc}
     */
    handleDidReceiveGlobalSettings(event) {
      super.handleDidReceiveGlobalSettings(event);
      this.globalSettings = event.settings;
    }
    /**
     * {@inheritdoc}
     */
    handleDidReceiveSettings(event) {
      super.handleDidReceiveSettings(event);
      if (!Object.keys(event.settings).length) {
        this.setSettings(this.getDefaultSettings());
      } else {
        this.settings = event.settings;
        this.updateForm();
      }
    }
    /**
     * {@inheritdoc}
     */
    setSettings(payload) {
      super.setSettings(payload);
      this.settings = payload;
      this.updateForm();
    }
    /**
     * {@inheritdoc}
     */
    setGlobalSettings(payload) {
      super.setGlobalSettings(payload);
      this.globalSettings = payload;
    }
    /**
     * Invoked when the form needs to be updated based on updated settings.
     */
    updateForm() {
    }
  };
  __name(DefaultPropertyInspector, "DefaultPropertyInspector");
})();
