import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {Rod} from './Rod.js';
import {TextInput} from '../input/TextInput.js';
import {SelectInput} from '../input/SelectInput.js';



export class QuestionRod extends Rod {
	constructor(params = {}) {
		super(params.position.x, params.position.y);
		this.params = params;
	}

	onCollideWithHero() {
		try {
			events.emit(this.params.inputType, this.params.config);
			const submitInputText = events.on("SUBMIT_INPUT_TEXT", this, (text) => {
				if (this.isCorrect(text)) {
					this.answeredCorrectly(text);
				} else {
					this.answeredIncorrectly();
				}
				console.log("Answered with ", text, "This was ", this.isCorrect(text) ? "Correct" : "Incorrect");
			});
		} catch (e) {
			console.error(e);
		}
	}

	isCorrect(text) {
		return this.params.answers?.indexOf(text) > -1;
	}

	answeredCorrectly(text) {
		this.destroy();
		events.emit("HERO_PICKS_UP_ITEM", {
			image: resources.images.rod,
			position: this.position
		});

		let str = "";
		if (this.params.answers.length > 1) {
			str = "Correct! You could've also answered with " + this.params.answers.map((ans) => {
				if (ans === text) return undefined;
				return `'${ans}'`;
			}).filter(ans => ans !== undefined).join(", ");
		} else {
			str = `Exactly! the correct answer was '${text}'`
		}
		events.emit("SHOW_TEXTBOX", {
			portraitFrame: this.portraitFrame,
			string: str,
			addFlags: null,
			onEnd: () => {
				events.emit("HERO_ANSWERED_CORRECTLY", this.params.config.string);
			}
		});
	}

	answeredIncorrectly() {
		let str = "";
		if (this.params.answers.length > 1) {
			str = "Sorry. Try again. The correct answers could've been " + this.params.answers.map((ans) => {
				return `'${ans}'`;
			}).join(", ");
		} else {
			str = `Hmm, no, try again. The correct answer was '${this.params.answers[0]}'`
		}

		events.emit("SHOW_TEXTBOX", {
			portraitFrame: this.portraitFrame,
			string: str,
			addFlags: null,
			onEnd: () => {
				this.destroy();
				events.emit("HERO_ANSWERED_INCORRECTLY", this.params.config.string);
			}
		});
	}
}