import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';


export class TextBox extends GameObject {
	constructor() {
		super({
			position: new Vector2(32, 112)
		});

		this.content = "Hi. How are you? Hi. How are you? Hi. How are you? Hi. How are you? Hi. How are you?";
		this.background = new Sprite({
			resource: resources.images.textBox,
			frameSize: new Vector2(256, 64)
		});
		// this.addChild
	}

	drawImage(ctx, drawPosX, drawPosY) {
		this.background.drawImage(ctx, drawPosX, drawPosY);


		ctx.font = "16px fontRetroGaming";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillStyle = "#fff";

		const MAX_WIDTH = 250;
		const LINE_HEIGHT = 20;
		const PADDING_LEFT = 10;
		const PADDING_TOP = 12;

		let words = this.content.split(" ");
		let line = "";

		for (let n = 0; n < words.length; n ++) {
			let textLine = line + words[n] + " ";
			let metrics = ctx.measureText(textLine);
			let testWidth = metrics.width;

			// If the test line exceeds the maximum width, and it's not the first words...
			if (testWidth > MAX_WIDTH && n > 0) {
				ctx.fillText(line, drawPosX + PADDING_LEFT, drawPosY + PADDING_TOP);		
				line = words[n] + " ";
				drawPosY += LINE_HEIGHT;
			} else {
				line = textLine;
			}

		}

		ctx.fillText(line, drawPosX + PADDING_LEFT, drawPosY + PADDING_TOP);
	}

	ready() {}
}