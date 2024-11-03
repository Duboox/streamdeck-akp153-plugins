/*!
	@file       textChannelPI.js
	@brief      Contains PI for Text Channel action
	@author     Andrew story
	@copyright  (c) 2023, Corsair Memory, Inc. All Rights Reserved.
*/

function VolumePI(inContext, inLanguage) {
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
    <div type="range" class="sdpi-item" id="volume-range">
        <div class="sdpi-item-label translated" x-text="VolStepSize"></div>
        <div class="sdpi-item-value">
            <input class="floating-tooltip" data-suffix=" %" type="range" min="1" max="5" id="vol-range">
        </div>
    </div>
    <div class="sdpi-info-label hidden" style="top: -1000;" value="">TooltipText</div>`

    document.getElementById('placeholder').innerHTML = fields;
    document.getElementById('dev_output').addEventListener("change", () => {
        settings['device'] = "output";
        console.log(settings);
        piSaveSettings();
    });
    document.getElementById('dev_input').addEventListener("change", () => {
        settings['device'] = "input"
        console.log(settings);
        piSaveSettings();
    });
    document.getElementById("vol-range").addEventListener("change", volumeChanged = (inEvent) => {
        settings['volValue'] = parseInt(inEvent.target.value);
        console.log(settings);
        piSaveSettings();
    });

    this.addSliderTooltip(document.getElementById("vol-range"), (value)=>{
        return "+/- " + value + "%";
    });

    document.getElementById('dev_input').checked = settings['device'] == "input";
    document.getElementById('dev_output').checked = settings['device'] == "output";

    this.setAndValidateField(document.getElementById("vol-range"), 'volValue');

    // Before overwriting parrent method, save a copy of it
    var piLoad = this.load;

    // Public function called to load the fields
    this.load = function (data) {
        // Call PI load method
        console.log("loading", settings);
        piLoad.call(this, data);
        console.log("loading...", settings);

        // If action enabled
        if (!data.disabled && !data.unauthorized) {
            // Load all servers
            console.log("device", settings);
            document.getElementById('dev_input').checked = settings['device'] == "input";
            document.getElementById('dev_output').checked = settings['device'] == "output";
            document.getElementById("vol-range").value = settings['volValue'];
        }

        console.log("loading.......", settings);
        // Enable / Disable the fields
        document.getElementById('dev_input').disabled = data.disabled || data.unauthorized;
        document.getElementById('dev_output').disabled = data.disabled || data.unauthorized;
        document.getElementById('vol-range').disabled = data.disabled || data.unauthorized;

        // Show PI
        document.getElementById('pi').style.display = "block";
    }
}
