// ==UserScript==
// @name         Remove Facebook Overlay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically remove the overlay that Facebook puts in your face to try and make you sign up.
// @author       Sverre
// @match        https://www.facebook.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    //These look pseudo-random so Facebook might change them once in a while to break scripts like this.
    //Modify as needed.
    var overlayClassName = "_5hn6";
    var overlayBackgroundProperty = "rgba(0, 0, 0, 0.498039)";

    var interval = setInterval(function () {
        var overlay = document.querySelectorAll("." + overlayClassName)[0];
    
        if (overlay && overlay.style.backgroundColor === overlayBackgroundProperty) {    
            console.log("Removed the sign up overlay");
            clearInterval(interval);
        }
    }, 50);
}());
