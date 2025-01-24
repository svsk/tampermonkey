// ==UserScript==
// @name         Produkt Autokjøp Mal
// @namespace    http://tampermonkey.net/
// @version      2025-01-23
// @description  Mal for å sette opp autokjøp av produkter på forskjellige nettsider.
// @author       Sverre S.
// @match        *
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    ////// Configuration starts here //////

    const tryInterval = 10000;
    const buttonParentSelector = '';
    const addToCartEndpoint = '';
    const successRedirectLocation = '';

    /** @param { { label: string } } props */
    const primaryButton = (props) => `<button>${props.label}</button>`;

    /** Add code to this function so that it returns the referrer */
    const resolveRequestReferrer = () => {
        return null;
    };

    /**
     * Add code to this function so that it the body of the "add-to-cart"-request.
     * Should be a JSON string (probably).
     */
    const resolveRequestBody = () => {
        return null;
    };

    /**
     * Add code to this function so that it returns a boolean indicating whether the request was successful.
     * @param {Response} requestResponse */
    const evaluateSuccess = async (requestResponse) => {
        return false;
    };

    ////// Configuration ends here - Don't edit anything below unless you know what you're doing //////

    const createComponent = (html) => {
        const parser = new DOMParser();
        const component = parser.parseFromString(html, 'text/html').body.firstChild;
        return component;
    };

    const buttonTarget = document.querySelector(buttonParentSelector);
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
                        window.location.href = successRedirectLocation;
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
        const response = await fetch(addToCartEndpoint, {
            credentials: 'include',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0',
                Accept: '*/*',
                'Accept-Language': 'en-US,en;q=0.5',
                'Content-Type': 'text/plain;charset=UTF-8',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                Priority: 'u=0',
            },
            referrer: resolveRequestReferrer(),
            body: resolveRequestBody(),
            method: 'POST',
            mode: 'cors',
        });

        return await evaluateSuccess(response);
    }
})();
