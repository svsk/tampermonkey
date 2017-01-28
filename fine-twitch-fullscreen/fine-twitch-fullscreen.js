// ==UserScript==
// @name         Fine Twitch Fullscreen
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Do it! Kappa
// @author       Sverre
// @match        https://www.twitch.tv/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

$("#small_more").clone().attr("id", "fine-fullscreen").appendTo("#nav_small");
var svg = $("#fine-fullscreen").find("svg").clone();
$("#fine-fullscreen").find("a").remove();
$("#fine-fullscreen").html('<a href="#" class="filter_icon" id="svg-wrapper"></a>');
$("#svg-wrapper").append(svg);

$("#fine-fullscreen").click(initFineScreen);

                 
function initFineScreen() {
	console.log("initing fine screen");
	hideChat();
	popOutChat();
	hideLeftColumn();
	expandPlayer();
}

function hideChat() {
	if ($("#right_close").attr("class").indexOf("open") != -1) {
		$("#right_close").click();
	}
}

function popOutChat() {
	$("#right_col").show();
	$("#right_col").css("width", "17%");
	$("#right_nav").hide();
	
	$(".ember-chat").css("background", "rgba(0,0,0,0)");
	$("#right_col").css("background", "rgba(0,0,0,0)");
	$(".chat-container").css("background", "rgba(0,0,0,0)");
	
	$(".chat-messages").css("color", "white");
}

function hideLeftColumn() {
	$("#left_col").hide();
	$("#main_col.explandLeft").css("margin-left", "0px");
	$("#main_col").css("margin-left", "0px");
}

function expandPlayer() {	
	$(".editable").hide();
	$("#channel").css("padding", "0px");
	$("#main_col").css("background-color", "black");
	
	$("#video-1").css("height", "1080px");
	$("#video-1").css("width", "1920px");
	
	$(".archive_info").css("margin-top", "235px");
	$(".stats-and-actions").css("margin-top", "300px");
}