// ==UserScript==
// @name         Youtube Sub Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filter videos in the Youtube subscription feed
// @author       Sverre
// @match        https://www.youtube.com/feed/subscriptions*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function applyFilter() {
		var filter = prompt("What do you want to see?").toLowerCase();

		var videos = document.getElementsByClassName("item-section");
		for (var i = 0; i < videos.length; i++) {	
			var title = videos[i].getElementsByClassName("yt-uix-tile-link")[0].innerHTML;
			var author = videos[i].getElementsByClassName("yt-lockup-byline")[0].getElementsByTagName("a")[0].innerHTML;

			var hit = false;
			if (hit == false && author.toLowerCase().indexOf(filter) != -1) {
				hit = true;
			}

			if (hit == false && title.toLowerCase().indexOf(filter) != -1) {
				hit = true;
			}


			if (hit == false) {
				videos[i].style.display = "none";
			} else {
				videos[i].style.display = "inline";
			}
		}
	}
	
	var filterButton = document.createElement("a");
	filterButton.className = "yt-uix-button yt-uix-button-default";
	filterButton.innerHTML = "Filter";
	filterButton.style.marginLeft = "15px"
	document.getElementById("yt-masthead-user").appendChild(filterButton);
	filterButton.onclick = applyFilter;
})();