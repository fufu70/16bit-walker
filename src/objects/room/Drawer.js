import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'

export const LIGHT_BROWN_FULL = 'LIGHT_BROWN_FULL';
export const LIGHT_BROWN_MID = 'LIGHT_BROWN_MID';
export const BROWN_MID = 'BROWN_MID';

export const DRAWER_STYLES = [
	LIGHT_BROWN_FULL,
	LIGHT_BROWN_MID,
	BROWN_MID,
]

const DRAWER = {};
DRAWER[LIGHT_BROWN_FULL] = 0;
DRAWER[LIGHT_BROWN_MID] = 1;
DRAWER[BROWN_MID] = 2;

export class Drawer extends GameObject {
	constructor(x, y, style = LIGHT_BROWN_FULL, seed = undefined) {
		super({
			position: new Vector2(x, y)
		});

		if (seed !== undefined) {
			style = DRAWER_STYLES[Math.floor(seed() * DRAWER_STYLES.length)];
		}

		this.addChild(new Sprite({
			resource: resources.images.drawer,
			frameSize: new Vector2(32, 32),
			position: new Vector2(0, -16),
			hFrames: 2,
			vFrames: 2,
			frame: DRAWER[style]
		}));

		this.drawLayer = "DRAWER";
	}

	getContent() {
		return {
			string: "A drawer filled with junk. It belongs on a hoarders show.",
		}
	}
}