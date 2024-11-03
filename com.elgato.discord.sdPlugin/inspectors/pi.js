/*!
    @file       pi.js
    @brief      Contains PI for base action
    @author     Valentin Reinbold
    @copyright  (c) 2021, Corsair Memory, Inc. All Rights Reserved.
*/

function PI(inContext, inLanguage) {
    // Init PI
    var instance = this;

    var appWarningMessage = document.getElementById('app-warning-message');
    var authWarningMessage = document.getElementById('auth-warning-message');
    var accessButton = document.getElementById('access-button');

    // Add event listener
    accessButton.addEventListener("click", () => {
        instance.sendToPlugin({ 'grantAccess': true });
    });

    // Private function to return the action identifier
    function getAction() {
        // Find out type of action
        if (instance instanceof MutePI)
            return "com.elgato.discord.mute";
        if (instance instanceof DeafenPI)
            return "com.elgato.discord.deafen";
        if (instance instanceof VoiceChannelPI)
            return "com.elgato.discord.channel.voice";
        if (instance instanceof TextChannelPI)
            return "com.elgato.discord.channel.text";
        if (instance instanceof PushToTalkPI)
            return "com.elgato.discord.pushto.talk";
        if (instance instanceof PushToMutePI)
            return "com.elgato.discord.pushto.mute";
        if (instance instanceof VolumePI)
            return "com.elgato.discord.volumecontrol";
        if (instance instanceof VolumeButtonPI)
            return "com.elgato.discord.volumecontrolbutton";
        if (instance instanceof UserVolumeButtonPI)
            return "com.elgato.discord.uservolumecontrolbutton";
        if (instance instanceof UserVolumeDialPI)
            return "com.elgato.discord.uservolumecontroldial";
        if (instance instanceof PushToTalkTogglePI)
            return "com.elgato.discord.pushtotalktoggle";
        if (instance instanceof NotificationsPI)
            return "com.elgato.discord.notifications";
        if (instance instanceof SetAudioDevicePI)
            return "com.elgato.discord.setaudiodevice";
        if (instance instanceof ServerStatsPI)
            return "com.elgato.discord.serverstats";
        if (instance instanceof SoundboardPI)
            return "com.elgato.discord.soundboard";
        if (instance instanceof DefaultPI)
            return instance.actionId;
    }

    // Public function called to initialize field
    this.initField = function(key) {
        // Init data
        updateField(key, settings[key]);
        // Add event listener
        document.getElementById(key).addEventListener("input", fieldChanged);
    }

    // Private function called to update field
    function updateField(key, value) {
        value = value || "";
        // Update field content
        document.getElementById(key).value = value;
    }

    // Field changed
    function fieldChanged(event) {
        var key = event.srcElement.id;
        var value = (event ? event.target.value : undefined);
        // Update data
        updateField(key, value);
        // Update settings
        settings[key] = value;
        instance.saveSettings();
    }

    // Public function called to load the fields
    this.load = function (data) {
        if (data.disabled) {
            // Show app warning message
            appWarningMessage.style.display = "block";
            authWarningMessage.style.display = "none";
        }
        else if (data.unauthorized) {
            // Show auth warning message
            appWarningMessage.style.display = "none";
            authWarningMessage.style.display = "block";
        }
        else {
            // Hide warning messages
            appWarningMessage.style.display = "none";
            authWarningMessage.style.display = "none";
        }
    }

    // Public function to send data to the plugin
    this.sendToPlugin = function (inData) {
        sendToPlugin(getAction(), inContext, inData);
    };

    // Public function to save the settings
    this.saveSettings = function () {
        saveSettings(inContext, settings);
    };
    setTimeout(()=>this.saveSettings(), 1000);

    /* --- Localization --- */

    this.localization = {};

    var finished = false;
    loadLocalization(inLanguage);
    loadLocalization("en");

    function loadLocalization(language) {
        getLocalization(language, function(inStatus, inLocalization) {
            if (inStatus) {
                instance.localization[language] = inLocalization['PI'];

                if (!finished) {
                    finished = true;
                }
                else {
                    instance.localize(function (key) {
                        // Actual localization
                        var value = instance.localization[inLanguage][key];
                        if (value != undefined && value != "") {
                            return value;
                        }
                        // Default localization
                        value = instance.localization["en"][key];
                        if (value != undefined && value != "") {
                            return value;
                        }
                        return key;
                    });
                }
            }
            else {
                console.log(inLocalization);
            }
        });
    }

    // Localize the UI
    this.localize = function (tr) {
        // Check if localizations were loaded
        if (instance.localization == null) {
            return;
        }

        // Localize the warning message select
        document.getElementById("app-warning").innerHTML = tr("AppWarning");
        document.getElementById("auth-warning").innerHTML = tr("AuthWarning");
        document.getElementById("access-label").innerHTML = tr("AccessLabel");
        document.getElementById("access-button").innerHTML = tr("AccessButton");

        const nodes = document.getElementsByClassName('translated');
        for(const node of nodes){
            const text = node.getAttribute("x-text");
            //if(text){
                // If the node has a dummy span child, we need to recreate it
                let hasSpan = false;
                const spans = node.getElementsByTagName("span");
                if(spans.length > 0){
                    hasSpan = true;
                }

                const translated = tr(text);
                node.innerHTML = translated ? translated : text;

                if(hasSpan){
                    node.prepend(document.createElement("span"));
                }
            //}
        }
    };

    // Load the localizations
    function getLocalization(inLanguage, inCallback) {
        var url = "../" + inLanguage + ".json";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                try {
                    data = JSON.parse(xhr.responseText);
                    var localization = data['Localization'];
                    inCallback(true, localization);
                }
                catch(e) {
                    inCallback(false, 'Localizations is not a valid json.');
                }
            }
            else {
                inCallback(false, 'Could not load the localizations.');
            }
        };
        xhr.onerror = function () {
            inCallback(false, 'An error occurred while loading the localizations.');
        };
        xhr.ontimeout = function () {
            inCallback(false, 'Localization timed out.');
        };
        xhr.send();
    }
    this.setAndValidateField = function(input, key, value){
        if(!input || !input.type){
            return;
        }
        if (value === undefined){
            value = settings[key];
        }

        switch(input.type){
            //case "range": case "select-one":
            case "radio": case "checkbox":
                break;
            case "range":
                input.value = parseInt(value);
                if( input.value != settings[key]){
                    settings[key] = parseInt(input.value);
                }
                break;
            default:
                input.value = value;
                if( input.value != settings[key]){
                    settings[key] = input.value;
                }
                break;
        }
    }
    this.addSliderTooltip = function (slider, textFn) {
		if (typeof textFn != "function"){
			textFn = (value)=>{
				return value;
			}
		}
		const adjustSlider = slider;
		const tooltip = document.querySelector('.sdpi-info-label');

		// Add clickable labels
		const parent = slider.parentNode;
		if (parent){
			const clickables = parent.getElementsByClassName("clickable");
			for( const clickable of clickables){
				const value = clickable.getAttribute("x-value");
				if (value){
					clickable.addEventListener('click', (event)=>{
						slider.value = value;
						let ev = new Event("change", { "bubbles": true, "cancelable": true });
						slider.dispatchEvent(ev);
					})
				}
			}
		}

		tooltip.textContent = textFn(parseFloat(adjustSlider.value));

		const fn = () => {
			const tw = tooltip.getBoundingClientRect().width;
			const rangeRect = adjustSlider.getBoundingClientRect();
			const w = rangeRect.width - tw / 2;
			const percnt = (adjustSlider.value - adjustSlider.min) / (adjustSlider.max - adjustSlider.min);
			if (tooltip.classList.contains('hidden')) {
				tooltip.style.top = '-1000px';
			} else {
				tooltip.style.left = `${rangeRect.left + Math.round(w * percnt) - tw / 4}px`;
				tooltip.textContent = textFn(parseFloat(adjustSlider.value));
				tooltip.style.top = `${rangeRect.top - 30}px`;
			}
		}

		if (adjustSlider) {
			adjustSlider.addEventListener(
				'mouseenter',
				function() {
					tooltip.classList.remove('hidden');
					tooltip.classList.add('shown');
					fn();
				},
				false
			);

			adjustSlider.addEventListener(
				'mouseout',
				function() {
					tooltip.classList.remove('shown');
					tooltip.classList.add('hidden');
					fn();
				},
				false
			);

			adjustSlider.addEventListener('input', fn, false);
		}
	}

    // function called to empty the field options
    this.emptyField = function (key) {
        var options = document.getElementsByClassName(key);
        while (options.length > 0) {
            options[0].parentNode.removeChild(options[0]);
        }
    }

    this.updateName = function(settingsField, nameField, node){
        if (settings[settingsField] && node.selectedIndex >= 0){
            // Ensure we actually have a nick for the user
            let selectedOption = node.options[node.selectedIndex];
            if (selectedOption){
                settings[nameField] = selectedOption.innerText;
            }
        }
    }

    /** function called to load the field options
     *  @param {{key: any, value: any}} defaults
     */
    this.loadField = function(key, list, defaults) {
        // Remove previously shown options
        this.emptyField(key);

        if(Array.isArray(list)){
            const newList = {};
            for(const item of list){
                if(item && item.id){
                    newList[item.id] = item;
                }
            }
            list = newList;
        }

        if(defaults !== undefined){
            if (typeof list !== "object"){
                list = {};
            }
            if(defaults.value){
                list[defaults.key] = Object.assign({}, list[defaults.key], {name: defaults.value});
            }
        }

        // If there is no element
        if (list == undefined || Object.keys(list).length == 0) {
            // Show & Select the 'Nothing' option
            document.getElementById('no-' + key).style.display = "block";
            document.getElementById(key).value = 'no-' + key;
            return;
        }

        // Hide the 'Nothing' option
        document.getElementById('no-' + key).style.display = "none";

        // Sort the elements alphabatically
        var IDsSorted = Object.keys(list).sort((a, b) => {
            const sortA = list[a].sortIdx || 0;
            const sortB = list[b].sortIdx || 0;

            if(sortA != sortB){
                return sortA - sortB;
            }
            return list[a].name.localeCompare(list[b].name);
        });

        // Add the options
        IDsSorted.forEach(id => {
            var option = "<option value='" + id + "' class='" + key + "'>" + list[id].name + "</option>";
            document.getElementById('no-' + key).insertAdjacentHTML("beforebegin", option);
        });

        // If no existing element configured
        if (settings[key] == undefined || !(settings[key] in list)) {
            // If a default wasn't provided
            if (!defaults || !defaults.key){
                // Choose the first option in the list
                settings[key] = IDsSorted[0];
            }
            else {
                // Choose the default option
                settings[key] = defaults.key;
            }
            this.saveSettings();
        }

        // Select the currently configured element
        document.getElementById(key).value = settings[key];
    }
}
