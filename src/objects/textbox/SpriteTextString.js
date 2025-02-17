import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {getCharacterWidth, getCharacterFrame} from './spriteFontMap.js';


export class SpriteTextString extends GameObject {
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
						frame: getCharacterFrame(char)
					})
				}
			})

			// Return a length and a list of characters to the word.
			return {
				wordWidth,
				chars
			}
		});
		this.background = new Sprite({
			resource: resources.images.textBox,
			frameSize: new Vector2(256, 64)
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


		events.emit("START_TEXT_BOX");
	}

	step(delta, root) {
		const input =  root.input;
		if (input?.getActionJustPressed("Space")) {
			if (this.showingIndex < this.finalIndex) {
				// Skip
				this.showingIndex = this.finalIndex;
				return;
			}

			// Done with the textbox
			events.emit("END_TEXT_BOX");
		}

		this.timeUntilNextShow -= delta;
		if (this.timeUntilNextShow <= 0) {
			this.showingIndex += 1;
			this.timeUntilNextShow = this.textSpeed;
		}
	}

	drawImage(ctx, drawPosX, drawPosY) {
		this.background.drawImage(ctx, drawPosX, drawPosY);

		// Draw the portrait 
		this.portrait.drawImage(ctx, drawPosX + 6, drawPosY + 6);

		// Configuration options
		const PADDING_LEFT = 27;
		const PADDING_TOP = 9;
		const LINE_WIDTH_MAX = 240;
		const LINE_VERTICAL_HEIGHT = 14;

		let cursorX = drawPosX + PADDING_LEFT;
		let cursorY = drawPosY + PADDING_TOP;
		let currentShowingIndex = 0;

		this.words.forEach(word => {
			// Decide if we can fit this next word on this next line
			const spaceRemaining = drawPosX + LINE_WIDTH_MAX - cursorX;
			if (spaceRemaining < word.wordWidth) {
				cursorY += LINE_VERTICAL_HEIGHT;
				cursorX = drawPosX + PADDING_LEFT;
			}

			// Draw this whole segment of text
			word.chars.forEach(char => {
				// Stop here if we should not yet show the following characters
				if (currentShowingIndex > this.showingIndex) {
					return;
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
			});
			// Move the cursor over
			cursorX += 3;
		})
	}
}