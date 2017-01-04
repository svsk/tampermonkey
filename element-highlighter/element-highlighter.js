// ==UserScript==
// @name         Element Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlight any DOM element on a website
// @author       Sverre Skuland
// @match        http://www.elkem.com*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    $("h2").bind("click", function (e) {
        window["highlight"](this);
    });

    var overlayDivs = [];

    for (var i = 0; i < 4; i++) {
        var div = document.createElement("div")
        $(div).css("position", "absolute");
        $(div).css("z-index", "100000");
        $(div).css("background", "rgba(0,0,0,0.5)");
        $(div).css("display", "none");
        
        $("body").append(div);
        
        $(div).click(function () { hide(); });
        overlayDivs.push(div);
    }

    function hide() {
        for (var i = 0; i < overlayDivs.length; i++) {
            $(overlayDivs[i]).fadeOut();
        }
    }

    function highlight(element, padding) {
        if (!padding)
            padding = 10;
            
        var pad = padding;
        var br = element.getBoundingClientRect();
        var t = Math.round(br.top) + $(document).scrollTop(),
            l = Math.round(br.left),
            b = Math.round(br.bottom) + $(document).scrollTop(),
            r = Math.round(br.right),
            h = Math.round(br.height),
            w = Math.round(br.width);
        
        var docHeight = $(document).height();
        var docWidth = $(document).width();
        
        //Top pane
        $(overlayDivs[0])
            .css("height", (t - pad) + "px")
            .css("width", (w + (pad * 2)) + "px")
            .css("left", (l - pad) + "px")
            .css("top", "0px")
            .fadeIn();
        
        //Left pane
        $(overlayDivs[1])
            .css("height", docHeight + "px")
            .css("width", (l - pad) + "px")
            .css("left", "0px")
            .css("top", "0px")
            .fadeIn();
        
        //Bottom pane
        $(overlayDivs[2])
            .css("height", (docHeight - b - pad) + "px")
            .css("width", (w + (pad * 2)) + "px")
            .css("left", (l - pad) + "px")
            .css("top", (b + pad) + "px")
            .fadeIn();
        
        //Right pane
        $(overlayDivs[3])
            .css("height", docHeight + "px")
            .css("width", (docWidth - r - pad) + "px")
            .css("left", (r + pad) + "px")
            .css("top", "0px")
            .fadeIn();
    }
})();