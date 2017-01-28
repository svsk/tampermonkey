// ==UserScript==
// @name         FillRegistrationFields-PTC
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://club.pokemon.com/us/pokemon-trainer-club*sign-up*
// @match		 https://club.pokemon.com/us/pokemon-trainer-club/forgot-password?msg=users.email.exists
// @grant        none
// ==/UserScript==

if (window.location.href == "https://club.pokemon.com/us/pokemon-trainer-club/forgot-password?msg=users.email.exists") {
	window.location.href = "https://sso.pokemon.com/sso/login";
}


(function() {
    'use strict';
	console.log("loaded PTC field filler");
	var username = "default";
	var password = "lolcake";
	
	function setFormData() {
		$("#id_username").val(username);
		$("#id_screen_name").val(username);
		$("#id_password").val(password);
		$("#id_confirm_password").val(password);
		$("#id_email").val("deesmizzle48+"+username+"@gmail.com");
		$("#id_confirm_email").val("deesmizzle48+"+username+"@gmail.com");
		$('#id_terms').prop('checked', true);
		
		$("body").scrollTop($(document).height());
	}
	
	function setBirthDate() {
		$(".datepicker").val("1980-01-27");
	}
	
	if (window.location.href.indexOf("parents") != -1) {
		username = prompt("Enter username");
		setInterval(setFormData, 1000);
	} else {
		setInterval(setBirthDate, 1000);
	}
    
	
})();