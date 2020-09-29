function isElement(element) {
	return element instanceof Element || element instanceof HTMLDocument;
}

function spiltStrAtSeparators(str = "", sep) {
	if (str) {
		return str.split(
			sep ? (typeof sep === "string" ? RegExp(sep) : sep) : /_|-|\s+/
		);
	}
	return null;
}

function castTextToPascalCase(str = "") {
	let pascalCasedWord = "";
	const wordsList = spiltStrAtSeparators(str);
	for (let word of wordsList) {
		pascalCasedWord += capitalize(word);
	}

	return pascalCasedWord;
}

function castTextToCamelCase(str = "") {
	const wordsList = spiltStrAtSeparators(str);
	const firstWord = wordsList[0];
	const otherWordsInList = wordsList.slice(1);

	let camelCasedWord = ("" + firstWord).toLowerCase();
	for (let word of otherWordsInList) {
		camelCasedWord += capitalize(word);
	}

	return camelCasedWord;
}

function capitalize(str = "") {
	return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

function injectPropertyIntoObject(
	obj,
	propName,
	descriptor = { writable: false, configurable: false }
) {
	Object.defineProperty(obj, propName, descriptor);
}
