import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'

export const NEWS = 'NEWS';
export const COOKING = 'COOKING';
export const NATURE = 'NATURE';
export const ALIENS = 'ALIENS';
export const OFF = 'OFF';

export const TELEVISION_STYLES = [
	NEWS,
	COOKING,
	NATURE,
	ALIENS,
	OFF,
]

const TELEVISION = {};
TELEVISION[NEWS] = 0;
TELEVISION[COOKING] = 1;
TELEVISION[NATURE] = 2;
TELEVISION[ALIENS] = 3;
TELEVISION[OFF] = 4;

export class Television extends GameObject {
	constructor(x, y, style = NEWS, seed = undefined) {
		super({
			position: new Vector2(x, y)
		});

		if (seed !== undefined) {
			style = TELEVISION_STYLES[Math.floor(seed() * TELEVISION_STYLES.length)];
		}

		this.addChild(new Sprite({
			resource: resources.images.television,
			frameSize: new Vector2(32, 16),
			position: new Vector2(0, -10),
			hFrames: 1,
			vFrames: 6,
			frame: TELEVISION[style]
		}));
		this.size = new Vector2(gridCells(2), gridCells(1))
	}
}