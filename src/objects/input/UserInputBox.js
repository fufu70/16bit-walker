import {HudGameObject} from "../../HudGameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {getCharacterWidth, getCharacterFrame} from '../textbox/spriteFontMap.js';
import {SUPPORTED_CHARACTERS} from '../textbox/spriteFontMap.js';
import {Typewriter} from '../../helpers/text/Typewriter.js';


export class UserInputBox extends HudGameObject {
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
		this.typewriter = new Typewriter({
			PADDING_LEFT: this.PADDING_LEFT,
			PADDING_TOP: this.PADDING_TOP,
			LINE_WIDTH_MAX: this.LINE_WIDTH_MAX,
			LINE_VERTICAL_HEIGHT: this.LINE_VERTICAL_HEIGHT
		});

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
		this.typewriter.setup(this.content);

		events.emit("START_TEXT_INPUT");

		// User Text Input
		this.input = new Input(SUPPORTED_CHARACTERS);
	}

	step(delta, root) {
		this.handleDecisionInputs();
		this.typewriter.type(delta);
	}

	handleDecisionInputs() {
		if (this.input.getActionJustPressed("Enter")) {
			if (this.typewriter.showingIndex < this.typewriter.finalIndex) {
				// Skip
				this.typewriter.showingIndex = this.typewriter.finalIndex;
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

		let cursorStatus = this.typewriter.drawWords(ctx, drawPosX, drawPosY, this.content);
		this.drawInput(ctx, drawPosX, drawPosY, 
			cursorStatus.cursorX, cursorStatus.cursorY, cursorStatus.currentShowingIndex);
		this.drawFooter(ctx, drawPosX, drawPosY);
	}

	drawInput(ctx, drawPosX, drawPosY, cursorX, cursorY, currentShowingIndex) {
		// do nothing
	}

	drawFooter(ctx, drawPosX, drawPosY) {

		const PADDING_LEFT = 50;
		const PADDING_TOP = 145;
		const LINE_WIDTH_MAX = 240;
		const LINE_VERTICAL_HEIGHT = 14;

		let cursorX = drawPosX + PADDING_LEFT;
		let cursorY = drawPosY + PADDING_TOP;
		let currentShowingIndex = 0;

		const words = this.typewriter.generateWords("ENTER - Decide ⬤ ESC - Cancel");
		
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
