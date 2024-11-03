/*!
	@file       textChannelPI.js
	@brief      Contains PI for Text Channel action
	@author     Andrew story
	@copyright  (c) 2023, Corsair Memory, Inc. All Rights Reserved.
*/

function SetAudioDevicePI(inContext, inLanguage) {
    // Inherit from PI
    PI.call(this, inContext, inLanguage);

    // Save a copy of a method
    var piSaveSettings = this.saveSettings;

    this.defaultName = "Default";

    // Add fields
    var fields =`
    <div class="sdpi-item" id="mode">
        <div class="sdpi-item-label translated" x-text="IODeviceMode"></div>
        <select class="sdpi-item-value select" id="select-mode">
        <option value="input" class="translated" x-text="IODeviceModeInput"></option>
        <option value="output" class="translated" x-text="IODeviceModeOutput"></option>
        <option value="both" class="translated" x-text="IODeviceModeBoth"></option>
        </select>
    </div>
    <div class="sdpi-item" id="input-selection" style="display:none">
        <div class="sdpi-item-label translated" x-text="IODeviceInput"></div>
        <select class="sdpi-item-value select" id="input">
        <option disabled id='no-input' class="translated" value='no-input' x-text="IODeviceInputNotFound"></option>
        </select>
    </div>
    <div class="sdpi-item" id="output-selection" style="display:none">
        <div class="sdpi-item-label translated" x-text="IODeviceOutput"></div>
        <select class="sdpi-item-value select" id="output">
        <option disabled id='no-output' class="translated" value='no-output' x-text="IODeviceOutputNotFound"></option>
        </select>
    </div>`;
    document.getElementById('placeholder').innerHTML = fields;

    const els = {
        "mode": document.getElementById('select-mode'),
        "input": document.getElementById("input"),
        "output": document.getElementById("output"),
    };
    const containers = {
        "mode": document.getElementById("mode"),
        "input": document.getElementById("input-selection"),
        "output": document.getElementById("output-selection")
    };

    this.refreshElements = function(){
        const modeSelected = els.mode.value;
        if (!modeSelected){
            containers.input.style.display = "none";
            containers.output.style.display = "none";
            return;
        }


        if( els.mode.value == "input"){
            containers.input.style.removeProperty("display");
            containers.output.style.display = "none";
        }
        else if (els.mode.value == "output"){
            containers.output.style.removeProperty("display");
            containers.input.style.display = "none";
        }
        else if (els.mode.value == "both") {
            containers.output.style.removeProperty("display");
            containers.input.style.removeProperty("display");
        }
    };

    els.mode.addEventListener("change", () => {
        settings['mode'] = els.mode.value;
        this.refreshElements();
        piSaveSettings();
    });
    els.output.addEventListener("change", () => {
        settings['output'] = els.output.value;
        settings['outputname'] = els.output.options[els.output.selectedIndex].innerText;
        this.refreshElements();
        piSaveSettings();
    });
    els.input.addEventListener("change", () => {
        settings['input'] = els.input.value;
        settings['inputname'] = els.input.options[els.input.selectedIndex].innerText;
        piSaveSettings();
    });


    els.mode.value = settings['mode'];
    els.output.value = settings['output'] || "no-output";
    els.input.value = settings['input'] || "no-input";

    this.refreshElements();

    // Before overwriting parrent method, save a copy of it
    var piLoad = this.load;

    // Public function called to load the fields
    this.load = function (data) {
        // Call PI load method
        piLoad.call(this, data);

        // If action enabled
        if (!data.disabled && !data.unauthorized) {
            this.updateName("input", "inputname", els.input);
            this.updateName("output", "outputname", els.output);
            let defaultsInput = {key: "default", value: this.defaultName};
            let defaultsOutput = {key: "default", value: this.defaultName};
            if(settings["input"]){
                defaultsInput = {key: settings["input"], value: settings["inputname"]};
            }
            if(settings["output"]){
                defaultsOutput = {key: settings["output"], value: settings["outputname"]};
            }
            this.loadField('input', data.inputs, defaultsInput);
            this.loadField('output', data.outputs, defaultsOutput);
            els.mode.value = settings['mode'];
        }

        // Enable / Disable the fields
        els.mode.disabled = data.disabled || data.unauthorized;
        els.output.disabled = data.disabled || data.unauthorized;
        els.input.disabled = data.disabled || data.unauthorized;

        this.refreshElements();

        // Show PI
        document.getElementById('pi').style.display = "block";

    }

    /* --- Localization --- */

    // Before overwriting parent method, save a copy of it
    var piLocalize = this.localize;

    // Localize the UI
    this.localize = function (tr) {
        // Call PIs localize method
        piLocalize.call(this, tr);

        // Capture default name for IO device
        this.defaultName = tr("IODeviceDefault") || "Default";
    };
}
