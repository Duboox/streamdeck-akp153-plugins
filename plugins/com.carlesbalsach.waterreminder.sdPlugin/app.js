/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

// Action Cache
const MACTIONS = {};

const reminderAction = new Action("com.carlesbalsach.waterreminder.action");

reminderAction.onWillAppear(({ context, payload }) => {
    // console.log('will appear', context, payload);
    const settings = payload.settings || {};
    if (settings.lastDrankTime) {
        settings.lastDrankTime = new Date(settings.lastDrankTime); // Restore Date object
    } else {
        settings.lastDrankTime = new Date(); // Set default if not found
    }

    MACTIONS[context] = new ReminderAction(context, payload);
});

reminderAction.onWillDisappear(({ context }) => {
    // console.log('will disappear', context);
    MACTIONS[context].interval && clearInterval(MACTIONS[context].interval);
    delete MACTIONS[context];
});

reminderAction.onDidReceiveSettings(({ context, payload }) => {
    //  console.log('onDidReceiveSettings', payload?.settings?.hour12, context, payload);
    MACTIONS[context].didReceiveSettings(payload?.settings);
});

reminderAction.onTitleParametersDidChange(({ context, payload }) => {
    // console.log('wonTitleParametersDidChange', context, payload);
    // MACTIONS[context].color = payload.titleParameters.titleColor;
    // MACTIONS[context].ticks = ''; // trigger re-rendering of ticks
});

/**
 * The first event fired when Stream Deck starts
 */
$SD.onConnected(
    ({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
        console.log("Stream Deck connected!");
    }
);

reminderAction.onKeyDown(({ action, context, device, event, payload }) => {
    console.log("onKeyDown Event");

    const actionInstance = MACTIONS[context];
    actionInstance.waterConsumed(); // Perform water consumed logic
});

class ReminderAction {
    constructor(context, payload) {
        this.context = context;
        this.payload = payload;
        this.interval = null;
        this.isEncoder = payload?.controller === "Encoder";
        this.settings = {
            ...{
                reminderInterval: 60, // Default to 60 minutes
                lastDrankTime: new Date(),
                playSound: true,
            },
            ...payload?.settings,
        };
        this.percentage = 100;

        this.size = 48; // default size of the icon is 48
        this.color = "#EFEFEF";
        this.saveSettings();
        this.init();
        this.update();
    }

    init() {
        this.lastDrankTime = new Date(this.settings.lastDrankTime);
        this.interval = setInterval(() => {
            this.update();
        }, 1 * 1000);
    }

    waterConsumed() {
        console.log("Button pressed: Water consumed");
        this.lastDrankTime = new Date();
        this.percentage = 100; // Reset to full
        this.updateButtonImage();

        this.settings.lastDrankTime = this.lastDrankTime;
        this.saveSettings();
    }

    didReceiveSettings(settings) {
        if (!settings) return;
        let dirty = false;
        if (settings.hasOwnProperty("reminderInterval")) {
            this.settings.reminderInterval = settings.reminderInterval;
            dirty = true;
            console.log(
                "New Setting Reminder Interval: " + settings.reminderInterval
            );
        }
        if (settings.hasOwnProperty("playSound")) {
            this.settings.playSound = settings.playSound;
            dirty = true;
            console.log("New Setting PlaySound: " + settings.playSound);
        }
        if (settings.hasOwnProperty("lastDrankTime")) {
            this.settings.lastDrankTime = settings.lastDrankTime;
            dirty = true;
            console.log("New Setting LastDrankTime: " + settings.lastDrankTime);
        }
        if (dirty) {
            this.lastDrankTime = settings.lastDrankTime;
            this.update();
        }
    }

    saveSettings(immediateUpdate = false) {
        $SD.setSettings(this.context, this.settings);
        if (immediateUpdate) this.update();
    }

    toggleSeconds() {
        this.longDateAndTime = !this.longDateAndTime;
        this.update();
    }

    update() {
        this.updatePercentage();

        if (this.percentage === 0) {
            this.playSound();
            this.percentage = -1;
        }

        this.updateButtonImage();
    }

    updatePercentage() {
        if (this.percentage >= 0) {
            const currentTime = new Date();
            const timeDeltaSeconds =
                (currentTime - new Date(this.lastDrankTime)) / 1000; // Convert milliseconds to seconds
            this.percentage = Math.max(
                0,
                Math.floor(
                    100 -
                        (timeDeltaSeconds /
                            (this.settings.reminderInterval * 60)) *
                            100
                )
            );
            // console.log("Percentage: " + this.percentage);
        } else {
            console.log("Status: Waiting for User Input to Refill.");
        }
    }

    updateButtonImage() {
        if (this.percentage >= 0) {
            const svg = this.getSVGImage(this.percentage);
            const icon = `data:image/svg+xml;base64,${btoa(svg)}`;
            $SD.setImage(this.context, icon);
        } else {
            const svg = this.getEmptySVGImage();
            const icon = `data:image/svg+xml;base64,${btoa(svg)}`;
            $SD.setImage(this.context, icon);
        }
    }

    playSound() {
        if (this.settings.playSound) {
            const tt0 = this.getTimeDeltaToZero();
            if (tt0 > -3 && tt0 < 3) { // This is to avoid playing sounds if coming back to the tab long after the timer has reached 0.
                const audio = new Audio("assets/drop_sound.mp3");
                audio
                    .play()
                    .catch((error) =>
                        console.error("Error playing sound:", error)
                    );
            }
        }
    }

    // This is to check the time difference between the total time and elapsed time
    getTimeDeltaToZero() {
        const currentTime = new Date();
        const timeDeltaSeconds = Math.floor(
            (currentTime - new Date(this.lastDrankTime)) / 1000
        ); // Convert milliseconds to seconds
        const totalTimeSeconds = this.settings.reminderInterval * 60;
        return totalTimeSeconds - timeDeltaSeconds;
    }

    getSVGImage(percentage) {
        // Percentage Goes from 0 (empty) to 100 (full)
        const height = Math.floor(80 - percentage * 0.6);
        const widthL = Math.floor(20 - percentage * 0.1);
        const widthR = Math.floor(80 + percentage * 0.1);
        return `
			<svg width="144px" height="144px" viewBox="0 0 100 100" id="Line" xmlns="http://www.w3.org/2000/svg">
  
				<polygon points="${widthL},${height} ${widthR},${height} 80,90 20,90" style="fill:#00bfff;stroke-width:0" />
			
				<line id="glass_left" x1="10" y1="10" x2="20" y2="90" style="fill:none;stroke:black;stroke-linecap:round;stroke-linejoin:round;stroke-width:12px"></line>
				<line id="glass_right" x1="90" y1="10" x2="80" y2="90" style="fill:none;stroke:black;stroke-linecap:round;stroke-linejoin:round;stroke-width:12px"></line>
				<line id="glass_right" x1="20" y1="90" x2="80" y2="90" style="fill:none;stroke:black;stroke-linecap:round;stroke-linejoin:round;stroke-width:12px"></line>
					
				<line id="glass_left" x1="10" y1="10" x2="20" y2="90" style="fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:8px"></line>
				<line id="glass_right" x1="90" y1="10" x2="80" y2="90" style="fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:8px"></line>
				<line id="glass_right" x1="20" y1="90" x2="80" y2="90" style="fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:8px"></line>

			</svg>
		`;
    }

    getEmptySVGImage() {
        return `
			<svg width="512px" height="512px" viewBox="0 0 100 100" id="Line" xmlns="http://www.w3.org/2000/svg">
  
					<polygon points="10,20 90,20 80,90 20,90" style="fill:#00bfff;stroke-width:0" />
					<polygon points="40,15 60,15 50,50" style="fill:black;stroke:black;stroke-width:5;stroke-linejoin:round;stroke-width:8.5" />
					<polygon points="40,15 60,15 50,50" style="fill:#FF0000;stroke:#FF0000;stroke-width:3;stroke-linejoin:round;stroke-width:5" />
					
					<circle r="8.5" cx="50" cy="65" fill="black" />
					<circle r="7" cx="50" cy="65" fill="red" />
			
					<line id="glass_left" x1="10" y1="10" x2="20" y2="90" style="fill:none;stroke:black;stroke-linecap:round;stroke-linejoin:round;stroke-width:12px"></line>
					<line id="glass_right" x1="90" y1="10" x2="80" y2="90" style="fill:none;stroke:black;stroke-linecap:round;stroke-linejoin:round;stroke-width:12px"></line>
					<line id="glass_right" x1="20" y1="90" x2="80" y2="90" style="fill:none;stroke:black;stroke-linecap:round;stroke-linejoin:round;stroke-width:12px"></line>
						
					<line id="glass_left" x1="10" y1="10" x2="20" y2="90" style="fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:8px"></line>
					<line id="glass_right" x1="90" y1="10" x2="80" y2="90" style="fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:8px"></line>
					<line id="glass_right" x1="20" y1="90" x2="80" y2="90" style="fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:8px"></line>

			</svg>
		`;
    }
}
