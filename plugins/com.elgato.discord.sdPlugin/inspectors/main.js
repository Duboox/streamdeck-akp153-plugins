/*!
    @file       main.js
    @brief      Handles SD behavior
    @author     Valentin Reinbold
    @copyright  (c) 2021, Corsair Memory, Inc. All Rights Reserved.
*/

// Global web socket
var websocket = null;

// Global plugin settings
var globalSettings = {};

// Global settings
var settings = {};

// Setup the websocket and handle communication
function connectElgatoStreamDeckSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
    // Parse parameter from string to object
    var actionInfo = JSON.parse(inActionInfo);
    var info = JSON.parse(inInfo);

    console.log("actionInfo", actionInfo);
    console.log("info", info);

    // Save global settings
    settings = actionInfo['payload']['settings'];

    // Retrieve language
    var language = info['application']['language'];

    // Retrieve action identifier
    var action = actionInfo['action'];

    // Open the web socket to Stream Deck
    // Use 127.0.0.1 because Windows needs 300ms to resolve localhost
	websocket = new WebSocket("ws://127.0.0.1:" + inPort);

    // WebSocket is connected, send message
	websocket.onopen = function () {
		// Register property inspector to Stream Deck
		registerPI(inRegisterEvent, inUUID);

        // Request the global settings of the plugin
        requestGlobalSettings(inUUID);
	};

    // Create actions
    if (action == "com.elgato.discord.mute") {
        var pi = new MutePI(inUUID, language);
    }
	else if (action == "com.elgato.discord.deafen") {
        var pi = new DeafenPI(inUUID, language);
    }
	else if (action == "com.elgato.discord.channel.voice") {
        var pi = new VoiceChannelPI(inUUID, language);
    }
    else if (action == "com.elgato.discord.channel.text") {
        var pi = new TextChannelPI(inUUID, language);
    }
    else if (action == "com.elgato.discord.pushto.talk") {
        var pi = new PushToTalkPI(inUUID, language);
    }
    else if (action == "com.elgato.discord.pushto.mute") {
        var pi = new PushToMutePI(inUUID, language);
    }
    else if (action == "com.elgato.discord.volumecontrol") {
        var pi = new VolumePI(inUUID, language);
    }
    else if (action == "com.elgato.discord.volumecontrolbutton") {
        var pi = new VolumeButtonPI(inUUID, language);
    }
    else if (action == "com.elgato.discord.uservolumecontrolbutton") {
        var pi = new UserVolumeButtonPI(inUUID, language);
    }
    else if (action == "com.elgato.discord.uservolumecontroldial") {
        var pi = new UserVolumeDialPI(inUUID, language);
    }
    else if (action == "com.elgato.discord.pushtotalktoggle") {
        var pi = new PushToTalkTogglePI(inUUID, language);
    }
    else if (action == "com.elgato.discord.notifications") {
        var pi = new NotificationsPI(inUUID, language);
    }
    else if (action == "com.elgato.discord.setaudiodevice") {
        var pi = new SetAudioDevicePI(inUUID, language);
    }
    else if (action == "com.elgato.discord.serverstats") {
        var pi = new ServerStatsPI(inUUID, language);
    }
    else if (action == "com.elgato.discord.soundboard") {
        var pi = new SoundboardPI(inUUID, language);
    }
    else {
        var pi = new DefaultPI(inUUID, language, action);
    }

    websocket.onmessage = function (evt) {
        // Received message from Stream Deck
        var jsonObj = JSON.parse(evt.data);
        var event = jsonObj['event'];
        var jsonPayload = jsonObj['payload'];

        if(event == "didReceiveGlobalSettings") {
            // Set global plugin settings
            globalSettings = jsonPayload['settings'];
        }
        else if(event == "didReceiveSettings") {
            // Save global settings after default was set
            settings = jsonPayload['settings'];
        }
        else if(event == "sendToPropertyInspector") {
            // Initialize & receive the new data
            var data = jsonPayload ?? {};

            // Load Property Inspector
            pi.load(data);
        }
    };
}

// Register property inspector
function registerPI(inEvent, inUUID) {
    if (websocket) {
        const json = {
            "event": inEvent,
            "uuid": inUUID
        };
        websocket.send(JSON.stringify(json));
    }
}

// Set data to plugin
function sendToPlugin(inAction, inContext, inData) {
    if (websocket) {
        const json = {
            "action": inAction,
            "event": "sendToPlugin",
            "context": inContext,
            "payload": inData
        };
        websocket.send(JSON.stringify(json));
    }
}

// Save settings
function saveSettings(inUUID, inSettings) {
    if (websocket) {
        const json = {
                "event": "setSettings",
                "context": inUUID,
                "payload": inSettings
        };
        websocket.send(JSON.stringify(json));
    }
}

// Save global settings
function saveGlobalSettings(inUUID) {
    if (websocket) {
        const json = {
            "event": "setGlobalSettings",
            "context": inUUID,
            "payload": globalSettings
        };
        websocket.send(JSON.stringify(json));
    }
}

// Request global settings
function requestGlobalSettings(inUUID) {
    if (websocket) {
        const json = {
            "event": "getGlobalSettings",
            "context": inUUID
        };
        websocket.send(JSON.stringify(json));
    }
}

//
function openURL(url) {
    if (websocket) {
        const json = {
            "event": "openUrl",
            "payload": {
                "url": url
            }
        };
        websocket.send(JSON.stringify(json));
    }
}
