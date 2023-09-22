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
                return this;
            },
        };

        return reaction;
    }

    setup() {
        // Select the node that will be observed for mutations
        const targetNode = document.getElementsByTagName('body')[0];

        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => this.evaluateReactions();

        // Create an observer instance linked to the callback function
        this.observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        this.observer.observe(targetNode, config);
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

/*

// Usage:
new ElementReactor()
	.whenExists('.my-element')
	.do(() => console.log('my element exists!'));

// You can also chain multiple reactions:
new ElementReactor()
	.whenExists('.my-element')
		.do(() => console.log('my element exists!'))
	.whenExists('.my-other-element')
		.do(() => console.log('my other element exists!'));

*/
