/*!
	@file       pushToTalkPI.js
	@brief      Contains PI for Push to Talk action
	@author     Valentin Reinbold
	@copyright  (c) 2021, Corsair Memory, Inc. All Rights Reserved.
*/

function ServerStatsPI(inContext, inLanguage) {
    // Inherit from PI
    PI.call(this, inContext, inLanguage);

    // Save a copy of a method
    var piSaveSettings = this.saveSettings;

    // Add fields
    var fields =`
    <div class='sdpi-item'>
        <div class='sdpi-item-label translated' id='server-label' x-text="Server"></div>
        <select class='sdpi-item-value select' id='server'>
            <option disabled id='no-server' class="translated" value='no-server' x-text="NoServer"></option>
        </select>
    </div>
    <div class="sdpi-item" id="display-messages">
        <div class="sdpi-item-label translated" x-text="SrvStatMsg"></div>
        <select class="sdpi-item-value select" id="select-messages">
        <option value="nothing" class="translated" x-text="DontDisplay"></option>
        <option value="display" class="translated" x-text="SrvStatMsgDisplayNew"></option>
        </select>
    </div>
    <div class="sdpi-item" id="display-users">
        <div class="sdpi-item-label translated" x-text="Users"></div>
        <select class="sdpi-item-value select" id="select-users">
        <option value="nothing" class="translated" x-text="DontDisplay" selected></option>
        <option value="online" class="translated" x-text="SrvStatUsrOnline"></option>
        <option value="active" class="translated" x-text="SrvStatUsrActive"></option>
        </select>
    </div>
    <div class="message warning" id="widget-not-enabled" >
    <a href="#" id="warn-link"><span class="translated" x-text="SrvWidgetWarn"></span></a></div>
    <div class="sdpi-item" id="on-press">
        <div class="sdpi-item-label translated" x-text="OnPress"></div>
        <select class="sdpi-item-value select" id="select-press">
        <option value="nothing" class="translated" x-text="DoNothing"></option>
        <option value="open" class="translated" x-text="OnPressRecentMsg"></option>
        <option value="clear" class="translated" x-text="OnPressClearMsg"></option>
        </select>
    </div>
    <div class="sdpi-item" id="on-longpress">
        <div class="sdpi-item-label translated" x-text="OnLongPress"></div>
        <select class="sdpi-item-value select" id="select-longpress">
        <option value="nothing" class="translated" x-text="DoNothing"></option>
        <option value="open" class="translated" x-text="OnPressRecentMsg"></option>
        <option value="clear" class="translated" x-text="OnPressClearMsg"></option>
        </select>
    </div>

	`;
    document.getElementById('placeholder').innerHTML = fields;

    // Temporarily(?) disable press/long press customization
    document.getElementById('on-press').style.display = "none";
    document.getElementById('on-longpress').style.display = "none";

    document.getElementById('warn-link').onclick = ()=>{
        openURL("https://discord.com/blog/add-the-discord-widget-to-your-site");
    }

    this.initField('server');
    const serverEl = document.getElementById("server");
    serverEl.addEventListener("change", () => {
        settings['serverName'] = serverEl.options[serverEl.selectedIndex].innerText;
        piSaveSettings();
    });

    this.initField('select-messages');
    this.initField('select-users');
    this.initField('select-press');
    this.initField('select-longpress');

    document.getElementById('widget-not-enabled').style.display = "none";

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

            this.loadField('server', data.servers, defaultsServer);

            document.getElementById('widget-not-enabled').style.display = "none";
            if(data.warning){
                document.getElementById(data.warning).style.removeProperty("display");
            }
        }

        // Enable / Disable the fields
        document.getElementById('server').disabled = data.disabled || data.unauthorized;
        document.getElementById('select-messages').disabled = data.disabled || data.unauthorized;
        document.getElementById('select-users').disabled = data.disabled || data.unauthorized;
        document.getElementById('select-press').disabled = data.disabled || data.unauthorized;
        document.getElementById('select-longpress').disabled = data.disabled || data.unauthorized;

        // Show PI
        document.getElementById('pi').style.display = "block";
    }
}
