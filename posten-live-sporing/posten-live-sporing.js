// ==UserScript==
// @name         Posten Sporing LiveUpdates
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Live tracker for Posten Sporing
// @author       Sverre Skuland
// @match        http*://sporing.posten.no/sporing.html?q=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var originalTitle = document.title;
    var newUpdateTitle = "";
    var updateIntervalTime = 60;
    var timeRemaining = updateIntervalTime;
    var currentLocation = getCurrentLocation();

    var container = document.createElement("div");
    $(container).addClass("box");
    $(container).html("<b>Liveoppdatering (<span class='time-until-update'>"+timeRemaining+"</span>):</b> <span class='location'>"+currentLocation+"</span>");
    $(".sporing-sendingandkolli-main-container").before(container);
    
    var updateInterval = setInterval(function () {
        var location = getCurrentLocation();
        if (location !== currentLocation) {
            $(container).find(".location").html(location);
            $(container).css("background-color", "orange");
            $(container).css("color", "white");
            
            newUpdateTitle = "Ny oppdatering!";
        } else {
            $(container).find(".location").html(location);
        }

        timeRemaining = updateIntervalTime;
    }, updateIntervalTime * 1000);


    var timeUntilUpdateInterval = setInterval(function () {
        timeRemaining--;	
        $(container).find(".time-until-update").html(timeRemaining);
        document.title = getTitle();
    }, 1000);

    function getCurrentLocation() {
        var wrapper = document.createElement("div");
        var result = "";
        
        $(wrapper).html($.ajax({
            url: window.location.href,
            async: false
        }).responseText);
        var currentLocation = $(wrapper).find(".sporing-sendingandkolli-latestevent-date span").html();
        
        if (currentLocation) {
            result = $.trim(currentLocation.replace(/\r?\n|\r/g,''));
        } else if ($(wrapper).find("div:contains(Ingen sending er mottatt)").length > 0) {
            result = "Kun forhåndsmeldt";
        } else if ($(wrapper).find("div:contains(Sendingen er utlevert)").length > 0) {
            result = "Sendingen er utlevert";
            stopChecking();
        }
        
        return result;
    }
    
    function getTitle() {
        return newUpdateTitle + " (" + timeRemaining + ") " + originalTitle;
    }
    
    function stopChecking() {
        clearInterval(timeUntilUpdateInterval);
        clearInterval(updateInterval);
    }
})();
