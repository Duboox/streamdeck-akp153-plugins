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
  var __export = (target, all) => {
    for (var name2 in all)
      __defProp(target, name2, { get: all[name2], enumerable: true });
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
      var Plugin3 = class extends events_1.PluginEvents {
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
          const plugin2 = this;
          window.connectElgatoStreamDeckSocket = /* @__PURE__ */ __name(function connectElgatoStreamDeckSocket(port, uuid, registerEvent, _info) {
            const socket = new WebSocket(`ws://127.0.0.1:${port}`);
            plugin2.socket = socket;
            plugin2.uuid = uuid;
            socket.onopen = () => {
              plugin2.send({ event: registerEvent, uuid });
              setTimeout(() => {
                plugin2.getGlobalSettings();
                plugin2.getSettings();
                plugin2.handleDidConnectToSocket();
              }, 300);
            };
            socket.onmessage = ({ data: rawData }) => {
              const data = JSON.parse(rawData);
              if (data.event === "didReceiveGlobalSettings") {
                const payload = {
                  event: data.event,
                  settings: data.payload.settings
                };
                plugin2.handleDidReceiveGlobalSettings(payload);
                plugin2.actions.forEach((action2) => {
                  action2.handleDidReceiveGlobalSettings(payload);
                });
                return;
              }
              const action = plugin2.actions.find((a) => a.uuid === data.action);
              if (!action) {
                (0, runHandler_1.runHandler)(plugin2, data);
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
      __name(Plugin3, "Plugin");
      exports.Plugin = Plugin3;
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
      var Action2 = class extends events_1.ActionEvents {
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
        openURL(url2) {
          this.send({
            event: "openUrl",
            payload: { url: url2 }
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
      __name(Action2, "Action");
      exports.Action = Action2;
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
        constructor({ plugin: plugin2 }) {
          super();
          this.uuid = "";
          this.plugin = plugin2;
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
        openURL(url2) {
          this.send({ event: "openUrl", payload: { url: url2 } });
        }
        logMessage(message) {
          this.send({ event: "logMessage", payload: { message } });
        }
        run() {
          const inspector2 = this;
          window.connectElgatoStreamDeckSocket = /* @__PURE__ */ __name(function connectElgatoStreamDeckSocket(port, uuid, registerEvent, _info, _actionInfo) {
            const socket = new WebSocket(`ws://127.0.0.1:${port}`);
            inspector2.socket = socket;
            inspector2.uuid = uuid;
            socket.onmessage = ({ data: rawData }) => {
              const data = JSON.parse(rawData);
              if (data.event === "didReceiveGlobalSettings") {
                inspector2.handleDidReceiveGlobalSettings({
                  event: data.event,
                  settings: data.payload.settings
                });
                return;
              }
              (0, runHandler_1.runHandler)(inspector2, data);
            };
            socket.onopen = () => {
              inspector2.send({ event: registerEvent, uuid });
              setTimeout(() => {
                inspector2.getGlobalSettings();
                inspector2.getSettings();
                inspector2.handleDidConnectToSocket();
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

  // src/plugin.ts
  var import_streamdeck2 = __toESM(require_dist());

  // src/streamdeck.json
  var streamdeck_exports = {};
  __export(streamdeck_exports, {
    author: () => author,
    category: () => category,
    default: () => streamdeck_default,
    description: () => description,
    id: () => id,
    monitor: () => monitor,
    name: () => name,
    url: () => url,
    version: () => version
  });
  var id = "com.mediabounds.streamdeck.jira";
  var version = "1.4.0";
  var name = "Jira";
  var description = "A Stream Deck plugin for finding issues in Jira or content in Confluence.";
  var author = "Daniel Pfeiffer";
  var category = "Jira";
  var monitor = {
    windows: [],
    mac: []
  };
  var url = "https://github.com/mediabounds/streamdeck-jira";
  var streamdeck_default = {
    id,
    version,
    name,
    description,
    author,
    category,
    monitor,
    url
  };

  // src/Client.ts
  var Response = class {
    constructor(headers, body) {
      this.headers = headers;
      this.body = body;
    }
    /**
     * Retrieves all headers from the response in a JSON-encodable format.
     *
     * @returns All headers in the response.
     */
    getAllHeaders() {
      const headers = {};
      this.headers.forEach((value, name2) => {
        headers[name2] = value;
      });
      return headers;
    }
    /**
     * Retrieves a specific header from the response.
     *
     * @param name - The name of the header.
     * @returns The value of the header
     */
    getHeader(name2) {
      return this.headers.get(name2);
    }
    /**
     * Retrieves the body of the response as a string.
     * 
     * Useful for logging the response.
     * 
     * @returns The body of the response as a string.
     */
    getBodyContents() {
      if (typeof this.body === "string") {
        return this.body;
      }
      return JSON.stringify(this.body, null, 2);
    }
  };
  __name(Response, "Response");
  var RequestError = class extends Error {
    constructor(response, statusText) {
      let message;
      let match;
      if (typeof response.body === "string") {
        message = response.body.replace(/(<([^>]+)>)/gi, "").trim();
      } else if (match = JSON.stringify(response.body).match(/(\[|:|^)"(.*?)"/)) {
        message = match[2];
      } else {
        message = statusText;
      }
      super(message);
      this.response = response;
    }
  };
  __name(RequestError, "RequestError");
  var Client = class {
    constructor(baseUrl, authenticator, defaultHeaders) {
      this.baseUrl = baseUrl;
      this.authenticator = authenticator;
      this.defaultHeaders = defaultHeaders;
    }
    /**
     * Perform an HTTP(S) request.
     * 
     * @param options - Options for the request.
     * @returns A promise that resolves to the response received from the server.
     */
    async request(options) {
      var _a, _b;
      const headers = new Headers();
      (_a = this.defaultHeaders) == null ? void 0 : _a.forEach((value, key) => headers.set(key, value));
      (_b = options.headers) == null ? void 0 : _b.forEach((value, key) => headers.append(key, value));
      if (this.authenticator) {
        headers.append("Authorization", this.authenticator.getAuthorizationHeader());
      }
      const result = await fetch(this.getUrl(options), {
        method: options.method,
        mode: options.mode,
        cache: options.cache,
        credentials: options.credentials,
        headers,
        redirect: options.redirect,
        referrerPolicy: options.referrerPolicy,
        body: options.body
      });
      const bodyText = await result.text();
      let success = result.ok;
      let body;
      try {
        body = JSON.parse(bodyText);
      } catch (error) {
        success = false;
        body = bodyText;
      }
      if (!success) {
        const response = new Response(result.headers, body);
        throw new RequestError(response, result.statusText);
      }
      return new Response(result.headers, body);
    }
    /**
     * Computes the full URL of the request (combining host, endpoint, and query parameters).
     * 
     * @param options - The current request options.
     * @returns The full URL of the request.
     */
    getUrl(options) {
      let url2 = `${this.baseUrl}/${options.endpoint}`;
      if (options.query) {
        url2 += `?${new URLSearchParams(options.query).toString()}`;
      }
      return url2;
    }
  };
  __name(Client, "Client");
  var BasicAuth = class {
    constructor(username, password) {
      this.username = username;
      this.password = password;
    }
    getAuthorizationHeader() {
      return `Basic ${btoa(`${this.username}:${this.password}`)}`;
    }
  };
  __name(BasicAuth, "BasicAuth");
  var TokenAuth = class {
    constructor(token) {
      this.token = token;
    }
    getAuthorizationHeader() {
      return `Bearer ${this.token}`;
    }
  };
  __name(TokenAuth, "TokenAuth");

  // src/JiraConnection.ts
  var JiraConnection = class {
    /**
     * Creates a new Client for making API requests.
     * 
     * @param settings - Connection settings for the client.
     * @returns A configured Client.
     */
    static getClient(settings) {
      const { domain, email: username, token: key, strategy } = settings;
      if (!domain) {
        throw new Error("A domain must be set");
      }
      if (!key) {
        throw new Error("An API token must be set");
      }
      let authenticator;
      if (strategy === "PAT") {
        authenticator = new TokenAuth(key);
      } else {
        authenticator = new BasicAuth(username, key);
      }
      return new Client(`https://${domain}`, authenticator);
    }
  };
  __name(JiraConnection, "JiraConnection");

  // src/Icon.ts
  var ICON_SIZE = 144;
  var DEFAULT_BADGE_SIZE = 25;
  var BADGE_PADDING = 10;
  var Icon = class {
    constructor() {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = ICON_SIZE;
      this.canvas = canvas;
    }
    /**
     * Generates an icon using a local file as the base.
     * 
     * @param file - The file to use as the icon.
     * @returns A promise that resolves to a loaded icon.
     */
    static fromLocalFile(file) {
      return new Promise((resolve, reject) => {
        const path = `file://${decodeURIComponent(file.name)}`;
        new Icon().addImage(path, 0, 0, ICON_SIZE, ICON_SIZE).then(resolve).catch(reject);
      });
    }
    /**
     * Retrieves the current 2D drawing context.
     * @returns The current 2D drawing context.
     */
    getContext() {
      return this.canvas.getContext("2d");
    }
    /**
     * Adds a bitmap image to the icon.
     * 
     * Note that this method is asynchronous -- the image must be loaded before it can be drawn.
     * 
     * @param imagePath - The relative path where the image can be found.
     * @param x - The x position where to draw the image (default = 0).
     * @param y - The y position where to draw the image (default = 0).
     * @param width - The width to use when drawing the image (defaults to the intrinsic width).
     * @param height - The height to use when drawing the image (defaults to the intrinsic height).
     * @returns A promise that resolves to the current once the image has been drawn.
     */
    addImage(imagePath, x = 0, y = 0, width, height) {
      const image = new Image();
      image.src = imagePath;
      return new Promise((resolve, reject) => {
        image.onload = () => {
          const ctx = this.getContext();
          ctx.drawImage(image, x, y, width, height);
          resolve(this);
        };
        image.onerror = (error) => reject(error);
      });
    }
    /**
     * Removes the current badge from the icon.
     * @returns The current icon.
     */
    clearBadge() {
      this.badge = null;
      return this;
    }
    /**
     * Sets parameters to use when drawing a badge.
     * @param options - Options for drawing the badge.
     * @returns The current icon.
     */
    setBadge(options) {
      this.badge = options;
      return this;
    }
    /**
     * Retrieves the current badge.
     * @returns The current options being applied when drawing the badge.
     */
    getBadge() {
      return this.badge;
    }
    /**
     * Renders a bitmap of the icon.
     * 
     * @param type - The type of image (default = image/png).
     * @returns A bitmap image of the rendered icon.
     */
    getImage(type = "image/png") {
      const finalCanvas = this.getCanvasCopy();
      if (this.badge) {
        Icon.drawBadge(finalCanvas, this.badge);
      }
      return finalCanvas.toDataURL(type);
    }
    /**
     * Generates a copy of the current canvas.
     * 
     * This is used for drawing a copy of the icon with a badge
     * without damaging the unbadged icon.
     * 
     * @returns A copy of the current canvas.
     */
    getCanvasCopy() {
      const canvas = document.createElement("canvas");
      canvas.height = this.canvas.height;
      canvas.width = this.canvas.width;
      canvas.getContext("2d").drawImage(this.canvas, 0, 0);
      return canvas;
    }
    /**
     * Draws a badge on an icon.
     * 
     * @param canvas - The canvas where the badge should be drawn.
     * @param options - The options to consider when drawing the badge.
     */
    static drawBadge(canvas, options) {
      var _a, _b, _c, _d, _e, _f, _g;
      if (typeof options === "undefined" || !options.value || options.value == "0") {
        return;
      }
      const coordinates = this.getBadgeCoordinates((_a = options.position) != null ? _a : "topright" /* TopRight */, (_b = options.size) != null ? _b : DEFAULT_BADGE_SIZE, canvas);
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.arc(coordinates.x, coordinates.y, (_c = options.size) != null ? _c : DEFAULT_BADGE_SIZE, 0, Math.PI * 2);
      ctx.fillStyle = (_d = options.color) != null ? _d : "red";
      ctx.fill();
      ctx.fillStyle = (_e = options.textColor) != null ? _e : "white";
      ctx.font = `${(_f = options.fontSize) != null ? _f : 32}px ${(_g = options.fontFamily) != null ? _g : "Helvetica, Arial, sans-serif"}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(options.value, coordinates.x, coordinates.y);
    }
    /**
     * Computes where a badge should be drawn on the icon.
     * 
     * @param position - Which corner the badge should be drawn in.
     * @param size - The radius of the badge.
     * @param canvas - The canvas containing the icon.
     * @returns X and Y coordinates where the badge should be drawn.
     */
    static getBadgeCoordinates(position, size, canvas) {
      return {
        x: position == "topleft" /* TopLeft */ || position == "bottomleft" /* BottomLeft */ ? BADGE_PADDING + size : canvas.width - BADGE_PADDING - size,
        y: position == "bottomleft" /* BottomLeft */ || position == "bottomright" /* BottomRight */ ? canvas.height - BADGE_PADDING - size : BADGE_PADDING + size
      };
    }
  };
  __name(Icon, "Icon");

  // src/actions/PollingAction.ts
  var import_streamdeck = __toESM(require_dist());

  // src/PollingClient.ts
  var PollingClient = class {
    constructor(target, context, delegate) {
      this.target = target;
      this.context = context;
      this.delegate = delegate;
    }
    /**
     * Immediately polls the target.
     */
    poll() {
      void this.pollAsync();
    }
    /**
     * Immediately polls the target and returns a promise for the response.
     *
     * @returns A promise that resolves to the updated response.
     */
    async pollAsync() {
      var _a, _b, _c, _d;
      try {
        const response = await this.target(this.context);
        const didRecoverFromError = !!this.error;
        this.error = null;
        (_b = (_a = this.delegate) == null ? void 0 : _a.handleDidReceivePollingResponse) == null ? void 0 : _b.call(_a, {
          context: this.context,
          client: this,
          response,
          didRecoverFromError
        });
        this.lastSuccessfulResponse = response;
        return response;
      } catch (error) {
        this.error = error;
        (_d = (_c = this.delegate) == null ? void 0 : _c.handleDidReceivePollingError) == null ? void 0 : _d.call(_c, {
          context: this.context,
          client: this,
          error,
          lastResponse: this.lastSuccessfulResponse
        });
      }
    }
    /**
     * Starts a recurring task to poll the target for an updated response.
     * 
     * When invoked, it immediately polls the target for a response.
     * 
     * @param delay - The number of milliseconds to wait in between polling events.
     */
    startPolling(delay) {
      if (this.interval) {
        return;
      }
      this.interval = setInterval(() => this.poll(), delay);
      this.poll();
    }
    /**
     * Stops polling the target.
     */
    stopPolling() {
      if (!this.interval) {
        return;
      }
      clearInterval(this.interval);
    }
    /**
     * Retrieves the last response received by the target.
     * @returns The last response received by the target.
     */
    getLastResponse() {
      return this.lastSuccessfulResponse;
    }
    /**
     * Updates the context used by polling events.
     * @param context - Updated context for future polling events.
     */
    setContext(context) {
      this.context = context;
    }
    /**
     * Retrieves the current context being used by polling events.
     * @returns The context being used by polling events.
     */
    getContext() {
      return this.context;
    }
  };
  __name(PollingClient, "PollingClient");

  // src/actions/PollingAction.ts
  var PollingAction = class extends import_streamdeck.Action {
    constructor() {
      super(...arguments);
      /**
       * Active polling clients.
       * 
       * These are typically associated with an action that is currently visible on the canvas.
       */
      this.clients = {};
    }
    /**
     * {@inheritDoc}
     */
    handleWillAppear(event) {
      super.handleWillAppear(event);
      const context = {
        instance: this.context,
        device: this.device,
        settings: event.settings
      };
      const poller = new PollingClient((context2) => this.getResponse(context2), context, this);
      poller.startPolling(this.getPollingDelay(event.settings) * 1e3);
      this.clients[this.getClientKey()] = poller;
    }
    /**
     * {@inheritDoc}
     */
    handleWillDisappear(event) {
      var _a;
      super.handleWillDisappear(event);
      (_a = this.getPollingClient()) == null ? void 0 : _a.stopPolling();
      delete this.clients[this.getClientKey()];
    }
    /**
     * {@inheritDoc}
     */
    handlePropertyInspectorDidAppear(event) {
      var _a;
      super.handlePropertyInspectorDidAppear(event);
      (_a = this.getPollingClient()) == null ? void 0 : _a.poll();
    }
    /**
     * {@inheritDoc}
     */
    handleDidReceiveSettings(event) {
      var _a;
      super.handleDidReceiveSettings(event);
      const context = (_a = this.getPollingClient()) == null ? void 0 : _a.getContext();
      if (!context) {
        return;
      }
      context.settings = event.settings;
      this.getPollingClient().setContext(context);
      this.getPollingClient().poll();
    }
    /**
     * {@inheritDoc}
     */
    handleDidReceivePollingResponse(event) {
      this.context = event.context.instance;
      this.device = event.context.device;
      this.debug("Received updated response:", event.response);
      const info = {
        success: true,
        statusMessage: "Success"
      };
      this.sendToPropertyInspector(info);
    }
    /**
     * {@inheritDoc}
     */
    handleDidReceivePollingError(event) {
      this.context = event.context.instance;
      this.device = event.context.device;
      this.logMessage(`[${this.constructor.name}] Received error while updating response: ${event.error.message}`);
      if (event.error instanceof RequestError) {
        this.logMessage(event.error.response.getBodyContents());
      }
      this.debug("Received error while updating response:", event.error);
      const info = {
        success: false,
        statusMessage: event.error.message,
        responseHeaders: event.error instanceof RequestError ? event.error.response.getAllHeaders() : null,
        responseBody: event.error instanceof RequestError ? event.error.response.getBodyContents() : null
      };
      this.sendToPropertyInspector(info);
    }
    /**
     * Retrieves the number of seconds to wait between each polling event.
     * 
     * @param settings - The current action settings.
     * @returns The number of seconds to wait in between each polling event; default is 120 seconds.
     */
    getPollingDelay(settings) {
      return 120;
    }
    /**
     * Retrieves the polling client for the current action instance.
     * 
     * @returns The polling client for the current action instance (if it exists).
     */
    getPollingClient() {
      var _a;
      return (_a = this.clients[this.getClientKey()]) != null ? _a : null;
    }
    /**
     * Generates a key based on the current device and action instance.
     * 
     * @returns A key for storing a reference to the polling client.
     */
    getClientKey() {
      return [this.device, this.context].join("_");
    }
  };
  __name(PollingAction, "PollingAction");

  // src/actions/BaseJiraAction.ts
  var BaseJiraAction = class extends PollingAction {
    /**
     * {@inheritDoc}
     */
    handleDidReceiveSettings(event) {
      var _a, _b, _c;
      this.setBadge({
        value: `${(_c = (_b = (_a = this.getPollingClient()) == null ? void 0 : _a.getLastResponse()) == null ? void 0 : _b.count) != null ? _c : 0}`
      }, event.settings);
      super.handleDidReceiveSettings(event);
    }
    /**
     * {@inheritDoc}
     */
    handleDidReceivePollingError(event) {
      super.handleDidReceivePollingError(event);
      this.setBadge({
        value: "!",
        color: "yellow",
        textColor: "black"
      }, event.context.settings);
    }
    /**
     * {@inheritDoc}
     */
    handleDidReceivePollingResponse(event) {
      var _a, _b;
      super.handleDidReceivePollingResponse(event);
      if (!event.didRecoverFromError && event.response.count === ((_a = event.client.getLastResponse()) == null ? void 0 : _a.count)) {
        return;
      }
      this.setBadge({
        value: `${(_b = event.response.count) != null ? _b : 0}`
      }, event.context.settings);
    }
    /**
     * {@inheritDoc}
     */
    getPollingDelay(settings) {
      var _a;
      return (_a = settings.pollingDelay) != null ? _a : super.getPollingDelay(settings);
    }
    /**
     * Updates the badge shown for the current action.
     * 
     * @param badge - Options to use for applying a badge to the icon.
     * @param settings - The current action settings.
     */
    setBadge(badge, settings) {
      var _a;
      if (badge.value == "0" || !badge.value.length || settings.badgeType === "hidden" /* Hidden */) {
        this.setImage(settings.customImage);
        this.setTitle("");
        return;
      }
      if (settings.badgeType === "title" /* UseTitle */) {
        this.setImage(settings.customImage);
        this.setTitle(badge.value);
        return;
      }
      this.setTitle("");
      if (settings.badgeType === "indicator" /* Indicator */) {
        badge.value = " ";
      }
      if (!badge.color) {
        badge.color = settings.badgeColor;
      }
      if (!badge.position) {
        badge.position = settings.badgePosition;
      }
      new Icon().addImage((_a = settings.customImage) != null ? _a : this.getDefaultImage(), 0, 0, 144, 144).then((icon) => {
        icon.setBadge(badge);
        this.setImage(icon.getImage());
      }).catch((error) => {
        this.setImage(null);
      });
    }
    /**
     * Retrieves the path to the default image for the action.
     * 
     * @returns The path to the default image for the current action.
     */
    getDefaultImage() {
      return `images/actions/${this.constructor.name}/${this.states[0].image}@2x.png`;
    }
  };
  __name(BaseJiraAction, "BaseJiraAction");

  // src/actions/Query.ts
  var Query = class extends BaseJiraAction {
    /**
     * {@inheritDoc}
     */
    handleKeyDown(event) {
      var _a, _b, _c, _d, _e, _f;
      super.handleKeyDown(event);
      switch (event.settings.keyAction) {
        case "Refresh":
          (_a = this.getPollingClient()) == null ? void 0 : _a.poll();
          break;
        case "ViewFilter":
          this.openURL(`https://${event.settings.domain}/issues/?jql=${encodeURIComponent(event.settings.jql)}`);
          break;
        default: {
          const action = event.settings.keyAction;
          if ("limit" in action) {
            const issues = (_e = (_d = (_c = (_b = this.getPollingClient()) == null ? void 0 : _b.getLastResponse()) == null ? void 0 : _c.data) == null ? void 0 : _d.issues) != null ? _e : [];
            issues.slice(0, (_f = action.limit) != null ? _f : 5).forEach((issue) => {
              this.openURL(this.getIssueUrl(issue, event.settings));
            });
          } else if ("url" in action) {
            if (action.url) {
              this.openURL(action.url);
            }
          }
          break;
        }
      }
    }
    /**
     * {@inheritDoc}
     */
    async getResponse(context) {
      const { domain, jql } = context.settings;
      if (!domain || !jql) {
        return {
          count: 0
        };
      }
      const client = JiraConnection.getClient(context.settings);
      const response = await client.request({
        endpoint: "rest/api/latest/search",
        query: {
          jql
        }
      });
      return {
        count: response.body.total,
        data: response.body
      };
    }
    /**
     * Retrieves an issue URL for a provided issue.
     *
     * @param issue - The issue.
     * @param settings - The current action settings.
     * @returns The URL to the issue.
     */
    getIssueUrl(issue, settings) {
      return `https://${settings.domain}/browse/${issue.key}`;
    }
  };
  __name(Query, "Query");
  var jira = new Query({
    name: "JQL Result",
    hasMultiActionSupport: false,
    tooltip: "Displays a badge with the number of issues matching a JQL query.",
    states: [{ image: "Jira" }],
    inspectorName: "Query"
  });
  var Query_default = jira;

  // src/actions/ConfluenceTasks.ts
  var ConfluenceTasks = class extends BaseJiraAction {
    /**
     * {@inheritDoc}
     */
    handleKeyDown(event) {
      super.handleKeyDown(event);
      const apiContext = event.settings.strategy === "PAT" ? "" : "/wiki";
      this.openURL(`https://${event.settings.domain}${apiContext}/plugins/inlinetasks/mytasks.action`);
    }
    /**
     * {@inheritDoc}
     */
    async getResponse(context) {
      const { domain, dueDateFrom, dueDateTo } = context.settings;
      if (!domain) {
        return {
          count: 0
        };
      }
      const client = JiraConnection.getClient(context.settings);
      const apiContext = context.settings.strategy === "PAT" ? "" : "wiki";
      const currentUserResponse = await client.request({
        endpoint: `${apiContext}/rest/api/user/current`
      });
      const filter = {
        assignee: currentUserResponse.body.accountId,
        status: "incomplete",
        limit: 99
      };
      if (dueDateFrom) {
        filter.duedateFrom = Date.parse(dueDateFrom);
      }
      if (dueDateTo) {
        filter.duedateTo = Date.parse(dueDateTo);
      }
      const response = await client.request({
        endpoint: `${apiContext}/rest/api/inlinetasks/search`,
        query: { ...filter }
      });
      return {
        count: response.body.size,
        data: response.body
      };
    }
  };
  __name(ConfluenceTasks, "ConfluenceTasks");
  var inlineTasks = new ConfluenceTasks({
    name: "Confluence Tasks",
    hasMultiActionSupport: false,
    tooltip: "Displays a badge with the number of incomplete inline tasks assigned to you in Confluence.",
    states: [{ image: "ConfluenceTasks" }],
    inspectorName: "ConfluenceTasks"
  });
  var ConfluenceTasks_default = inlineTasks;

  // src/actions/ConfluenceSearch.ts
  var ConfluenceSearch = class extends BaseJiraAction {
    /**
     * {@inheritDoc}
     */
    handleKeyDown(event) {
      var _a, _b, _c;
      super.handleKeyDown(event);
      if (((_a = this.getPollingClient()) == null ? void 0 : _a.getLastResponse().count) === 1) {
        const content = (_c = (_b = this.getPollingClient().getLastResponse().data) == null ? void 0 : _b.results[0]) == null ? void 0 : _c.content;
        if (content && content.url) {
          this.openURL(content.url);
          return;
        }
      }
      const apiContext = event.settings.strategy === "PAT" ? "" : "/wiki";
      this.openURL(`https://${event.settings.domain}${apiContext}/search?cql=${encodeURIComponent(event.settings.cql)}`);
    }
    /**
     * {@inheritDoc}
     */
    async getResponse(context) {
      const { domain, cql } = context.settings;
      if (!domain || !cql) {
        return {
          count: 0
        };
      }
      const client = JiraConnection.getClient(context.settings);
      const apiContext = context.settings.strategy === "PAT" ? "" : "wiki";
      const response = await client.request({
        endpoint: `${apiContext}/rest/api/search`,
        query: {
          cql,
          limit: "5"
        }
      });
      return {
        count: response.body.totalSize,
        data: response.body
      };
    }
  };
  __name(ConfluenceSearch, "ConfluenceSearch");
  var confluenceQuery = new ConfluenceSearch({
    name: "Confluence Search",
    hasMultiActionSupport: false,
    tooltip: "Displays a badge with the number of search results for a given CQL query.",
    states: [{ image: "Confluence" }],
    inspectorName: "ConfluenceSearch"
  });
  var ConfluenceSearch_default = confluenceQuery;

  // src/plugin.ts
  var plugin = new import_streamdeck2.Plugin({ ...streamdeck_exports, actions: [Query_default, ConfluenceSearch_default, ConfluenceTasks_default] });
  var plugin_default = plugin;

  // src/inspector.ts
  var import_streamdeck3 = __toESM(require_dist());
  var DefaultPropertyInspector = class extends import_streamdeck3.Inspector {
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

  // src/PollingActionInspector.ts
  var PollingActionInspector = class extends DefaultPropertyInspector {
    /**
     * {@inheritdoc}
     */
    constructor(args) {
      super(args);
      this.status = document.getElementById("status");
      this.status.onclick = () => {
        if (!this.status.value.success) {
          alert(this.status.value.statusMessage);
        }
      };
      this.status.onauxclick = () => {
        const info = this.status.value;
        if (!info.responseBody) {
          return;
        }
        this.openDebugModal(info);
      };
    }
    /**
     * {@inheritdoc}
     */
    handleSendToPropertyInspector(event) {
      super.handleSendToPropertyInspector(event);
      if (Object.prototype.hasOwnProperty.call(event, "statusMessage")) {
        const info = event;
        this.handleReceiveDebugInfo(info);
      }
    }
    /**
     * {@inheritdoc}
     */
    setSettings(payload) {
      var _a;
      super.setSettings(payload);
      (_a = this.status) == null ? void 0 : _a.clear();
    }
    /**
     * Invoked when the action passed debug information.
     * 
     * Useful for helping the user determine a problem with their configuration.
     * 
     * @param info - Debug information was received from the action.
     */
    handleReceiveDebugInfo(info) {
      if (!this.status) {
        return;
      }
      this.status.value = info;
    }
    /**
     * Display debug information in a modal window.
     * 
     * @param info - The debug info to show in the modal window.
     * @returns A reference to the modal window.
     */
    openDebugModal(info) {
      const modal = window.open();
      modal.document.write(`<iframe src="${this.generateDataUri(info)}" frameborder="0" width="100%" height="100%"></iframe>`);
      return modal;
    }
    /**
     * Renders debug info as an HTML page and generates a data URI.
     * 
     * @param info - The debug info to render as an Web page.
     * @returns The generated data URI.
     */
    generateDataUri(info) {
      var _a;
      const customCss = document.head.children[1].href;
      return TagBuilder.create("body").setClasses(["debug-modal"]).addChild(
        TagBuilder.create("link").setAttribute("rel", "stylesheet").setAttribute("type", "text/css").setAttribute("href", customCss)
      ).addChild(
        TagBuilder.create("details").addChild(
          TagBuilder.create("summary").setValue("Headers")
        ).addChild(
          TagBuilder.create("table").setClasses(["debug-headers"]).addChilden(Object.keys((_a = info.responseHeaders) != null ? _a : {}).map((header) => {
            return TagBuilder.create("tr").addChild(TagBuilder.create("th").setValue(header)).addChild(TagBuilder.create("td").setValue(info.responseHeaders[header]));
          }))
        )
      ).addChild(TagBuilder.create("label").setValue("Body")).addChild(TagBuilder.create("pre").setValue(info.responseBody)).toDataUri();
    }
  };
  __name(PollingActionInspector, "PollingActionInspector");
  var TagBuilder = class {
    /**
     * Creates a new tag builder.
     * 
     * @param doc - The parent document.
     * @param tag - The tag name.
     */
    constructor(doc, tag) {
      this.tag = doc.createElement(tag);
    }
    /**
     * Convenience creator for creating a new tag.
     * 
     * @param tag - The tag name.
     * @param doc - The parent document (defaults to the current document).
     * @returns A TagBuilder.
     */
    static create(tag, doc = null) {
      doc = doc != null ? doc : document;
      return new TagBuilder(doc, tag);
    }
    /**
     * Adds multiple children to the element.
     * 
     * @param children - The children to add to the element.
     * @returns The current TagBuilder (for chaining).
     */
    addChilden(children) {
      children.forEach((child) => this.addChild(child));
      return this;
    }
    /**
     * Adds a single child to the element.
     * 
     * @param child - The child to add to the element.
     * @returns The current TagBuilder (for chaining).
     */
    addChild(child) {
      if (child instanceof Element) {
        this.tag.append(child);
      } else {
        this.tag.append(child.get());
      }
      return this;
    }
    /**
     * Sets an ID on the element.
     * 
     * @param id - The ID to set on the element.
     * @returns The current TagBuilder (for chaining).
     */
    setId(id2) {
      this.tag.id = id2;
      return this;
    }
    /**
     * Sets the classes on the element.
     * 
     * @param classes - An array of class names to add to the element.
     * @returns The current TagBuilder (for chaining).
     */
    setClasses(classes) {
      this.tag.className = classes.join(" ");
      return this;
    }
    /**
     * Sets an attribute on the element tag.
     * 
     * @param name - The attribute name.
     * @param value - The attribute value.
     * @returns The current TagBuilder (for chaining).
     */
    setAttribute(name2, value) {
      this.tag.setAttribute(name2, value);
      return this;
    }
    /**
     * Sets the value of the element.
     * 
     * Determines if the value should be set in the `value` attribute
     * or in the body of the tag.
     * 
     * @param value - The value to set.
     * @returns The current TagBuilder (for chaining).
     */
    setValue(value) {
      if (this.tag instanceof HTMLInputElement || this.tag instanceof HTMLTextAreaElement) {
        this.tag.value = value;
      }
      this.tag.innerText = value;
      return this;
    }
    /**
     * Retrieves the element being built.
     * 
     * @returns The built element.
     */
    get() {
      return this.tag;
    }
    /**
     * Retrieves the HTML code for the current element.
     * 
     * @returns An HTML string of the current element.
     */
    toHtmlString() {
      return this.tag.outerHTML;
    }
    /**
     * Generates a data URI for the element.
     * 
     * Suitable for opening in a browser window.
     * 
     * @returns A data URI representing the current element.
     */
    toDataUri() {
      return `data:text/html,${encodeURI(this.toHtmlString())}`;
    }
  };
  __name(TagBuilder, "TagBuilder");

  // src/inspectors/ConfluenceTasks.ts
  var ConfluenceTasksActionPropertyInspector = class extends PollingActionInspector {
    constructor() {
      super(...arguments);
      this.authentication = document.getElementById("auth");
      this.icon = document.getElementById("icon");
      this.fromDate = document.getElementById("from-date");
      this.toDate = document.getElementById("to-date");
    }
    /**
     * {@inheritDoc}
     */
    updateForm() {
      const settings = Object.assign({}, this.getDefaultSettings(), this.settings);
      this.fromDate.value = this.formatDate(settings.dueDateFrom);
      this.toDate.value = this.formatDate(settings.dueDateTo);
      this.authentication.value = settings;
      this.icon.value = settings;
    }
    /**
     * {@inheritdoc}
     */
    handleFieldUpdated(event) {
      this.saveSettings();
    }
    /**
     * "Submits" the form in the property inspector and saves all values to settings.
     */
    saveSettings() {
      const settings = {
        dueDateFrom: this.formatDate(this.fromDate.value),
        dueDateTo: this.formatDate(this.toDate.value),
        pollingDelay: 120,
        ...this.authentication.value,
        ...this.icon.value
      };
      this.setSettings(settings);
      this.setGlobalSettings({
        domain: settings.domain,
        email: settings.email,
        token: settings.token,
        strategy: settings.strategy
      });
    }
    /**
     * {@inheritdoc}
     */
    getDefaultSettings() {
      var _a, _b, _c, _d;
      return {
        domain: (_a = this.globalSettings.domain) != null ? _a : "",
        email: (_b = this.globalSettings.email) != null ? _b : "",
        token: (_c = this.globalSettings.token) != null ? _c : "",
        strategy: (_d = this.globalSettings.strategy) != null ? _d : "APIToken",
        pollingDelay: 120,
        badgeType: "number" /* Number */,
        badgePosition: "topright" /* TopRight */
      };
    }
    /**
     * Formats a string/date as yyyy-mm-dd.
     * 
     * @param date - Either a date object or a string representing a date.
     * @returns A date formatted as yyyy-mm-dd.
     */
    formatDate(date) {
      if (!date) {
        return null;
      }
      if (!(date instanceof Date)) {
        date = new Date(date);
      }
      return date.toISOString().split("T")[0];
    }
  };
  __name(ConfluenceTasksActionPropertyInspector, "ConfluenceTasksActionPropertyInspector");
  var inspector = new ConfluenceTasksActionPropertyInspector({ plugin: plugin_default });
  inspector.run();
})();
