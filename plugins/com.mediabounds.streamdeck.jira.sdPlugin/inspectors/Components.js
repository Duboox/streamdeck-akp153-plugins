(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

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

  // src/inspectors/Components.ts
  var PropertyInspectorComponent = class extends HTMLElement {
    /**
     * Invoked when the element has been added to the document.
     */
    connectedCallback() {
      this.loadTemplate().then(() => this.onTemplateLoaded()).catch(console.error);
    }
    /**
     * Invoked after the template has been loaded and appended to the document.
     */
    onTemplateLoaded() {
      const fields = this.querySelectorAll("input, textarea, select");
      fields.forEach((field) => {
        field.addEventListener("change", (e) => this.onFieldUpdated(e));
      });
    }
    /**
     * Invoked when a field within the component changes.
     * @param event - The change event.
     */
    onFieldUpdated(event) {
      this.dispatchEvent(new Event("change"));
    }
    /**
     * Loads the template specified in `template` and appends to the document.
     * 
     * @returns A promise that resolves when the template finishes loading.
     */
    async loadTemplate() {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = (e) => {
          if (xhr.readyState === 4) {
            this.innerHTML = xhr.responseText;
            resolve();
          }
        };
        xhr.onerror = (e) => {
          reject(e);
        };
        xhr.open("GET", this.template, true);
        xhr.send();
      });
    }
  };
  __name(PropertyInspectorComponent, "PropertyInspectorComponent");
  var AuthenticationComponent = class extends PropertyInspectorComponent {
    /**
     * {@inheritDoc}
     */
    get template() {
      return "authentication.component.html";
    }
    /**
     * {@inheritDoc}
     */
    get value() {
      return {
        domain: this.domain.value.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim(),
        email: this.email.value.trim(),
        token: this.token.value.trim(),
        strategy: this.tokenType.value
      };
    }
    /**
     * {@inheritDoc}
     */
    set value(newValue) {
      this.domain.value = newValue.domain;
      this.email.value = newValue.email;
      this.token.value = newValue.token;
      this.tokenType.value = newValue.strategy;
      this.onValueChanged();
    }
    /**
     * {@inheritDoc}
     */
    onTemplateLoaded() {
      super.onTemplateLoaded();
      this.domain = this.querySelector("#domain");
      this.email = this.querySelector("#email");
      this.token = this.querySelector("#token");
      this.tokenType = this.querySelector("#token-type");
    }
    /**
     * {@inheritDoc}
     */
    onFieldUpdated(event) {
      super.onFieldUpdated(event);
      this.onValueChanged();
    }
    /**
     * Invoked when the value changes.
     * Handles updates to the form.
     */
    onValueChanged() {
      this.querySelectorAll("[x-token-type]").forEach((el) => el.hidden = el.getAttribute("x-token-type") != this.tokenType.value);
    }
  };
  __name(AuthenticationComponent, "AuthenticationComponent");
  var IconComponent = class extends PropertyInspectorComponent {
    /**
     * {@inheritDoc}
     */
    get template() {
      return "icon.component.html";
    }
    /**
     * {@inheritDoc}
     */
    get value() {
      var _a, _b, _c;
      return {
        badgeType: (_a = this.badgeType.value) != null ? _a : "number" /* Number */,
        customImage: this.customImageData,
        badgePosition: (_b = this.badgePosition.value) != null ? _b : "topright" /* TopRight */,
        badgeColor: (_c = this.badgeColor.value) != null ? _c : "red"
      };
    }
    /**
     * {@inheritDoc}
     */
    set value(newValue) {
      var _a;
      this.badgeType.value = newValue.badgeType;
      this.customImageData = newValue.customImage;
      this.badgePosition.value = newValue.badgePosition;
      this.badgeColor.value = (_a = newValue.badgeColor) != null ? _a : "#FF0000";
      this.onValueChanged();
    }
    /**
     * {@inheritDoc}
     */
    onTemplateLoaded() {
      super.onTemplateLoaded();
      this.customImagePreview = this.querySelector("#custom-image");
      this.customImageInput = this.querySelector("#custom-image-input");
      this.badgeType = this.querySelector("#badge-type");
      this.badgePosition = this.querySelector("#badge-position");
      this.badgeColor = this.querySelector("#badge-color");
      this.customImagePreview.addEventListener("click", () => this.removeCustomImage());
    }
    /**
     * {@inheritDoc}
     */
    onFieldUpdated(event) {
      if ((event == null ? void 0 : event.currentTarget) == this.customImageInput) {
        this.uploadCustomImage();
      } else {
        super.onFieldUpdated(event);
      }
      this.onValueChanged();
    }
    /**
     * Invoked when the value changes.
     * Handles updates to the form.
     */
    onValueChanged() {
      var _a;
      this.customImagePreview.src = (_a = this.customImageData) != null ? _a : "";
      if (this.customImageData) {
        this.customImagePreview.hidden = false;
        this.customImagePreview.parentElement.classList.add("preview-visible");
      } else {
        this.customImagePreview.hidden = true;
        this.customImagePreview.parentElement.classList.remove("preview-visible");
      }
      this.badgePosition.parentElement.hidden = this.badgeColor.parentElement.hidden = this.value.badgeType == "hidden" /* Hidden */ || this.value.badgeType == "title" /* UseTitle */;
    }
    /**
     * Gets the custom image from the file chooser and applies it as the custom image.
     */
    uploadCustomImage() {
      const files = this.customImageInput.files;
      if (!files.length) {
        return;
      }
      Icon.fromLocalFile(files[0]).then((icon) => {
        this.setCustomImage(icon.getImage());
      }).catch(console.error);
      this.customImageInput.value = "";
    }
    /**
     * Removes the custom image.
     */
    removeCustomImage() {
      this.setCustomImage(null);
    }
    /**
     * Updates the action's custom image.
     * @param data - Base-64 encoded image data.
     */
    setCustomImage(data) {
      this.customImageData = data;
      this.onFieldUpdated();
    }
  };
  __name(IconComponent, "IconComponent");
  var StatusComponent = class extends PropertyInspectorComponent {
    constructor() {
      super(...arguments);
      this.status = document.getElementById("status-display");
    }
    /**
     * {@inheritDoc}
     */
    get template() {
      return "status.component.html";
    }
    /**
     * {@inheritDoc}
     */
    get value() {
      return this.currentStatus;
    }
    /**
     * {@inheritDoc}
     */
    set value(newValue) {
      this.currentStatus = newValue;
      this.status.title = newValue.statusMessage;
      if (newValue.success) {
        this.status.innerHTML = '<span class="success">\u2713</span> Success';
        return;
      }
      this.status.innerHTML = '<span class="warning">\u26A0\uFE0F</span> Something is not right';
    }
    /**
     * Clears the status display.
     */
    clear() {
      this.status.innerText = "";
    }
    /**
     * {@inheritDoc}
     */
    onTemplateLoaded() {
      super.onTemplateLoaded();
      this.status = this.querySelector("#status-display");
    }
  };
  __name(StatusComponent, "StatusComponent");
  customElements.define("pi-authentication", AuthenticationComponent);
  customElements.define("pi-icon", IconComponent);
  customElements.define("pi-status", StatusComponent);
})();
