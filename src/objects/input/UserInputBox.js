import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {getCharacterWidth, getCharacterFrame} from '../textbox/spriteFontMap.js';
import {SUPPORTED_CHARACTERS} from '../textbox/spriteFontMap.js';


export class UserInputBox extends GameObject {
	PADDING_LEFT = 27;
	PADDING_TOP = 9;
	LINE_WIDTH_MAX = 240;
	LINE_VERTICAL_HEIGHT = 14;

	constructor(config = {}) {
		super({
			position: new Vector2(32, 32)
		});

		this.drawLayer = "HUD";
		this.userInput = "";

		this.content = config.string ?? "Default text";
		// Create an array of words ()
		this.words = this.generateWords(this.content);

		this.background = new Sprite({
			resource: resources.images.userInputBox,
			frameSize: new Vector2(256, 128)
		});

		// Create a portrait
		this.portrait = new Sprite({
			resource: resources.images.portraits,
			hFrames: 4,
			frame: config?.portraitFrame
		});

		// Tyepwriter
		this.showingIndex = 0;
		this.finalIndex = this.words.reduce((acc, word) => {
			return acc + word.chars.length
		}, 0);
		this.textSpeed = 40;
		this.timeUntilNextShow = this.textSpeed;

		events.emit("START_TEXT_INPUT");

		// User Text Input
		this.input = new Input(SUPPORTED_CHARACTERS);
	}

	getCharacterSprite(char, animations = []) {
		return new Sprite({
			resource: resources.images.fontWhite,
			hFrames: 13,
			vFrames: 6,
			frame: getCharacterFrame(char),
			animations: animations
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

	step(delta, root) {
		this.handleDecisionInputs();
		this.incrementSelfTypingText(delta);
	}

	handleDecisionInputs() {
		if (this.input.getActionJustPressed("Enter")) {
			if (this.showingIndex < this.finalIndex) {
				// Skip
				this.showingIndex = this.finalIndex;
				return;
			}

			// Done with the textbox
			events.emit("DECIDE_INPUT_TEXT", this.userInput);
		}

		if (this.input.getActionJustPressed("Escape")) {
			// Done with the textbox
			events.emit("CANCEL_INPUT_TEXT");
		}
	}

	incrementSelfTypingText(delta) {
		this.timeUntilNextShow -= delta;
		if (this.timeUntilNextShow <= 0) {
			this.showingIndex += 1;
			this.timeUntilNextShow = this.textSpeed;
		}
	}


	drawImage(ctx, drawPosX, drawPosY) {
		// draw a background behind the background
		drawPosY -= 20;
		ctx.beginPath();
		ctx.fillStyle = "rgba(0, 0, 0, 0.70)";
		ctx.rect(0, 0, 320, 180);
		ctx.fill();

		this.background.drawImage(ctx, drawPosX, drawPosY);

		// Draw the portrait 
		this.portrait.drawImage(ctx, drawPosX + 6, drawPosY + 6);

		// Configuration options
		let cursorX = drawPosX + this.PADDING_LEFT;
		let cursorY = drawPosY + this.PADDING_TOP;
		let currentShowingIndex = 0;

		this.words.forEach(word => {
			const cursorPosition = this.drawWord(ctx, drawPosX, cursorX, cursorY, currentShowingIndex, word);
			cursorX = cursorPosition.cursorX;
			cursorY = cursorPosition.cursorY;
			currentShowingIndex = cursorPosition.currentShowingIndex;
		});

		this.drawInput(ctx, drawPosX, drawPosY, cursorX, cursorY, currentShowingIndex);

		this.drawFooter(ctx, drawPosX, drawPosY);
	}

	drawInput(ctx, drawPosX, drawPosY, cursorX, cursorY, currentShowingIndex) {
		// do nothing
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

	drawFooter(ctx, drawPosX, drawPosY) {

		const PADDING_LEFT = 50;
		const PADDING_TOP = 145;
		const LINE_WIDTH_MAX = 240;
		const LINE_VERTICAL_HEIGHT = 14;

		let cursorX = drawPosX + PADDING_LEFT;
		let cursorY = drawPosY + PADDING_TOP;
		let currentShowingIndex = 0;

		const words = this.generateWords("ENTER - Decide ⬤ ESC - Cancel");
		
		words.forEach(word => {
			word.chars.forEach(char => {
				const {sprite, width} = char;

				const withCharOffset = cursorX - 5;
				sprite.draw(ctx, withCharOffset, cursorY);
				cursorX += width;

				// plus 1px between character
				cursorX += 1;

				// Uptick
				currentShowingIndex += 1;
			});
			// Move the cursor over
			cursorX += 3;
		});
	}
}
