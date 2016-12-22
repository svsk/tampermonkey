// ==UserScript==
// @name         Posten Sporing LiveUpdates
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Live tracker for Posten Sporing
// @author       Sverre Skuland
// @match        http://sporing.posten.no/sporing.html?q=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var originalTitle = document.title;
    var newUpdateTitle = "";
    var updateIntervalTime = 10;
    var timeRemaining = updateIntervalTime;
    var currentCity = getCurrentCity();

    var container = document.createElement("div");
    $(container).addClass("box");
    $(container).html("<b>Liveoppdatering (<span class='time-until-update'>"+timeRemaining+"</span>):</b> <span class='city'>"+currentCity+"</span>");
    $(".sporing-sendingandkolli-main-container").before(container);
    
    var updateInterval = setInterval(function () {
        var city = getCurrentCity();
        if (city !== currentCity) {
            $(container).find(".city").html(city);
            $(container).css("background-color", "orange");
            $(container).css("color", "white");
            
            newUpdateTitle = "Ny oppdatering!";
        } else {
            $(container).find(".city").html(city);
        }

        timeRemaining = updateIntervalTime;
    }, updateIntervalTime * 1000);


    var timeUntilUpdateInterval = setInterval(function () {
        timeRemaining--;	
        $(container).find(".time-until-update").html(timeRemaining);
        document.title = getTitle();
    }, 1000);

    function getCurrentCity() {
        var wrapper = document.createElement("div");
        $(wrapper).html($.ajax({
            url: window.location.href,
            async: false
        }).responseText);
        var currentCity = $(wrapper).find(".sporing-sendingandkolli-latestevent-date span").html();
        return $.trim(currentCity.replace(/\r?\n|\r/g,''))
    }
    
    function getTitle() {
        return newUpdateTitle + " (" + timeRemaining + ") " + originalTitle;
    }
})();