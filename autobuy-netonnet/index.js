// ==UserScript==
// @name         Autokjøp NetOnNet
// @namespace    http://tampermonkey.net/
// @version      2025-01-24
// @description  try to take over the world!
// @author       You
// @match        https://www.netonnet.no/art/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netonnet.no
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    ////// Configuration starts here //////

    const tryInterval = 10000;
    const buttonParentSelector = '#productPurchaseBoxContainer';
    const addToCartEndpoint = 'https://www.netonnet.no/Checkout/AddItem/';
    const successRedirectLocation = 'https://www.netonnet.no/checkout';
    const contentType = 'application/x-www-form-urlencoded; charset=UTF-8' || 'application/json';

    /** @param { { label: string } } props */
    const primaryButton = (props) => `
		<button type="button" class="btn btn-primary btn-block btn-lg font-size-15" style="margin-bottom: 10px">
			${props.label}
		</button>`;

    /** Add code to this function so that it returns the referrer */
    const resolveRequestReferrer = () => {
        return window.location.href;
    };

    /**
     * Add code to this function so that it the body of the "add-to-cart"-request.
     * Should be a JSON string (probably).
     */
    const resolveRequestBody = () => {
        const productId = window.location.pathname.split('/').at(-2).split('.')[0];
        return `itemId=${productId}&isCheckout=false&confirmTradeInItems=False`;
    };

    /**
     * Add code to this function so that it returns a boolean indicating whether the request was successful.
     * @param {Response} requestResponse */
    const evaluateSuccess = async (requestResponse) => {
        try {
            const text = await requestResponse.text();

            const domParser = new DOMParser();
            const returnedDom = domParser.parseFromString(text, 'text/html');
            const cartSummaryContent = returnedDom.body.querySelector('.cartSummaryTotalPrice').innerText;

            const failed = cartSummaryContent.includes(' 0,–');
            return !failed;
        } catch (err) {
            console.error(err);
            return false;
        }
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
        toggleAutoBuyInterval(isAutoBuying);
    });

    function toggleAutoBuyInterval(isAutoBuying) {
        clearInterval(autoBuyInterval);

        if (isAutoBuying) {
            const tickDuration = 500;
            msUntilNextTry = 0;

            let trying = false;
            autoBuyInterval = setInterval(async () => {
                msUntilNextTry -= tickDuration;
                if (trying) {
                    return;
                }

                try {
                    if (msUntilNextTry <= 0) {
                        trying = true;
                        autoBuyButton.innerText = `Prøver!`;
                        await executeBuyAttempt();
                        msUntilNextTry = tryInterval;
                    } else {
                        const remaining = Math.floor(msUntilNextTry / 1000);
                        autoBuyButton.innerText = `Prøver igjen om ${remaining}...`;
                    }
                } finally {
                    trying = false;
                }
            }, tickDuration);
        } else {
            autoBuyButton.innerText = `Autokjøp`;
        }
    }

    async function executeBuyAttempt() {
        const success = await tryBuy();

        if (success) {
            clearInterval(autoBuyInterval);
            autoBuyButton.innerText = `Hurra!`;
            window.location.href = successRedirectLocation;
        }
    }

    async function tryBuy() {
        const response = await fetch(addToCartEndpoint, {
            credentials: 'include',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0',
                Accept: '*/*',
                'Accept-Language': 'en-US,en;q=0.5',
                // 'Content-Type': 'text/plain;charset=UTF-8', <-- maybe this??
                'Content-Type': contentType,
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
