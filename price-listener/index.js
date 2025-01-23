// ==UserScript==
// @name         PriceListener
// @namespace    http://tampermonkey.net/
// @version      2024-11-28
// @description  Listen for and report price updates.
// @author       Sverre Skuland
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require      https://gist.githubusercontent.com/svsk/6eb09c0920504caf323547bafea3108f/raw/5c66d1cd23a5d538a5c7140fc9a44f26e3992f0e/elementReactor.js
// @grant        none
// ==/UserScript==

class PageConfig {
    /**
     * @param {string} productDescription
     * @param {string} priceElementSelector
     */
    constructor(productDescription, priceElementSelector) {
        this.productDescription = productDescription;
        this.priceElementSelector = priceElementSelector;
    }
}

(function () {
    'use strict';

    const configKey = `PriceListener_Config:${window.location.pathname}`;

    setup();

    async function setup() {
        // If there's not a query string containing "pcref=1", we don't want to run the script.
        if (!window.location.search.includes('pcref=1')) {
            return;
        }

        console.log('=== PriceListener is active! ===');

        // We need to define this on a per page basis, and we need some nice UI to pick the element.
        // Only continue execution if we have a config set up.
        let config = getConfiguration();
        if (!config) {
            config = await configure();
            if (!config) {
                return;
            }
        }

        const { priceElementSelector } = config;

        new ElementReactor().whenExists(priceElementSelector).do(async () => {
            const el = document.querySelectorAll(priceElementSelector)[0];
            const priceText = el.textContent;
            const numericPrice = parseFloat(priceText.replace(/[^0-9.-]+/g, ''));
            console.log('Price is', numericPrice);
            if (await reportPrice(numericPrice, config.productDescription)) {
                setTimeout(() => window.location.reload(), 5000);
            }
        });
    }

    async function reportPrice(price, productDescription) {
        const body = {
            ProductDescription: productDescription,
            Price: price,
            Source: window.location.href.replace('?pcref=1', '').replace('&pcref=1', ''),
        };

        // Get from .env
        const targetUri = '';

        // post body to the uri
        const response = await fetch(targetUri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            console.log('Price reported successfully');
            return true;
        } else {
            console.error('Failed to report price', await response.text());
            return false;
        }
    }

    /**
     * @returns {PageConfig}
     */
    async function configure() {
        console.info('No config found. Setting up configuration.');

        // Make it so that when the user hovers over a dom element, it is outlined with a red border.
        // Upon clicking the element, we should generate a css selector for it.
        // The user should then be able to type in a description for the product.
        console.clear();
        console.log('Configuring');

        const selectedElement = await promptElementPick();

        // Create a css selector for the element
        const selector = generateCssSelector(selectedElement);

        const productDescription = prompt('Enter a description for the product');

        const config = new PageConfig(productDescription, selector);
        localStorage.setItem(configKey, JSON.stringify(config));

        return config;
    }

    function generateCssSelector(el) {
        // Create a css selector based on id, class, data attributes, and tag name.
        const id = el.id ? `#${el.id}` : '';
        const classes = el.classList.length ? `.${Array.from(el.classList).join('.')}` : '';
        const dataAttributes = Array.from(el.attributes)
            .filter((attr) => attr.name.startsWith('data-'))
            .map((attr) => `[${attr.name}="${attr.value}"]`)
            .join('');

        return `${el.tagName.toLowerCase()}${id}${classes}${dataAttributes}`;
    }

    function promptElementPick() {
        let elementPickedCallback = null;
        let watchedElements = [];

        function setupHoverStyle() {
            // Check if it has been setup already
            if (document.querySelector('style[data-id="PriceListenerHoverStyle"]')) {
                return;
            }

            const style = document.createElement('style');

            style.dataset.id = 'PriceListenerHoverStyle';

            style.innerHTML = `
                .pc_hovered {
                    outline: 1px solid red;
                }
            `;

            document.head.appendChild(style);
        }

        function clearWatchedElements() {
            watchedElements.forEach((el) => {
                el.removeEventListener('click', handleClickElement);
                el.classList.remove('pc_hovered');
            });

            watchedElements = [];
        }

        function handleClickElement(e) {
            clearWatchedElements();
            document.removeEventListener('mouseover', handleMouseoverElement);
            elementPickedCallback(e.target);
        }

        function handleMouseoverElement(e) {
            clearWatchedElements();
            e.target.addEventListener('click', handleClickElement);
            e.target.classList.add('pc_hovered');
            watchedElements.push(e.target);
        }

        const promise = new Promise((resolve) => {
            elementPickedCallback = resolve;
        });

        setupHoverStyle();
        document.addEventListener('mouseover', handleMouseoverElement);

        return promise;
    }

    /**
     * @returns {PageConfig}
     */
    function getConfiguration() {
        const configString = localStorage.getItem(configKey);

        if (!configString) {
            return null;
        }

        return JSON.parse(configString);
    }
})();
