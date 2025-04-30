import {GameObject} from "../GameObject.js";
import {Vector2} from "../Vector2.js";
import {Sprite} from '../Sprite.js';
import {moveTowards} from './Move.js';
import {resources} from '../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from './Grid.js'
import {events} from '../Events.js';
import {getCharacterWidth, getCharacterFrame} from '../objects/textbox/spriteFontMap.js';
import {SUPPORTED_CHARACTERS} from '../objects/textbox/spriteFontMap.js';

export class TextDrawer {

	constructor({
		PADDING_LEFT,
		PADDING_TOP,
		LINE_WIDTH_MAX,
		LINE_VERTICAL_HEIGHT
	}) {
		this.PADDING_LEFT = PADDING_LEFT;
		this.PADDING_TOP = PADDING_TOP;
		this.LINE_WIDTH_MAX = LINE_WIDTH_MAX;
		this.LINE_VERTICAL_HEIGHT = LINE_VERTICAL_HEIGHT;
	}

	setupTypewriter(words) {
		if (typeof words === 'string') {
			words = this.generateWords(words);
		}
		// Tyepwriter
		this.showingIndex = 0;
		this.finalIndex = words.reduce((acc, word) => {
			return acc + word.chars.length
		}, 0);
		this.textSpeed = 40;
		this.timeUntilNextShow = this.textSpeed;
	}

	incrementSelfTypingText(delta) {
		this.timeUntilNextShow -= delta;
		if (this.timeUntilNextShow <= 0) {
			this.showingIndex += 1;
			this.timeUntilNextShow = this.textSpeed;
		}
	}

	getCharacterSprite(char, animations = []) {
		return new Sprite({
			resource: resources.images.fontWhite,
			hFrames: 13,
			vFrames: 6,
			frame: getCharacterFrame(char),
			animations: animations,
			alwaysRender: true
		});
	}

	generateWords(content) {
		return content.split(" ").map(word => {
			// We need to know how wide this word is
			let wordWidth = 0;

			const chars = word.split("").map(char => {
				const sprite = this.getCharacterSprite(char);
				const charWidth = getCharacterWidth(char);
				wordWidth += charWidth;
				return {
					width: charWidth,
					sprite: sprite
				};
			})

			// Return a length and a list of characters to the word.
			return {
				wordWidth,
				chars
			}
		});
	}

	drawWords(ctx, drawPosX, drawPosY, words) {
		// Configuration options
		let cursorX = drawPosX + this.PADDING_LEFT;
		let cursorY = drawPosY + this.PADDING_TOP;
		let currentShowingIndex = 0;

		if (typeof words === 'string') {
			words = this.generateWords(words);
		}

		words.forEach(word => {
			const cursorPosition = this.drawWord(ctx, drawPosX, cursorX, cursorY, currentShowingIndex, word);
			cursorX = cursorPosition.cursorX;
			cursorY = cursorPosition.cursorY;
			currentShowingIndex = cursorPosition.currentShowingIndex;
		});

		return {
			cursorX: cursorX,
			cursorY: cursorY,
			currentShowingIndex: currentShowingIndex
		}
	}

	drawWord(ctx, drawPosX, cursorX, cursorY, currentShowingIndex, word) {
		// Decide if we can fit this next word on this next line
		const spaceRemaining = drawPosX + this.LINE_WIDTH_MAX - cursorX;
		if (spaceRemaining < word.wordWidth) {
			cursorY += this.LINE_VERTICAL_HEIGHT;
			cursorX = drawPosX + this.PADDING_LEFT;
		}

		// Draw this whole segment of text
		word.chars.forEach(char => {
			const cursorPosition = this.drawCharacter(ctx, cursorX, cursorY, currentShowingIndex, char);
			cursorX = cursorPosition.cursorX;
			cursorY = cursorPosition.cursorY;
			currentShowingIndex = cursorPosition.currentShowingIndex;
		});
		// Move the cursor over
		cursorX += 3;

		return {
			cursorX,
			cursorY,
			currentShowingIndex
		};
	}

	drawCharacter(ctx, cursorX, cursorY, currentShowingIndex, char) {
		// Stop here if we should not yet show the following characters
		if (currentShowingIndex > this.showingIndex) {
			return {
				cursorX,
				cursorY,
				currentShowingIndex
			};
		}
		const {sprite, width} = char;

		const withCharOffset = cursorX - 5;
		sprite.draw(ctx, withCharOffset, cursorY);

		// Add width of the character we just printed to the cursor pos
		cursorX += width;

		// plus 1px between character
		cursorX += 1;

		// Uptick
		currentShowingIndex += 1;

		return {
			cursorX,
			cursorY,
			currentShowingIndex
		}
	}
}