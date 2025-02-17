import {Level} from '../objects/level/Level.js';
import {GameObject} from "../GameObject.js";
import {Vector2} from "../Vector2.js";
import {Sprite} from '../Sprite.js';
import {moveTowards} from '../helpers/Move.js';
import {resources} from '../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../helpers/Grid.js'
import {events} from '../Events.js';
import {Hero} from '../objects/hero/Hero.js';
import {Rod} from '../objects/rod/Rod.js';
import {Exit} from '../objects/exit/Exit.js';
import {Npc} from '../objects/npc/Npc.js';
import {OutdoorLevel1} from './OutdoorLevel1.js';
import {TALKED_TO_A, TALKED_TO_B} from '../StoryFlags.js';
import {getCharacterWidth, getCharacterFrame} from '../objects/textbox/spriteFontMap.js';


const DEFAULT_HERO_POSITION = new Vector2(gridCells(3), gridCells(3));

export class AssetLevel extends Level {
	constructor(params={}) {
		super();
		this.params = params;
		this.background = new Sprite({
			resource: resources.images.shopBackground,
			frameSize: new Vector2(320, 180)
		});

		this.buildFloor();

		const exit = new Exit(gridCells(3), gridCells(2));
		this.addChild(exit);

		const heroStart = params.heroPosition ?? DEFAULT_HERO_POSITION;

		const hero = new Hero(heroStart.x, heroStart.y);
		this.addChild(hero);

		this.walls = new Set();
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

	buildFloor() {
		let startingFrame = 0;
		for (let y = 0; y < this.params.sprite.vFrames; y ++) {
			for (let x = 0; x < this.params.sprite.hFrames; x ++) {
				const groundSprite = new Sprite({
					resource: this.params.sprite.resource,
					hFrames: this.params.sprite.hFrames,
					vFrames: this.params.sprite.vFrames,
					frame: startingFrame,
					position: new Vector2(gridCells(x), gridCells(y))
				});
				if (startingFrame % (this.params.sprite.hFrames / 4) === 0) {
					this.addWordSprites(this.generateWords(startingFrame + ""), gridCells(x) - 4, gridCells(y));	
				}

				this.addChild(groundSprite);
				startingFrame += 1;
			}
		}
	}

	addWordSprites(words, x, y) {
			y += 3;	
		words.forEach(word => {

			word.chars.forEach(char => {
				const sprite = char.sprite;
				sprite.position = new Vector2(x, y);
				this.addChild(sprite);
				x += char.width;
			});	
		});
	}

	ready() {
		events.on("HERO_EXIT", this, () => {
			events.emit("CHANGE_LEVEL", this.params.nextLevel);
		});
	}
}