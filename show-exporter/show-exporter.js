// ==UserScript==
// @name         Export Pogdesign Shows
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.pogdesign.co.uk/cat/showselect.php
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var shows = [];
var showContainers = $(".checkedletter")

for (var i = 0; i < showContainers.length; i++) {
	var show = showContainers[i];

	var showData = $.ajax({
		url:"http://www.pogdesign.co.uk/cat/" + $(show).find("a").attr("href").replace("./", ""),
		async: false
	}).responseText;

	var domNode = document.createElement("div");
	domNode.innerHTML = showData;

	var show = {
		title: $(domNode).find("span[itemprop=name]").html(),
  	currentSeason: parseInt($(domNode).find(".epuntil")[0].innerHTML.split(" ")[0].replace("S", ""))
	};

	shows.push(show);
}

console.log(JSON.stringify(shows));