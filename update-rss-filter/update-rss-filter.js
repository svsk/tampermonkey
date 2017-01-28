// ==UserScript==
// @name         Update RSS Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://alarice.seedboxes.cc/*/rutorrent/
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

function promptForJson() {	
	var showsJson = prompt("Enter shows JSON");
	
	if (showsJson == null || showsJson.length == 0) {
		return;
	}

	theWebUI.showRSS();

	var shows = JSON.parse(showsJson);
	
	setTimeout(function () { updateFilters(shows); }, 500);
}

function updateFilters(shows) {
	var rootPath = "/home/disk11/veinlash/torrents/downloads";	
	var excludePattern = "/(720|1080|HebSub|Spanish)/i";
	
	for (var i = 0; i < shows.length; i++) {
		var season = shows[i].currentSeason < 10 ? "0" + shows[i].currentSeason : shows[i].currentSeason;		
		var filter = "/^" + shows[i].title.replace(/ /g, '.*') + ".*S" + season + "E.*/i";
		var directory = shows[i].title.indexOf("The") == 0 ? shows[i].title.replace("The ", "") + ", The" : shows[i].title;
		var folderStructure = "/Series/"+directory+"/Season";
		
		var existingFilter = $("#fltlist li input[type=text]").filter(function () { return this.value == shows[i].title; });
		
		if (existingFilter.length == 0) {
			theWebUI.addNewFilter();
		} else {
			theWebUI.selectFilter(existingFilter[0]);
		}
		
		$("#fltlist").find(".TextboxFocus").val(shows[i].title);
		$("#FLT_body").val(filter);
		$("#FLT_exclude").val(excludePattern);
		$("#FLTdir_edit").val(rootPath + folderStructure + shows[i].currentSeason);
		$("#FLT_ratio").val("rat_0")
	}
}

var initInterval = setInterval(function () {
	if ($("#mnu_rss").length != 0) {
		$("#mnu_rss").clone().attr("title", "Import RSS Filter").appendTo("#t").find("div").attr("onclick", "").click(function() { promptForJson(); });
		clearInterval(initInterval);
	}
}, 200);