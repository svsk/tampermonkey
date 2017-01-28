// ==UserScript==
// @name         PokeChecker
// @namespace    http://sverr.es/
// @version      1.2
// @description  Automatically look for new Pokémon on Pokevision
// @author       Swuden
// @match        https://pokevision.com/?pokechecker=true*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var missingPokemon = [
		2,3,5,6,8,9,12,24,26,28,31,34,36,38,40,44,45,50,51,53,57,59,62,64,65,67,68,71,73,75,78,80,82,83,84,85,87,88,89,91,93,94,95,99,100,101,103,105,106,110,112,113,114,115,117,121,122,123,126,128,130,131,132,134,138,139,140,141,142,143,144,145,146,148,149,150,151
	];

	var locationCounter = 0;
	var locations = [
		{lat: 58.18810310724232, lng: 8.038280010223389}, //Røsslyngstien
		{lat: 58.18920026032503, lng: 8.034557104110718}, //Fiolveien
		{lat: 58.18477185247494, lng: 8.034288883209229}, //Eidet
	];

	function switchLocation(coordinates) {
		var pokeVision = App.home;
		
		pokeVision.markers.center.setLatLng(coordinates);
		pokeVision.latitude  = coordinates.lat;
		pokeVision.longitude = coordinates.lng;

		if (Math.abs(pokeVision.lastLoadedLatitude - pokeVision.latitude) > 0.001 || Math.abs(pokeVision.lastLoadedLongitude - pokeVision.longitude) > 0.001) {
			pokeVision.findNearbyPokemon(pokeVision.latitude, pokeVision.longitude);
		}
		
		window.history.replaceState(null, null, '#/@' + pokeVision.latitude + ',' + pokeVision.longitude);
	}

	function getNextLocation() {
		locationCounter++;

		if (typeof locations[locationCounter] == "undefined") {
			locationCounter = 0;
		}

		return locations[locationCounter];
	}

	function clickTheButton() {
		$(".home-map-scan").click();
		var checker = setInterval(function () {
			console.log("Waiting for scan...");
			if ($(".home-map-scan:contains('Click To Find')").length > 0) {
				console.log("Scan completed. Looking for missing pokemon.");
				clearInterval(checker);
				checkForMissingPokemon();

				switchLocation(getNextLocation());
			}
		}, 1000);
	}

	function checkForMissingPokemon() {
		var pokemon = $(".leaflet-marker-icon").not(".leaflet-clickable");

		var pokemonNumbers = [];
		for (var i = 0; i < pokemon.length; i++) {
			var number = $(pokemon[i]).attr("src").replace("//ugc.pokevision.com/images/pokemon/", "");
			number = number.replace(".png", "");
			pokemonNumbers.push(parseInt(number));
		}

		var missingPokemonInArea = [];
		for (var i = 0; i < pokemonNumbers.length; i++) {
			if (missingPokemon.indexOf(pokemonNumbers[i]) != -1) {
				missingPokemonInArea.push(pokemonNumbers[i]);
			}
		}
		
		if (missingPokemonInArea.length > 0) {
			console.log("Found "+ missingPokemonInArea.length +" pokemon you're missing:");
			
			for (var i = 0; i < missingPokemonInArea.length; i++) {
				console.log(missingPokemonInArea[i] + ": " + App.home.pokedex[missingPokemonInArea[i]]);
			}
			
			playNotificationSound();
		}
	}

	function playNotificationSound() {
		var soundDiv = document.createElement("div");
		soundDiv.innerHTML = '<audio autoplay="autoplay" preload="auto" src="http://www.skyloft.no/media/pkmn_caught.ogg"></audio>';
	}

	setInterval(function () { clickTheButton(); }, 40000);
	clickTheButton();
})();