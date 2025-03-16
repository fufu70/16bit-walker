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


export class SelectInput extends UserInputBox {
	MAX_VISIBLE_OPTIONS = 7 - 1;

	constructor(config = {}) {
		super(config);

		this.options = config.options ?? ["Default Option"];
		this.options = this.options.sort((a, b) => {
			return a.toUpperCase().localeCompare(b.toUpperCase());
		});
		this.selectedOptionIndex = 0;
		this.triangle = this.typewriter.getCharacterSprite("▶");
		this.stepToNextMove = 100;
		this.lastMove = this.stepToNextMove;

		this.visibleStartIndex = this.getVisibleStartIndex(this.selectedOptionIndex);
		this.visibleEndIndex = this.getVisibleEndIndex(this.selectedOptionIndex);

		// User Text Input
		this.input = new Input(SUPPORTED_CHARACTERS);
	}

	step(delta, root) {
		super.step(delta, root);
		this.moveSelection(delta);
		this.changeVisibleSelection();
		this.updateUserInput();
		this.addTriangle();
	}

	moveSelection(delta) {
		this.lastMove -= delta;
		if (this.lastMove > 0)  {
			return;
		}

		if (this.input.direction === UP) {
			this.selectedOptionIndex --;
			if (this.selectedOptionIndex <= 0) {
				this.selectedOptionIndex = 0;
			}
			this.lastMove = this.stepToNextMove;
		}

		if (this.input.direction === DOWN) {
			this.selectedOptionIndex ++;
			if (this.selectedOptionIndex >= this.options.length - 1) {
				this.selectedOptionIndex = this.options.length - 1;
			}
			this.lastMove = this.stepToNextMove;
		}
	}

	changeVisibleSelection() {
		if (this.selectedOptionIndex > this.visibleEndIndex) {
			this.visibleStartIndex = this.selectedOptionIndex - this.MAX_VISIBLE_OPTIONS;
			this.visibleEndIndex = this.selectedOptionIndex;
		}

		if (this.selectedOptionIndex < this.visibleStartIndex) {
			this.visibleStartIndex = this.selectedOptionIndex;
			this.visibleEndIndex = this.selectedOptionIndex + this.MAX_VISIBLE_OPTIONS;
		}
	}

	updateUserInput() {
		this.userInput = this.options[this.selectedOptionIndex];
	}

	addTriangle() {
		if (this.typewriter.showingIndex >= this.typewriter.finalIndex && !this.hasChild(this.triangle)) {
			this.addChild(this.triangle);
		}
	}

	drawInput(ctx, drawPosX, drawPosY, cursorX, cursorY, currentShowingIndex) {
		this.cursorPosition = 0;
		this.incrementY = 14;
		// const cursorOffset
		const offset = {x: 52, y: 36};
		let triangleY = 0;

		this.options.forEach((option, index) => {
			if (index < this.visibleStartIndex || index > this.visibleEndIndex) {
				return;
			}

			const visibleIndex = this.shiftToVisibleIndex(index, this.visibleStartIndex);

			cursorX = offset.x + 18;
			cursorY = offset.y + (this.incrementY * visibleIndex);
			if (index === this.selectedOptionIndex) {
				triangleY = cursorY;
			}

			this.typewriter.generateWords(option).forEach(word => {
				const cursorPosition = this.typewriter.drawWord(ctx, drawPosX, cursorX, cursorY, currentShowingIndex, word);
				cursorX = cursorPosition.cursorX;
				cursorY = cursorPosition.cursorY;
				currentShowingIndex = cursorPosition.currentShowingIndex;
			});
		});

		if (currentShowingIndex >= this.typewriter.finalIndex) {
			this.drawTriangle(triangleY);
		}
	}

	drawTriangle(y) {
		this.triangle.position = new Vector2(25, y - 32);
	}

	getVisibleStartIndex(selectedOptionIndex) {
		return selectedOptionIndex;
	}

	getVisibleEndIndex(selectedOptionIndex) {
		return selectedOptionIndex + this.MAX_VISIBLE_OPTIONS;
	}

	inRange(index, visibleStartIndex) {
		return Math.abs(index - visibleStartIndex) <= this.MAX_VISIBLE_OPTIONS;
	}

	shiftToVisibleIndex(index, visibleStartIndex) {
		return index - visibleStartIndex;
	}
}
