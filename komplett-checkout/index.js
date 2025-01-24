// ==UserScript==
// @name         Komplett Checkout
// @namespace    http://tampermonkey.net/
// @version      2025-01-23
// @description  try to take over the world!
// @author       Sverre S.
// @match        https://www.komplett.no/cart*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=komplett.no
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // check if query parameter autocheckout is set
    const urlParams = new URLSearchParams(window.location.search);
    const autoCheckout = urlParams.get('autocheckout');
    if (!!autoCheckout) {
        const checkoutButton = document.querySelector('[data-testid="submit.button.checkout"]');
        console.log('Tried to find button', checkoutButton);
        checkoutButton.click();
    }

    // WalleyInvoice-trigger.radioButton
})();
