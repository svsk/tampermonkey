// ==UserScript==
// @name         SoundChecker?
// @namespace    http://boards.4chan.org/
// @version      1.0
// @description  Show sound icons on webms with sound on 4chan
// @author       svsk
// @match        http://boards.4chan.org/*/thread/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function getSoundIconHtml(parentElement) {
		var soundIcon = document.createElement("div");
		soundIcon.innerHTML = "&#128266;";
		soundIcon.style.position = "relative";
		soundIcon.style.top = "-"+(parentElement.offsetHeight - 5)+"px";
		soundIcon.style.left = "5px";
		soundIcon.style.height = "20px";
		soundIcon.style.width = "20px";

		return soundIcon;
	}

	function flagVideoForSound(src, hasSound) {
		if (hasSound) {
			var link = select("a.fileThumb[href='"+src+"']")[0];
			if (link) {
				var soundIcon = getSoundIconHtml(link);
				link.appendChild(soundIcon);
			}
		}
	}

	function select(selector) {
		return document.querySelectorAll(selector);
	}
	
	function startSoundCheck() {
		var links = document.getElementsByClassName("fileThumb");
		var queryFlag = "?checkForAudio";

		for (var i = 0; i < links.length; i++) {
			if (links[i].href.indexOf(".webm") !== -1) {
				var vid = document.createElement("video");
				vid.addEventListener("loadeddata", function () {    
					var originalSrc = this.src.replace(queryFlag, "").replace("https:", "").replace("http:", "");

					flagVideoForSound(originalSrc, (this.webkitAudioDecodedByteCount > 0));  
				});

				vid.src = links[i].href + queryFlag;
			}
		}
	}
	
	startSoundCheck();
})();