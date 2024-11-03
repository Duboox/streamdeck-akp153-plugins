/*!
	@file       textChannelPI.js
	@brief      Contains PI for Text Channel action
	@author     Andrew story
	@copyright  (c) 2023, Corsair Memory, Inc. All Rights Reserved.
*/

function UserVolumeButtonPI(inContext, inLanguage) {
    // Inherit from PI
    PI.call(this, inContext, inLanguage);

    // Save a copy of a method
    var piSaveSettings = this.saveSettings;

    // Add fields
    var fields =`
    <div class="sdpi-item" id="user-selection">
        <div class="sdpi-item-label translated" x-text="User">User</div>
        <select class="sdpi-item-value select" id="user">
        <option disabled id='no-user' class="translated" value='no-user' x-text="UsersNotFound"></option>
        </select>
    </div>
    <div class="sdpi-item" id="volume-mode" style="display:none">
        <div class="sdpi-item-label translated" x-text="UserVolumeMode"></div>
        <select class="sdpi-item-value select" id="select-mode">
        <option value="mute" class="translated" x-text="MuteUser"></option>
        <option value="adjust" class="translated" x-text="AdjustUserVol"></option>
        <option value="set" class="translated" x-text="SetUserVol"></option>
        </select>
    </div>
    <div class="sdpi-item" id="mute-type" style="display:none">
        <div class="sdpi-item-label translated" x-text="UserMuteType"></div>
        <select class="sdpi-item-value select" id="select-mute-type">
        <option value="toggle" class="translated" x-text="ToggleMuteUser"></option>
        <option value="mute" class="translated" x-text="MuteUser"></option>
        <option value="unmute" class="translated" x-text="UnmuteUser"></option>
        </select>
    </div>
    <div class="sdpi-item" id="icon-mode" style="display:none">
        <div class="sdpi-item-label translated" x-text="IconStyle"></div>
        <select class="sdpi-item-value select" id="select-icon">
        <option value="static" class="translated" x-text="IconStatic" selected>Static</option>
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
        "select_user": document.getElementById('user'),
        "range_adjust": document.getElementById("vol-range-adjust"),
        "range_set": document.getElementById("vol-range-set"),
        "select_mode": document.getElementById("select-mode"),
        "select_icon": document.getElementById("select-icon"),
        "select_mute_type": document.getElementById("select-mute-type"),
    };
    const containers = {
        "range_adjust": document.getElementById("volume-range-adjust"),
        "range_set": document.getElementById("volume-range-set"),
        "select_mode": document.getElementById("volume-mode"),
        "select_icon": document.getElementById("icon-mode"),
        "mute_type": document.getElementById("mute-type"),
    };

    this.refreshElements = function(){
        const userSelected = els.select_user.value && els.select_user.value !== "no-user";
        if (!userSelected){
            containers.range_adjust.style.display = "none";
            containers.range_set.style.display = "none";
            containers.select_mode.style.display = "none";
            containers.select_icon.style.display = "none";
            containers.mute_type.style.display = "none";
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
            containers.mute_type.style.display = "none";
        }
        else if (els.select_mode.value == "set"){
            containers.range_set.style.removeProperty("display");
            containers.select_icon.style.display = "none";
            containers.range_adjust.style.display = "none";
            containers.mute_type.style.display = "none";
        }
        else if (els.select_mode.value == "mute"){
            containers.mute_type.style.removeProperty("display");
            containers.range_set.style.display = "none";
            containers.select_icon.style.display = "none";
            containers.range_adjust.style.display = "none";
        }else {
            containers.range_set.style.display = "none";
            containers.select_icon.style.display = "none";
            containers.range_adjust.style.display = "none";
            containers.mute_type.style.display = "none";
        }
    };

    els.select_user.addEventListener("change", () => {
        settings['user'] = els.select_user.value;
        settings['usernick'] = els.select_user.options[els.select_user.selectedIndex].innerText;
        this.refreshElements();
        piSaveSettings();
    });
    els.select_mode.addEventListener("change", () => {
        settings['mode'] = els.select_mode.value;
        this.refreshElements();
        piSaveSettings();
    });
    els.select_mute_type.addEventListener("change", () => {
        settings['muteType'] = els.select_mute_type.value;
        this.refreshElements();
        piSaveSettings();
    });
    els.select_icon.addEventListener("change", () => {
        settings['icon'] = els.select_icon.value;
        piSaveSettings();
    });
    els.range_adjust.addEventListener("change", volumeChanged = (inEvent) => {
        settings['volAdjustValue'] = parseInt(inEvent.target.value);
        piSaveSettings();
    });
    els.range_set.addEventListener("change", volumeChanged = (inEvent) => {
        settings['volSetValue'] = parseInt(inEvent.target.value);
        piSaveSettings();
    });

    this.addSliderTooltip(els.range_adjust, (value)=>{
        return (value >= 0 ? "+" + (value + 1) : value) + "%";
    });
    this.addSliderTooltip(els.range_set, (value)=>{
        return value + "%";
    });

    els.select_user.value = settings['user'] || "no-user";

    this.setAndValidateField(els.range_adjust, "volAdjustValue");
    this.setAndValidateField(els.range_set, "volSetValue");
    this.setAndValidateField(els.select_mute_type, "muteType");
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
            let defaults;
            if (settings["user"] && els.select_user.selectedIndex >= 0){
                // Ensure we actually have a nick for the user
                let selectedOption = els.select_user.options[els.select_user.selectedIndex];
                if (selectedOption && settings['usernick'] != selectedOption.innerText){
                    settings['usernick'] = selectedOption.innerText;
                }
            }
            if(settings["user"] && settings["usernick"]){
                defaults = {key: settings["user"], value: settings["usernick"]};
            }

            this.loadField('user', data.users, defaults);
            this.setAndValidateField(els.range_adjust, "volAdjustValue");
            this.setAndValidateField(els.range_set, "volSetValue");
            this.setAndValidateField(els.select_mute_type, "muteType");
            this.setAndValidateField(els.select_mode, "mode");
            this.setAndValidateField(els.select_icon, "icon", settings['icon'] || "static");
        }

        // Enable / Disable the fields
        els.select_user.disabled = data.disabled || data.unauthorized;
        els.range_adjust.disabled = data.disabled || data.unauthorized;
        els.range_set.disabled = data.disabled || data.unauthorized;
        els.select_mode.disabled = data.disabled || data.unauthorized;
        els.select_icon.disabled = data.disabled || data.unauthorized;

        this.refreshElements();

        // Show PI
        document.getElementById('pi').style.display = "block";
    }
}
