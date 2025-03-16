import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {getCharacterWidth, getCharacterFrame} from '../textbox/spriteFontMap.js';
import {getCharacterAnimations} from './Animations.js';
import {SUPPORTED_CHARACTERS} from '../textbox/spriteFontMap.js';
import {UserInputBox} from './UserInputBox.js';


export class TextInput extends UserInputBox {

	constructor(config = {}) {
		super(config);

		this.cursor = this.typewriter.getCharacterSprite("|", getCharacterAnimations("|"));
		this.cursor.animations.play("BLINKING");
		this.addChild(this.cursor);

		this.stepToNextMove = 100;
		this.lastMove = this.stepToNextMove;

		// User Text Input
		this.input = new Input(SUPPORTED_CHARACTERS);
	}

	step(delta, root) {
		super.step(delta, root);
		this.handleTyping(delta);
	}

	handleTyping(delta) {
		if (this.input !== undefined) {
			if (this.showingIndex < this.finalIndex) {
				this.input.clearKeyboardText();
			} else {
				this.userInput += this.input.getKeyboardText();	
			}
		}

		this.lastMove -= delta;
		if (this.lastMove > 0)  {
			return;
		}

		if (this.input.getActionJustPressed("Backspace")) {
			const a = this.userInput.split("");
			a.splice(-1);
			this.userInput = a.join("");

			this.lastMove = this.stepToNextMove;
		}
	}

	drawInput(ctx, drawPosX, drawPosY, cursorX, cursorY, currentShowingIndex) {
		cursorX = 59;
		cursorY += 16;

		this.typewriter.generateWords(this.userInput).forEach(word => {
			const cursorPosition = this.typewriter.drawWord(ctx, drawPosX, cursorX, cursorY, currentShowingIndex, word);
			cursorX = cursorPosition.cursorX;
			cursorY = cursorPosition.cursorY;
			currentShowingIndex = cursorPosition.currentShowingIndex;
		});

		this.drawCursor(ctx, drawPosX, cursorX, cursorY);
	}

	drawCursor(ctx, drawPosX, cursorX, cursorY) {
		const offset = {x: 32, y: 32};
		const withCharOffset = cursorX - 5 - offset.x;
		this.cursor.position = new Vector2(withCharOffset, cursorY - offset.y);
	}
}
