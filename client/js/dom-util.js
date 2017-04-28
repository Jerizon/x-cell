// Removes all children from a parent DOM element
const removeChildren = function (parentEl) {
	while(parentEl.firstChild) {
		parentEl.removeChild(parentEl.firstChild);
	}
};

//A helper function that creates functions to add DOM elements of type given
const createEl = function(tagName) {
	return function(text) {
		const el = document.createElement(tagName);
		if (text) {
			el.textContent = text;
		}
		return el;
	};
};

//Creates TR elements
const createTR = createEl('TR');
//Creates TH elements
const createTH = createEl('TH');
//Creates TD elements
const createTD = createEl('TD');

module.exports = {
	createTR: createTR,
	createTH: createTH,
	createTD: createTD,
	removeChildren: removeChildren
}