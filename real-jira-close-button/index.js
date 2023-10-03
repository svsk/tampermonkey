// ==UserScript==
// @name         Real Jira Close Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @updateURL	 https://raw.githubusercontent.com/svsk/tampermonkey/master/real-jira-close-button/index.js
// @downloadURL  https://raw.githubusercontent.com/svsk/tampermonkey/master/real-jira-close-button/index.js
// @description  Adds a real close button to Jira modals
// @author       Sverre Skuland
// @match        https://*.atlassian.net/jira/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// ==/UserScript==

// Use common ElementReactor class
class ElementReactor {
    reactions = [];
    observer = null;

    constructor() {
        this.setup();
    }

    whenExists(selector) {
        const reaction = {
            selector,
            active: false,
            do: (callback) => {
                reaction.callback = callback;
                this.reactions.push(reaction);
            },
        };

        return reaction;
    }

    setup() {
        const rootNode = document.getElementsByTagName('body')[0];
        const config = { attributes: true, childList: true, subtree: true };
        const callback = (mutationList, observer) => this.evaluateReactions();
        this.observer = new MutationObserver(callback);
        this.observer.observe(rootNode, config);
    }

    evaluateReactions() {
        this.reactions.forEach((reaction) => {
            const elementExists = !!document.querySelectorAll(reaction.selector).length;

            if (elementExists && !reaction.active) {
                reaction.active = true;
                reaction.callback();
            } else if (!elementExists && reaction.active) {
                reaction.active = false;
            }
        });
    }
}

(function () {
    'use strict';

    const setupCloseButton = () => {
        const currentLocationParams = new URLSearchParams(window.location.search);
        const assigneeId = currentLocationParams.get('assignee');
        const assigneeQuery = assigneeId ? `?assignee=${assigneeId}` : '';
        const baseLocation = `${window.location.origin}${window.location.pathname}`;

        const newButton = document.createElement('button');
        newButton.innerHTML = 'Close';

        newButton.onclick = () => {
            window.location.href = `${baseLocation}${assigneeQuery}`;
        };

        const closeButton = document.querySelectorAll("[aria-label='Close']")[0];
        closeButton.insertAdjacentElement('beforeBegin', newButton);
    };

    new ElementReactor().whenExists('#jira-issue-header').do(setupCloseButton);
})();
