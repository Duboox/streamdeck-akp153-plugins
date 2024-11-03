/*!
	@file       voiceChannelPI.js
	@brief      Contains PI for Voice Channel action
	@author     Valentin Reinbold
	@copyright  (c) 2021, Corsair Memory, Inc. All Rights Reserved.
*/

function VoiceChannelPI(inContext, inLanguage) {
    // Inherit from PI
    PI.call(this, inContext, inLanguage);

    // Save a copy of a method
    var piSaveSettings = this.saveSettings;

    // Add fields
    var fields =
    "<div class='sdpi-item'> \
        <div class='sdpi-item-label translated' id='server-label' x-text='Server'></div> \
        <select class='sdpi-item-value select' id='server'> \
            <option disabled id='no-server' class='translated' value='no-server' x-text='NoServer'></option> \
        </select> \
    </div> \
    <div class='sdpi-item'> \
        <div class='sdpi-item-label translated' id='channel-label' x-text='VoiceChannel'></div> \
        <select class='sdpi-item-value select' id='channel'> \
            <option disabled id='no-channel' class='translated' value='no-channel' x-text='NoChannel'></option> \
        </select> \
    </div> \
    <div class='sdpi-item' id='icon-container'> \
        <div class='sdpi-item-label translated' id='icon-label' x-text='IconStyle'></div> \
        <select class='sdpi-item-value select' id='icon'> \
            <option value='static' class='translated' x-text='IconStatic'></option> \
            <option value='dynamic' class='translated' x-text='IconDynamic'></option> \
        </select> \
    </div>"

    document.getElementById('placeholder').innerHTML = fields;
    const serverEl = document.getElementById("server");
    serverEl.addEventListener("input", () => {
        settings['serverName'] = serverEl.options[serverEl.selectedIndex].innerText;
        this.emptyField('channel');
        settings['channel'] = "";
        piSaveSettings();
    });
    this.initField('server');
    this.initField('channel');

    document.getElementById("icon").addEventListener("change", () => {
        settings['icon'] = document.getElementById("icon").value;
        piSaveSettings();
    });
    document.getElementById("icon").value = settings['icon'] || "static";

    this.refreshElements = function(){
        if (settings.isInMultiAction){
            document.getElementById("icon-container").style.display = "none";
        } else {
            document.getElementById("icon-container").style.removeProperty("display");
        }
    };

    this.refreshElements();

    // Before overwriting parrent method, save a copy of it
    var piLoad = this.load;

    // Public function called to load the fields
    this.load = function (data) {
        // Call PI load method
        piLoad.call(this, data);

        // If action enabled
        if (!data.disabled && !data.unauthorized) {
            // Load all servers
            let defaultsServer = {key: settings["server"], value: settings["serverName"]};


            data.servers["[leave]"] = {sortIdx: -1, name: "None (Leave any active channel)"};
            this.loadField('server', data.servers, defaultsServer);

            // Load related channels
            this.loadField('channel', data.channels);

            document.getElementById("icon").value = settings['icon'] || "static";

            this.refreshElements();
        }

        // Enable / Disable the fields
        document.getElementById('server').disabled = data.disabled || data.unauthorized;
        document.getElementById('channel').disabled = data.disabled || data.unauthorized;
        document.getElementById('icon').disabled = data.disabled || data.unauthorized;

        // Show PI
        document.getElementById('pi').style.display = "block";
    }

}
