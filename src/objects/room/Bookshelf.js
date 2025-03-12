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
export const BROWN_FULL = 'BROWN_FULL';
export const DARK_BROWN_FULL = 'DARK_BROWN_FULL';
export const DARK_BROWN_MID = 'DARK_BROWN_MID';
export const ANTIUQUE_FULL = 'ANTIUQUE_FULL';
export const ANTIUQUE_EMPTY = 'ANTIUQUE_EMPTY';
export const CART = 'CART';
export const LIBRARY_SINGLE = 'LIBRARY_SINGLE';
export const LIBRARY_DOUBLE = 'LIBRARY_DOUBLE';

export const BOOKSHELF_STYLES = [
	LIGHT_BROWN_FULL,
	LIGHT_BROWN_MID,
	BROWN_MID,
	BROWN_FULL,
	DARK_BROWN_FULL,
	DARK_BROWN_MID,
	ANTIUQUE_FULL,
	ANTIUQUE_EMPTY,
	CART,
	LIBRARY_SINGLE,
	LIBRARY_DOUBLE
]

const BOOKSHELF = {};
BOOKSHELF[LIGHT_BROWN_FULL] = 0;
BOOKSHELF[LIGHT_BROWN_MID] = 1;
BOOKSHELF[BROWN_MID] = 2;
BOOKSHELF[BROWN_FULL] = 3;
BOOKSHELF[DARK_BROWN_FULL] = 4;
BOOKSHELF[DARK_BROWN_MID] = 5;
BOOKSHELF[ANTIUQUE_FULL] = 6;
BOOKSHELF[ANTIUQUE_EMPTY] = 7;
BOOKSHELF[CART] = 8;
BOOKSHELF[LIBRARY_SINGLE] = 9;
BOOKSHELF[LIBRARY_DOUBLE] = 10;

export class Bookshelf extends GameObject {
	constructor(x, y, style = LIGHT_BROWN_FULL, seed = undefined) {
		super({
			position: new Vector2(x, y)
		});

		if (seed !== undefined) {
			style = BOOKSHELF_STYLES[Math.floor(seed() * BOOKSHELF_STYLES.length)];
		}

		this.addChild(new Sprite({
			resource: resources.images.bookshelf,
			frameSize: new Vector2(32, 32),
			position: new Vector2(0, -16),
			hFrames: 3,
			vFrames: 4,
			frame: BOOKSHELF[style]
		}));

		this.drawLayer = "BOOKSHELF";
	}

	getContent() {
		return {
			string: "Book Book, go away, now what will I read today.",
		}
	}
}