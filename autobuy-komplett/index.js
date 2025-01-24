// ==UserScript==
// @name         Komplett Autokjøp
// @namespace    http://tampermonkey.net/
// @version      2025-01-23
// @description  Autokjøp på Komplett.no
// @author       Sverre S.
// @match        https://www.komplett.no/product/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=komplett.no
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const primaryButton = (props) => `
    <button class="btn-large primary full-width">
        <span>${props.label}</span>
    </button>`;

    const createComponent = (html) => {
        const parser = new DOMParser();
        const component = parser.parseFromString(html, 'text/html').body.firstChild;
        return component;
    };

    const buttonTarget = document.querySelector('.actionButton-completeGrid');
    const autoBuyButton = createComponent(primaryButton({ label: 'Autokjøp' }));
    buttonTarget.prepend(autoBuyButton);

    let isAutoBuying = false;
    let autoBuyInterval = null;
    let msUntilNextTry = 0;

    autoBuyButton.addEventListener('click', async () => {
        isAutoBuying = !isAutoBuying;
        setAutoBuy(isAutoBuying);
    });

    function setAutoBuy(isAutoBuying) {
        const tryInterval = 10000;
        const tickDuration = 500;

        msUntilNextTry = 0;

        if (isAutoBuying) {
            autoBuyInterval = setInterval(async () => {
                msUntilNextTry -= tickDuration;
                const remaining = Math.floor(msUntilNextTry / 1000);
                autoBuyButton.innerText = `Prøver igjen om ${remaining}...`;

                if (msUntilNextTry <= 0) {
                    autoBuyButton.innerText = `Prøver!`;
                    const success = await tryBuy();
                    if (success) {
                        autoBuyButton.innerText = `Hurra!`;
                        clearInterval(autoBuyInterval);
                        window.location.href = 'https://www.komplett.no/cart?autocheckout=true';
                    } else {
                        msUntilNextTry = tryInterval;
                    }
                }
            }, tickDuration);
        } else {
            autoBuyButton.innerText = `Autokjøp`;
            clearInterval(autoBuyInterval);
        }
    }

    async function tryBuy() {
        const referrer = window.location.href;
        const productId = window.location.pathname.split('/')[2];

        const response = await fetch('https://www.komplett.no/cart/api/addProductToCartAsync', {
            credentials: 'include',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0',
                Accept: '*/*',
                'Accept-Language': 'en-US,en;q=0.5',
                'Content-Type': 'application/json',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                Priority: 'u=0',
            },
            referrer: referrer,
            body: `{\"productId\":\"${productId}\",\"quantity\":1,\"offerId\":\"KOMPLETT-310-${productId}\",\"configServices\":[]}`,
            method: 'POST',
            mode: 'cors',
        });

        const result = await response.json();
        if (result.success) {
            return true;
        } else {
            return false;
        }
    }
})();
