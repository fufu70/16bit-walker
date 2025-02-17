
export const LEFT = "LEFT";
export const RIGHT = "RIGHT";
export const UP = "UP";
export const DOWN = "DOWN";


export class Input {
	constructor(SUPPORTED_CHARACTERS = "") {
		this.heldDirections = [];
		this.keys = {};
		this.lastKeys = {};

		this.lastTextKeys = [];

		document.addEventListener("keydown", (e) => {

			if (e.key === 'Escape') {
				e.preventDefault();
			}

			this.keys[e.code] = true;
			if (SUPPORTED_CHARACTERS.indexOf(e.key) > -1) {
				this.lastTextKeys.push(e.key);
			}

			if (e.code === "ArrowLeft" || e.code === "KeyA") {
				this.onArrowPressed(LEFT);
			}
			if (e.code === "ArrowRight" || e.code === "KeyD") {
				this.onArrowPressed(RIGHT);
			}
			if (e.code === "ArrowUp" || e.code === "KeyW") {
				this.onArrowPressed(UP);
			}
			if (e.code === "ArrowDown" || e.code === "KeyS") {
				this.onArrowPressed(DOWN);
			}
		});


		document.addEventListener("keyup", (e) => {
			this.keys[e.code] = false;
			
			if (e.code === "ArrowLeft" || e.code === "KeyA") {
				this.onArrowReleased(LEFT);
			}
			if (e.code === "ArrowRight" || e.code === "KeyD") {
				this.onArrowReleased(RIGHT);
			}
			if (e.code === "ArrowUp" || e.code === "KeyW") {
				this.onArrowReleased(UP);
			}
			if (e.code === "ArrowDown" || e.code === "KeyS") {
				this.onArrowReleased(DOWN);
			}
		});
	}

	get direction() {
		return this.heldDirections[0];
	}

	update() {
		this.lastKeys = {... this.keys};
	}

	clearKeyboardText() {
		this.lastTextKeys = [];
	}

	getKeyboardText() {
		const text = this.lastTextKeys.join("");
		this.clearKeyboardText();
		return text;
	}

	getActionJustPressed(keyCode) {
		let justPressed = false;
		if (this.keys[keyCode] && !this.lastKeys[keyCode]) {
			justPressed = true;
		}
		return justPressed;
	}

	onArrowPressed(direction) {
		if (this.heldDirections.indexOf(direction) === -1) {
			this.heldDirections.unshift(direction);
		}
	}

	onArrowReleased(direction) {

		const index = this.heldDirections.indexOf(direction);

		if (index === -1) {
			return;
		}

		this.heldDirections.splice(index, 1);
	}
}