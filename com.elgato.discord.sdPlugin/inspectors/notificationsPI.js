/*!
	@file       pushToTalkPI.js
	@brief      Contains PI for Push to Talk action
	@author     Valentin Reinbold
	@copyright  (c) 2021, Corsair Memory, Inc. All Rights Reserved.
*/

function NotificationsPI(inContext, inLanguage) {
    // Inherit from PI
    PI.call(this, inContext, inLanguage);

    // Save a copy of a method
    var piSaveSettings = this.saveSettings;

    // Add fields
    var fields =`
    <div class="sdpi-item" id="on-press">
        <div class="sdpi-item-label translated" x-text="OnPress"></div>
        <select class="sdpi-item-value select" id="select-press">
        <option value="nothing" class="translated" x-text="DoNothing"></option>
        <option value="clear" class="translated" x-text="OnPressClearNotification"></option>
        <option value="open" class="translated" x-text="OnPressNotification"></option>
        <option value="cycle-recent" class="translated" x-text="OnPressCycleNotificationRecent"></option>
        <option value="cycle-old" class="translated" x-text="OnPressCycleNotificationOld"></option>
        </select>
    </div>
	`;
    document.getElementById('placeholder').innerHTML = fields;
    const els = {
        "select_press": document.getElementById('select-press'),
    };

    this.initField('select-press');

    els.select_press.value = settings['select-press'] || "open";

    // Before overwriting parrent method, save a copy of it
    var piLoad = this.load;

    // Public function called to load the fields
    this.load = function (data) {
        // Call PI load method
        piLoad.call(this, data);

        // Enable / Disable the fields
        document.getElementById('select-press').disabled = data.disabled || data.unauthorized;

        // Show PI
        document.getElementById('pi').style.display = "block";
    }
}
