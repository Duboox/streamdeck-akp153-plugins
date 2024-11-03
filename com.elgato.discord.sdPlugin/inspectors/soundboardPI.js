/*!
	@file       soundboardPI.js
	@brief      Contains PI for the Soundboard action
	@author     Andrew story
	@copyright  (c) 2023, Corsair Memory, Inc. All Rights Reserved.
*/
let EmojiData = null;

// Helper function to return the twemoji for a given unicode emoji. Strips off codepoints until the longest prefix is found.
function GetEmojiPath(emoji){
    if(!emoji){
        return "";
    }
    let name = twemoji.convert.toCodePoint(emoji);
    let result = null;
    let split = name.split("-");
    while(!result && split.length > 0){
        result = EmojiData[split.join("-")];
        if(result){
            return split.join("-");
        }
        split.pop();
    }
    return "";
}

function GetEmojiData(emoji){
    if(!emoji){
        return "";
    }
    result = EmojiData[GetEmojiPath(emoji)];
    return result ? result : "";
}

function GetCustomEmojiLink(snowflake, size=128){
    return "https://cdn.discordapp.com/emojis/" + snowflake + ".webp?size="+size+"&quality=lossless";
}

function SoundboardPI(inContext, inLanguage) {
    // Inherit from PI
    PI.call(this, inContext, inLanguage);

    if(!EmojiData){
        fetch("assets/emoji.json").then((data)=>{
            data.json().then((data)=>{
                EmojiData = data;
                const searcher = document.getElementById("searcher");
                this.filterData(searcher.value);
            });
        });
    }

    this.labelSearchResults = "Search Results";
    this.labelSearchEmpty = "No Sounds Found";
    this.labelDefaultSounds = "Discord Sounds";

    const GUILDID_SEARCH = "SEARCH";
    const GUILDID_DEFAULT = "DEFAULT";
    const NITRO_NONE = 0;
    const NITRO_CLASSIC = 1;
    const NITRO_FULL = 2;
    const NITRO_BASIC = 3;

    // Save a copy of a method
    var piSaveSettings = this.saveSettings;

    let sounds = [];
    let currentServer = "";
    let premiumLevel = NITRO_NONE;

    // Add fields
    var fields =`
    <div id="searchbar-container">
        <div id="searchbar">
            <div class="sdpi-item">
                <div class="sdpi-item-label translated" x-text='Search'></div>
                    <input class="sdpi-item-value" type="text" name="team" id="searcher" />
                </div>
            </div>
        </div>
    </div>
    <div class="sdpi-item" id="soundboard-container">
        <div style="margin: auto">
            <table class="sdpi-item-value single-select" width="100%" id="soundboard-table" >
                <tbody id="soundboard">
                </tbody>
            </table>
        </div>
    </div>`;
    document.getElementById('placeholder').innerHTML = fields;

    const els = {
        "searcher": document.getElementById('searcher'),
        "body": document.getElementsByTagName("body")[0],
        "soundboard": document.getElementById('soundboard'),
    };

    let selection = null;
    if (settings["sound_id"]){
        selection = settings["sound_id"];
        els.searcher.setAttribute("placeholder", settings["sound_name"]);
    }

    this.filterData = (filter)=>{
        while(els.soundboard.firstChild){
            els.soundboard.removeChild(els.soundboard.firstChild);
        }

        const orderedGuilds = [];
        let dataCount = 0;
        const dataByGuild = {}
        if (!filter){
            if(sounds){
                for( const d of sounds){
                    let guild_id = d.guild_id;
                    if (!dataByGuild[guild_id]){
                        dataByGuild[guild_id] = [];
                    }
                    dataByGuild[guild_id].push(d);
                    dataCount ++;
                }
            }
            if(currentServer){
                orderedGuilds.push(currentServer);
            }
            if(premiumLevel != NITRO_FULL ){
                orderedGuilds.push(GUILDID_DEFAULT);
            }
            const guilds = [];
            for(const gid in dataByGuild){
                if( currentServer != gid && GUILDID_DEFAULT != gid){
                    guilds.push(gid);
                }
            }
            guilds.sort((lhs,rhs)=>{
                let a = dataByGuild[lhs];
                let b = dataByGuild[rhs];
                let nameA = "";
                let nameB = "";
                if( a && a[0] && a[0].guild_name && a[0].guild_name.toLowerCase ){
                    nameA = a[0].guild_name.toLowerCase();
                }
                if( b && b[0] && b[0].guild_name && b[0].guild_name.toLowerCase ){
                    nameB = b[0].guild_name.toLowerCase();
                }

                return nameA.localeCompare(nameB);
            });
            orderedGuilds.push(...guilds);
            if(premiumLevel == NITRO_FULL ){
                orderedGuilds.push(GUILDID_DEFAULT);
            }
        } else {
            orderedGuilds.push(GUILDID_SEARCH);
            const results = fuzzysort.go(filter, sounds, {
                keys:["name", "guild_name"],
                all: true
            });
            const trimmed = [];
            for(const sound of results){
                trimmed.push(sound.obj);
            }
            dataByGuild[GUILDID_SEARCH] = trimmed;
            dataCount = trimmed.length;
        }
        if(dataCount == 0 ){
            const labelRow = document.createElement("tr");
            labelRow.className = "sb-label";
            const labelData = document.createElement("td");
            labelData.textContent = this.labelSearchEmpty;
            labelData.colSpan = 2;
            els.soundboard.appendChild(labelRow);
            labelRow.appendChild(labelData);
            return;
        }
        for(const gid of orderedGuilds){
            const g = dataByGuild[gid];
            if(!g){
                continue;
            }
            if(g.length && g.length > 0){
                const labelRow = document.createElement("tr");
                labelRow.className = "sb-label";
                const labelData = document.createElement("td");
                if(gid == GUILDID_SEARCH){
                    labelData.textContent = this.labelSearchResults;
                } else if(gid == GUILDID_DEFAULT){
                    labelData.textContent = this.labelDefaultSounds;
                } else {
                    labelData.textContent = g[0].guild_name;
                }
                labelData.colSpan = 2;
                els.soundboard.appendChild(labelRow);
                labelRow.appendChild(labelData);

                let offset = 0;
                let currentRow = document.createElement("tr");
                for(const sound of g){
                    const currentData = document.createElement("td");
                    currentData.className = "interactive";
                    currentData.id = "sound_id-" + sound.sound_id;
                    if( sound.sound_id == selection){
                        currentData.classList.add("picked");
                    }
                    const span = document.createElement("span");
                    const txt = document.createTextNode(sound.name);
                    span.className = "soundboard-item";

                    currentData.addEventListener("click", ()=>{
                        if(selection){
                            const other = document.getElementById("sound_id-" + selection);
                            if (other){
                                other.classList.remove("picked");
                            }
                        }
                        selection = sound.sound_id;
                        document.getElementById("sound_id-" + selection).classList.add("picked");
                        els.searcher.setAttribute("placeholder", sound.name);
                        els.searcher.value = "";
                        settings['sound_id'] = sound.sound_id;
                        settings['guild_id'] = sound.guild_id;
                        settings['sound_name'] = sound.name;
                        if(!sound.emoji_id){
                            settings['emoji_path'] = GetEmojiPath(sound.emoji_name);
                        } else {
                            settings['emoji_path'] = GetCustomEmojiLink(sound.emoji_id, 128);
                        }
                        piSaveSettings();
                        this.filterData();
                    })

                    if(!sound.emoji_id){
                        if(EmojiData){
                            if (sound.emoji_name){
                                const filename = GetEmojiData(sound.emoji_name);
                                const img = document.createElement("img");
                                img.className = "sb-img";
                                img.src = filename;
                                span.appendChild(img);
                            }
                            span.appendChild(txt);
                            currentData.appendChild(span);
                        }
                    } else {
                        const img = document.createElement("img");
                        img.className = "sb-img";
                        img.src = GetCustomEmojiLink(sound.emoji_id, 24);
                        span.appendChild(img);
                        span.appendChild(txt);
                        currentData.appendChild(span);
                    }
                    currentRow.appendChild(currentData);

                    if( ++offset == 2){
                        els.soundboard.appendChild(currentRow);
                        currentRow = document.createElement("tr");
                        offset = 0;
                    }
                }
                if(offset > 0){
                    while(offset++ < 2){
                        const currentData = document.createElement("td");
                        currentData.className = "dummy";
                        const span = document.createElement("span");
                        currentData.appendChild(span);
                        currentRow.appendChild(currentData);
                    }
                    els.soundboard.appendChild(currentRow);
                    currentRow = document.createElement("tr");
                }
            }
        }
    }
    this.filterData();

    els.body.addEventListener("keydown", ()=>{
        if(document.activeElement != els.searcher){
            els.searcher.focus();
        }
    });

    els.searcher.addEventListener("input", (e)=>{

        const searcher = els.searcher;
        this.filterData(searcher.value);
    });

    // Before overwriting parrent method, save a copy of it
    var piLoad = this.load;
    // Public function called to load the fields
    this.load = function (data) {
        // Call PI load method
        piLoad.call(this, data);

        // If action enabled
        if (!data.disabled && !data.unauthorized) {
            sounds = data["sounds"];
            for(const sound of sounds){
                if(sound.guild_id == GUILDID_DEFAULT){
                    sound.guild_name = this.labelDefaultSounds + " default";
                }
            }
            premiumLevel = data["premiumLevel"];
            currentServer = data["serverId"];
            this.filterData(els.searcher.value);
        }

        // Enable / Disable the fields
        els.searcher.disabled = data.disabled || data.unauthorized;

        if(data.disabled || data.unauthorized){
            sounds = [];
            this.filterData();
        }

        // Show PI
        document.getElementById('pi').style.display = "block";
    }

    /* --- Localization --- */

    // Before overwriting parent method, save a copy of it
    var piLocalize = this.localize;

    // Localize the UI
    this.localize = function (tr) {
        // Call PIs localize method
        piLocalize.call(this, tr);

        // Capture default labels
        this.labelSearchResults = tr("SoundboardSearch");
        this.labelSearchEmpty = tr("SoundboardSearchEmpty");
        this.labelDefaultSounds = tr("SoundboardDefaults");
    };
}
