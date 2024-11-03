/*!
	@file       textChannelPI.js
	@brief      Contains PI for Text Channel action
	@author     Andrew story
	@copyright  (c) 2023, Corsair Memory, Inc. All Rights Reserved.
*/

function UserVolumeDialPI(inContext, inLanguage) {
    // Inherit from PI
    PI.call(this, inContext, inLanguage);

    // Save a copy of a method
    var piSaveSettings = this.saveSettings;

    // Add fields
    var fields =`
    <div type="radio" class="sdpi-item" id="user-mode">
        <div class="sdpi-item-label translated" x-text="UserAdjustMode"></div>
        <div class="sdpi-item-value ">
            <span class="sdpi-item-child">
                <input id="user_specific" type="radio" name="rdio">
                <label for="user_specific" class="sdpi-item-label translated" x-text="UserAdjustSpecific"><span></span></label>
            </span>
            <span class="sdpi-item-child">
                <input id="user_any" type="radio" name="rdio">
                <label for="user_any" class="sdpi-item-label translated" x-text="UserAdjustAny"><span></span></label>
            </span>
        </div>
    </div>
    <div class="sdpi-item" id="user-selection">
        <div class="sdpi-item-label translated" x-text="User"></div>
        <select class="sdpi-item-value select" id="user">
        <option disabled id='no-user' value='no-user' class="translated" x-text="UsersNotFound"></option>
        </select>
    </div>
    <div type="range" class="sdpi-item" id="volume-range">
        <div class="sdpi-item-label translated" x-text="VolStepSize"></div>
        <div class="sdpi-item-value">
            <input class="floating-tooltip" data-suffix=" %" type="range" min="1" max="5" id="vol-range">
        </div>
    </div>
    <div class="sdpi-info-label hidden" style="top: -1000;" value="">TooltipText</div>`;
    document.getElementById('placeholder').innerHTML = fields;

    const els = {
        "select_user": document.getElementById('user'),
        "user_specific": document.getElementById("user_specific"),
        "user_any": document.getElementById("user_any"),
        "range": document.getElementById("vol-range"),
    };
    const containers = {
        "range": document.getElementById("volume-range"),
        "select_user": document.getElementById("user-selection"),
    };

    this.refreshElements = function(){
        const pickedMode = els.user_any.checked || els.user_specific.checked;
        if (!pickedMode){
            containers.range.style.display = "none";
            containers.select_user.style.display = "none";
            return;
        }
        if (els.user_specific.checked){
            containers.select_user.style.removeProperty("display");
            const userSelected = els.select_user.value && els.select_user.value !== "no-user";
            if( userSelected){
                containers.range.style.removeProperty("display");
            } else {
                containers.range.style.display = "none";
            }
        } else {
            containers.select_user.style.display = "none";
            containers.range.style.removeProperty("display");
        }
    };

    els.select_user.addEventListener("change", () => {
        settings['user'] = els.select_user.value;
        settings['usernick'] = els.select_user.options[els.select_user.selectedIndex].innerText;
        this.refreshElements();
        piSaveSettings();
    });
    els.user_specific.addEventListener("change", () => {
        settings['user_mode'] = "specific";
        this.refreshElements();
        piSaveSettings();
    });
    els.user_any.addEventListener("change", () => {
        settings['user_mode'] = "any";
        this.refreshElements();
        piSaveSettings();
    });
    els.range.addEventListener("change", volumeChanged = (inEvent) => {
        settings['volume'] = parseInt(inEvent.target.value);
        piSaveSettings();
    });

    this.addSliderTooltip(els.range, (value)=>{
        return "+/- " + value + "%";
    });

    els.select_user.value = settings['user'] || "no-user";
    els.user_specific.checked = settings['user_mode'] == "specific";
    els.user_any.checked = settings['user_mode'] == "any";

    this.setAndValidateField(els.range, "volume");

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
                if (selectedOption){
                    settings['usernick'] = selectedOption.innerText;
                }
            }
            if(settings["user"] && settings["usernick"]){
                defaults = {key: settings["user"], value: settings["usernick"]};
            }
            this.loadField('user', data.users, defaults);
            els.user_specific.checked = settings['user_mode'] == "specific";
            els.user_any.checked = settings['user_mode'] == "any";
            els.range.value = settings['volume'];
        }

        // Enable / Disable the fields
        els.select_user.disabled = data.disabled || data.unauthorized;
        els.user_specific.disabled = data.disabled || data.unauthorized;
        els.user_any.disabled = data.disabled || data.unauthorized;
        els.range.disabled = data.disabled || data.unauthorized;

        this.refreshElements();

        // Show PI
        document.getElementById('pi').style.display = "block";
    }
}
