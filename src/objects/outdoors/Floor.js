import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js';
import {FloorFactory} from '../room/Floor.js';

export class OutdoorFloor extends GameObject {
	constructor(x, y) {
		super({
			position: new Vector2(x, y)
		});
		this.drawLayer = "FLOOR";

		this.addChild(new Sprite({
			resource: resources.images.outdoors,
			position: new Vector2(0, 0),
			hFrames: 5,
			vFrames: 5,
			frame: Math.floor(Math.random() * 6)
		}));
	}
}

export class OutdoorFloorFactory extends FloorFactory {
	getFloorSprite(x, y) {
		return new OutdoorFloor(gridCells(x), gridCells(y));
	}
}