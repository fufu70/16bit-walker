import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'

export const MODERN = 'MODERN';
export const EVIL_PURPLE = 'EVIL_PURPLE';
export const EVIL_BLACK = 'EVIL_BLACK';
export const SPLATTER = 'SPLATTER';
export const MOUNTAIN = 'MOUNTAIN';
export const FIRE = 'FIRE';

export const PICTURE_STYLES = [
	MODERN,
	EVIL_PURPLE,
	EVIL_BLACK,
	SPLATTER,
	MOUNTAIN,
	FIRE,
]

const PICTURE = {};
PICTURE[MODERN] = 0;
PICTURE[EVIL_PURPLE] = 1;
PICTURE[EVIL_BLACK] = 2;
PICTURE[SPLATTER] = 3;
PICTURE[MOUNTAIN] = 4;
PICTURE[FIRE] = 5;

export class Picture extends GameObject {
	constructor(x, y, style = MODERN, seed = undefined) {
		super({
			position: new Vector2(x, y)
		});

		if (seed !== undefined) {
			style = PICTURE_STYLES[Math.floor(seed() * 6)];
		}

		this.addChild(new Sprite({
			resource: resources.images.picture,
			position: new Vector2(0, -10),
			hFrames: 1,
			vFrames: 6,
			frame: PICTURE[style]
		}));
	}
}