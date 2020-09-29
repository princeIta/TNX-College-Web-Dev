class ScreenManager {
	constructor(rootContElOrId) {
		this._init(rootContElOrId);
	}

	_init(rootContElOrId) {
		this._setContainer(rootContElOrId);
		this._initScreens();
	}

	_setContainer(rootContElOrId) {
		if (isElement(rootContElOrId)) {
			this._screensRootContainer = rootContElOrId;
		} else {
			this._screensRootContainer = document.getElementById(rootContElOrId);
		}
	}

	_initScreens() {
		const screens = this._getAllScreens();

		for (let screen of screens) {
			this._injectClassesIntoElement(screen, [
				this._screenHidden,
				this._screenRemoved,
			]);
			this._createPropertyFromId(screen);
		}
	}

	_getAllScreens() {
		if (this._screensRootContainer) {
			return this._screensRootContainer.querySelectorAll(".screen");
		}
		return document.querySelectorAll(".screen");
	}

	_injectClassesIntoElement(element, classList = []) {
		if (isElement(element)) {
			element.classList.add(...classList);
		}
	}

	_removeClassesFromElement(element, classList = []) {
		if (isElement(element)) {
			element.classList.remove(...classList);
		}
	}

	_createPropertyFromId(screen) {
		if (isElement(screen)) {
			const screenId = screen.id;

			if (screenId) {
				const idNameInPascalCase = castTextToPascalCase(screenId);
				const methodName = `display${idNameInPascalCase}`;

				injectPropertyIntoObject(this, methodName, {
					writable: false,
					value: this._displayScreen.bind(this, screen),
				});

				injectPropertyIntoObject(this, idNameInPascalCase, {
					writable: false,
					value: screen,
				});

				this._mapIdToScreenObj(screenId, {
					name: idNameInPascalCase,
					id: screenId,
					screen,
				});
			}
		}
	}

	_mapIdToScreenObj(screenId, screenObj) {
		this._elemIdToScreenObjMap[screenId] = screenObj;
	}

	_hideScreen(screen) {
		this._injectClassesIntoElement(screen, [
			this._screenHidden,
			this._screenRemoved,
		]);
		this._dispatchEvent("screen-left", screen);
	}

	_showScreen(screen) {
		this._removeClassesFromElement(screen, [this._screenRemoved]);

		let t;
		t = setTimeout(() => {
			this._removeClassesFromElement(screen, [this._screenHidden]);
			clearTimeout(t);
			this._dispatchEvent("screen-entered", screen);
		}, 50);
	}

	_hideCurrentScreen() {
		const currentScreenObj = this._currentScreenObj;
		if (currentScreenObj && currentScreenObj.element) {
			this._hideScreen(currentScreenObj.element);
		}
	}

	_setCurrentScreen(screen) {
		if (isElement(screen)) {
			this._currentScreenObj.id = screen.id;
			this._currentScreenObj.element = screen;
		}
	}

	_dispatchEvent(eventName, elem) {
		if (isElement(elem)) {
			const eventDetail = {screen:{ ...this._elemIdToScreenObjMap[elem.id]} };

			const eventObj = new CustomEvent(eventName, {
				detail: eventDetail,
			});

			elem.dispatchEvent(eventObj);

			if (this._eventListeners[eventName]) {
				const handlers = this._eventListeners[eventName];
				for (let handler of handlers) {
					handler({
						detail: eventDetail,
					});
				}
			}
		}
	}

	_displayScreen(screen) {
		this._hideCurrentScreen();
		this._showScreen(screen);
		this._setCurrentScreen(screen);
	}

	getScreen(screenId) {
		const screenObject = this._elemIdToScreenObjMap;
		if (screenObject[screenId]) {
			return screenObject[screenId].screen;
		}
		return null;
	}

	getCurrentScreen() {
		return this._currentScreenObj.element;
	}

	registerListeners(event, handler) {
		if (event) {
			if (this._eventListeners[event]) {
				this._eventListeners[event].push(handler);
			} else {
				this._eventListeners[event] = [handler];
			}
		}
	}

	displayScreenById(screenId) {
		const foundScreen = this.getScreen(screenId);
		if (foundScreen) {
			this._displayScreen(foundScreen);
		}
	}

	screenExists(screenId) {
		if (this._elemIdToScreenObjMap[screenId]) {
			return true;
		}
		return false;
	}

	_eventListeners = {};
	_screenHidden = "screen--hidden";
	_screenRemoved = "screen--removed";
	_currentScreenObj = { id: null, element: null };
	_elemIdToScreenObjMap = {};
	_screensRootContainer = null;
}
