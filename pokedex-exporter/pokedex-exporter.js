// ==UserScript==
// @name         PokedexExporter
// @namespace    http://sverr.es/
// @version      1.0
// @description  try to take over the world!
// @author       Swuden
// @match        https://pokedextracker.com/u/Veinlash
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';
		
	unsafeWindow.executeExport = function () {
		var pokemon = document.getElementsByTagName("pokemon");
		var theNumbers = [];
		for (var i = 0; i < 151; i++) {
		if (pokemon[i].className == "captured") {
		continue;
		}
		theNumbers.push(i+1);
		}
		return theNumbers.join(",");
	};
})();