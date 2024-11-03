/*!
	@file       textChannelPI.js
	@brief      Contains PI for Text Channel action
	@author     Andrew story
	@copyright  (c) 2023, Corsair Memory, Inc. All Rights Reserved.
*/

function VolumeButtonPI(inContext, inLanguage) {
    // Inherit from PI
    PI.call(this, inContext, inLanguage);

    // Save a copy of a method
    var piSaveSettings = this.saveSettings;

    // Add fields
    var fields =`
    <div type="radio" class="sdpi-item" id="device">
        <div class="sdpi-item-label translated" x-text="IODevice"></div>
        <div class="sdpi-item-value ">
            <span class="sdpi-item-child">
                <input id="dev_output" type="radio" name="rdio">
                <label for="dev_output" class="sdpi-item-label translated" x-text="IODeviceOutput"><span></span></label>
            </span>
            <span class="sdpi-item-child">
                <input id="dev_input" type="radio" name="rdio">
                <label for="dev_input" class="sdpi-item-label translated" x-text="IODeviceInput"><span></span></label>
            </span>
        </div>
    </div>
    <div class="sdpi-item" id="volume-mode" style="display:none">
        <div class="sdpi-item-label translated" x-text="IODeviceMode"></div>
        <select class="sdpi-item-value select" id="select-mode">
        <option value="adjust" class="translated" x-text="AdjustDeviceVol"></option>
        <option value="set" class="translated" x-text="SetDeviceVol"></option>
        </select>
    </div>
    <div class="sdpi-item" id="icon-mode" style="display:none">
        <div class="sdpi-item-label translated" x-text="IconStyle"></div>
        <select class="sdpi-item-value select" id="select-icon">
        <option value="static" class="translated" x-text="IconStatic" selected></option>
        <option value="dynamic_h" class="translated" x-text="IconDynamicH"></option>
        <option value="dynamic_v" class="translated" x-text="IconDynamicV"></option>
        </select>
    </div>
    <div type="range" class="sdpi-item" id="volume-range-adjust" style="display:none">
        <div class="sdpi-item-label translated" x-text="VolStepSize"></div>
        <div class="sdpi-item-value">
            <input class="floating-tooltip" data-suffix=" %" type="range" min="-25" max="24" id="vol-range-adjust">
        </div>
    </div>
    <div type="range" class="sdpi-item" id="volume-range-set" style="display:none">
        <div class="sdpi-item-label translated" x-text="VolSetValue"></div>
        <div class="sdpi-item-value">
            <input class="floating-tooltip" data-suffix=" %" type="range" min="0" max="200" id="vol-range-set">
        </div>
    </div>
    <div class="sdpi-info-label hidden" style="top: -1000;" value="">TooltipText</div>`;
    document.getElementById('placeholder').innerHTML = fields;

    const els = {
        "dev_input": document.getElementById('dev_input'),
        "dev_output": document.getElementById('dev_output'),
        "range_adjust": document.getElementById("vol-range-adjust"),
        "range_set": document.getElementById("vol-range-set"),
        "select_mode": document.getElementById("select-mode"),
        "select_icon": document.getElementById("select-icon"),
    };
    const containers = {
        "range_adjust": document.getElementById("volume-range-adjust"),
        "range_set": document.getElementById("volume-range-set"),
        "select_mode": document.getElementById("volume-mode"),
        "select_icon": document.getElementById("icon-mode"),
    };

    this.refreshElements = function(){
        const deviceChosen = els.dev_input.checked || els.dev_output.checked;
        if (!deviceChosen){
            containers.range_adjust.style.display = "none";
            containers.range_set.style.display = "none";
            containers.select_mode.style.display = "none";
            containers.select_icon.style.display = "none";
            return;
        }
        containers.select_mode.style.removeProperty("display");
        if( els.select_mode.value == "adjust"){
            containers.range_adjust.style.removeProperty("display");
            if( settings.isInMultiAction){
                containers.select_icon.style.display = "none";
            } else {
                containers.select_icon.style.removeProperty("display");
            }
            containers.range_set.style.display = "none";
        }
        else if (els.select_mode.value == "set"){
            containers.range_set.style.removeProperty("display");
            containers.select_icon.style.display = "none";
            containers.range_adjust.style.display = "none";
            if(els.dev_input.checked){
                els.range_set.max = 100;
            } else if (els.dev_output.checked){
                els.range_set.max = 200;
            }
        }
    };

    els.dev_output.addEventListener("change", () => {
        settings['device'] = "output";
        this.refreshElements();
        piSaveSettings();
    });
    els.dev_input.addEventListener("change", () => {
        settings['device'] = "input";
        this.refreshElements();
        piSaveSettings();
    });
    els.select_mode.addEventListener("change", () => {
        settings['mode'] = els.select_mode.value;
        this.refreshElements();
        piSaveSettings();
    });
    els.select_icon.addEventListener("change", () => {
        settings['icon'] = els.select_icon.value;
        piSaveSettings();
    });
    els.range_adjust.addEventListener("change", volumeChanged = (inEvent) => {
        settings['volAdjustValue'] = parseInt(inEvent.target.value);
        console.log(settings);
        piSaveSettings();
    });
    els.range_set.addEventListener("change", volumeChanged = (inEvent) => {
        settings['volSetValue'] = parseInt(inEvent.target.value);
        console.log(settings);
        piSaveSettings();
    });

    this.addSliderTooltip(els.range_adjust, (value)=>{
        return (value >= 0 ? "+" + (value + 1) : value) + "%";
    });
    this.addSliderTooltip(els.range_set, (value)=>{
        return value + "%";
    });

    els.dev_input.checked = settings['device'] == "input";
    els.dev_output.checked = settings['device'] == "output";

    this.setAndValidateField(els.range_adjust, "volAdjustValue");
    this.setAndValidateField(els.range_set, "volSetValue");
    this.setAndValidateField(els.select_mode, "mode");
    this.setAndValidateField(els.select_icon, "icon", settings['icon'] || "static");


    this.refreshElements();

    // Before overwriting parrent method, save a copy of it
    var piLoad = this.load;

    // Public function called to load the fields
    this.load = function (data) {
        // Call PI load method
        piLoad.call(this, data);

        // If action enabled
        if (!data.disabled && !data.unauthorized) {
            els.dev_input.checked = settings['device'] == "input";
            els.dev_output.checked = settings['device'] == "output";
            els.range_adjust.value = settings['volAdjustValue'];
            els.range_set.value = settings['volSetValue'];
            els.select_mode.value = settings['mode'];
            els.select_icon.value = settings['icon'] || "static";
        }

        // Enable / Disable the fields
        els.dev_input.disabled = data.disabled || data.unauthorized;
        els.dev_output.disabled = data.disabled || data.unauthorized;
        els.range_adjust.disabled = data.disabled || data.unauthorized;
        els.range_set.disabled = data.disabled || data.unauthorized;
        els.select_mode.disabled = data.disabled || data.unauthorized;
        els.select_icon.disabled = data.disabled || data.unauthorized;

        this.refreshElements();

        // Show PI
        document.getElementById('pi').style.display = "block";
    }
}
