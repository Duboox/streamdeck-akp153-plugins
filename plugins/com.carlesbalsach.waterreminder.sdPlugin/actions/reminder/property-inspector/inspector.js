/// <reference path="../../../libs/js/property-inspector.js" />
/// <reference path="../../../libs/js/utils.js" />

let MSETTINGS = {
    reminderInterval: 60,
    playSound: true,
};

$PI.onConnected((jsn) => {
    // MSETTINGS = $PI.getSettings();
    MSETTINGS = jsn?.actionInfo?.payload?.settings || {};

    const intervalValue = document.getElementById("intervalValue");
    if (intervalValue) {
        intervalValue.textContent = MSETTINGS.reminderInterval;
    }

    const reminderIntervalSlider = document.getElementById("reminderInterval");
    if (reminderIntervalSlider) {
        reminderIntervalSlider.value = MSETTINGS.reminderInterval;
        reminderIntervalSlider.onchange = () => {
            MSETTINGS.reminderInterval = reminderIntervalSlider.value;
            MSETTINGS.lastDrankTime = new Date();
            $PI.setSettings(MSETTINGS);
            intervalValue.textContent = reminderIntervalSlider.value;
        };
    }

    const playSound = document.getElementById("playSound");
    if (playSound) {
        playSound.checked = MSETTINGS.playSound === true;
        playSound.onchange = () => {
            MSETTINGS.playSound = playSound.checked;
            $PI.setSettings(MSETTINGS);
            playSound.checked = MSETTINGS.playSound === true;
        };
    }

    // Finally show the UI
    document.querySelector(".sdpi-wrapper").classList.remove("hidden");
});
document.querySelector(".sdpi-wrapper").classList.remove("hidden");

$PI.onDidReceiveGlobalSettings(({ payload }) => {
    console.log("onDidReceiveGlobalSettings", payload);
});
