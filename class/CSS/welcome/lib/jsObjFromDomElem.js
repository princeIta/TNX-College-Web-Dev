class JsObjectFromDomElement {
	constructor(containerElemOrId) {
		if (isElement(containerElemOrId)) {
			this.container = containerElemOrId;
		} else {
			const el = document.getElementById(containerElemOrId);
			if (el) {
				this.container = el;
			}
		}
		this.proc();
	}

	proc() {
		const elemsWithIdAttr = this.querySelectorAllInContainer(
			this.container,
			"[id]"
		);

		this.mapDOMElemsToObj(elemsWithIdAttr);
	}

	querySelectorAllInContainer(container, selector) {
		if (isElement(container)) {
			return container.querySelectorAll(selector);
		}
	}

	mapDOMElemsToObj(domElems) {
		for (let elem of domElems) {
			if (isElement(elem)) {
				const elemId = elem.id;
				if (elemId) {
					const idNameInCamelCase = castTextToCamelCase(elemId);
					const propertyName = idNameInCamelCase;

					injectPropertyIntoObject(this.object, propertyName, {
						writable: false,
						value: elem,
					});
				}
			}
		}
	}

	getObject() {
		return this.object;
	}

	object = {};
}
