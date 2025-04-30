import {HudGameObject} from "../../HudGameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {getCharacterWidth, getCharacterFrame} from './spriteFontMap.js';

const FINAL_INDEX_STEP = 200;
// Configuration options
const PADDING_LEFT = 27;
const PADDING_TOP = 6;
const LINE_WIDTH_MAX = 240;
const LINE_VERTICAL_HEIGHT = 14;

export class SpriteTextString extends HudGameObject {

	constructor(config = {}) {
		super({
			position: new Vector2(32, 112)
		});

		this.drawLayer = "HUD";


		this.content = config.string ?? "Default text";
		// Create an array of words ()
		this.words = this.content.split(" ").map(word => {
			// We need to know how wide this word is
			let wordWidth = 0;

			const chars = word.split("").map(char => {
				const charWidth = getCharacterWidth(char);
				wordWidth += charWidth;
				return {
					width: charWidth,
					sprite: new Sprite({
						resource: resources.images.fontWhite,
						hFrames: 13,
						vFrames: 6,
						frame: getCharacterFrame(char),
						alwaysRender: true
					})
				}
			})

			// Return a length and a list of characters to the word.
			return {
				wordWidth,
				chars,
				word
			}
		});
		this.background = new Sprite({
			resource: resources.images.textBox,
			frameSize: new Vector2(256, 64),
			alwaysRender: true
		});

		// Create a portrait
		this.portrait = new Sprite({
			resource: resources.images.portraits,
			hFrames: 2,
			vFrames: 3,
			frame: config?.portraitFrame,
			alwaysRender: true
		});

		// Tyepwriter
		this.showingIndex = 0;
		this.finalIndex = this.words.reduce((acc, word) => {
			return acc + word.chars.length
		}, 0);
		this.currentFinalIndex = this.updateCurrentFinalIndex();
		this.skipIndex = 0;
		this.textSpeed = 40;
		this.timeUntilNextShow = this.textSpeed;

		events.emit("START_TEXT_BOX");
	}

	step(delta, root) {
		try {

			const input =  root.input;
			if (input?.getActionJustPressed("Space")) {

				if (this.showingIndex < this.currentFinalIndex) {
					// Skip
					this.showingIndex = this.currentFinalIndex;
					return;
				}
				if (this.showingIndex < this.finalIndex) {
					// Skip
					this.updateCurrentFinalIndex();
					return;
				}

				// Done with the textbox
				events.emit("END_TEXT_BOX");
			}

			this.timeUntilNextShow -= delta;
			if (this.timeUntilNextShow <= 0) {
				if (this.showingIndex <= this.currentFinalIndex) {
					this.showingIndex += 1;	
					this.timeUntilNextShow = this.textSpeed;
				}
			}	
		} catch(e) {
			console.error(e);
		}
	}

	updateCurrentFinalIndex(amount) {
		if (this.currentFinalIndex === undefined) {
			this.currentFinalIndex = 0;
		}
		if (amount !== undefined) {
			this.currentFinalIndex = amount;	
		}
		if (this.currentFinalIndex < this.finalIndex) {
			this.skipIndex = this.currentFinalIndex;
			this.currentFinalIndex += FINAL_INDEX_STEP;

			if (this.currentFinalIndex >= this.finalIndex) {
				this.currentFinalIndex = this.finalIndex;
			}
		}
		return this.currentFinalIndex;
	}

	drawImage(ctx, drawPosX, drawPosY) {
		this.drawPosX = drawPosX;
		this.drawPosY = drawPosY;
		this.background.drawImage(ctx, drawPosX, drawPosY);

		// Draw the portrait 
		this.portrait.drawImage(ctx, drawPosX + 6, drawPosY + 6);


		this.cursorX = drawPosX + PADDING_LEFT;
		this.cursorY = drawPosY + PADDING_TOP;
		const wordsConfig = this.getWordsConfig(
			this.skipIndex,
			this.currentFinalIndex,
			this.cursorX,
			drawPosX,
			drawPosY
		);
		let currentShowingIndex = wordsConfig.startIndex;
		this.currentFinalIndex = wordsConfig.endIndex;


		wordsConfig.words.forEach(word => {
			// Decide if we can fit this next word on this next line
			const spaceRemaining = drawPosX + LINE_WIDTH_MAX - this.cursorX;
			if (spaceRemaining < word.wordWidth) {
				this.cursorY += LINE_VERTICAL_HEIGHT;
				this.cursorX = drawPosX + PADDING_LEFT;
			}
			// Draw this whole segment of text
			word.chars.forEach(char => {
				// Stop here if we should not yet show the following characters
				if (currentShowingIndex > this.showingIndex) {
					return;
				}
				const {sprite, width} = char;

				const withCharOffset = this.cursorX - 5;
				sprite.draw(ctx, withCharOffset, this.cursorY);

				// Add width of the character we just printed to the cursor pos
				this.cursorX += width;

				// plus 1px between character
				this.cursorX += 1;

				// Uptick
				currentShowingIndex += 1;
			});
			// Move the cursor over
			this.cursorX += 3;
		})
	}


	cache = new Map();


	getWordsConfig(startIndex, endIndex, cursorX, drawPosX, drawPosY) {
		let currentIndex = 0;
		let cursorY = drawPosY + PADDING_TOP;

		if (this.cache.has(startIndex)) {
			return this.cache.get(startIndex);
		}

		const words = this.words.map(word => {
			// Decide if we can fit this next word on this next line
			const spaceRemaining = drawPosX + LINE_WIDTH_MAX - cursorX;
			if (spaceRemaining < word.wordWidth) {
				cursorY += LINE_VERTICAL_HEIGHT;
				cursorX = drawPosX + PADDING_LEFT;
			}

			if (currentIndex >= endIndex) {
				return;
			}

			if (cursorY >= (drawPosY + (LINE_VERTICAL_HEIGHT * 4))) {
				endIndex = currentIndex;
				return;
			}
			
			word.chars.forEach(char => {
				if (currentIndex >= startIndex - 1) {
					const {sprite, width} = char;
					// Add width of the character we just printed to the cursor pos
					cursorX += width;
					// plus 1px between character
					cursorX += 1;
				}

				// Uptick
				currentIndex += 1;
			});

			if (currentIndex <= endIndex && currentIndex >= startIndex) {
				cursorX += 3;
				return word;
			}
		}).filter(word => word !== undefined);
		// console.log(words.map(a => a.word).join(" "), startIndex, currentIndex, cursorY, (drawPosY + (LINE_VERTICAL_HEIGHT * 4)));
		const obj = {
			words,
			startIndex: startIndex,
			endIndex: currentIndex + 1,
		};
		this.cache.set(startIndex, obj);
		return obj;
	}
}