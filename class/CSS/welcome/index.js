const screenManager = new ScreenManager("main");

screenManager.displayHomeScreen();
screenManager.registerListeners("screen-entered", screenChangedHandler);
screenManager.registerListeners("screen-left", screenChangedHandler);

const startButton = document.getElementById("start-button");
startButton.onclick = displaySyntaxPage;

const nav = document.querySelector(".nav");
const navObj = new JsObjectFromDomElement(nav).getObject();

navObj.navStartButton.onclick = navButtonClicked;
navObj.navSyntaxButton.onclick = navButtonClicked;
navObj.navApplyStylesButton.onclick = navButtonClicked;

function displaySyntaxPage(e) {
	e.preventDefault();
	screenManager.displaySyntaxScreen();
}

function navButtonClicked(e) {
	e.preventDefault();
	const btn = e.target;
	const nextScreenId = btn.getAttribute("screen");

	const currentScreenId = screenManager.getCurrentScreen().id;

	if (!(currentScreenId === nextScreenId)) {
		if (screenManager.screenExists(nextScreenId)) {
			screenManager.displayScreenById(nextScreenId);

			setNavButtonActive(nextScreenId);
		}
	}
}

function screenChangedHandler(e) {
	setNavButtonActive(e.detail.screen.id);
}

function setNavButtonActive(navButtonId) {
	const activeNavButton = document.querySelector(
		".js-nav__button.nav__button--active"
	);
	if (activeNavButton) {
		activeNavButton.classList.remove("nav__button--active");
	}

	const clickedNavButton = document.querySelector(
		`[screen='${navButtonId}']`
	);
	if (clickedNavButton) {
		clickedNavButton.classList.add("nav__button--active");
	}
}
