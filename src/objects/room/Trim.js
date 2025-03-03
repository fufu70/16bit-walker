import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {OrientationFactory} from '../../helpers/orientation/OrientationFactory.js';
import {
	NORTH_RIGHT,
	NORTH,
	NORTH_LEFT,
	NORTH_WEST_CORNER,
	NORTH_WEST,
	WEST_TOP,
	WEST,
	WEST_BOTTOM,
	SOUTH_WEST,
	SOUTH_WEST_CORNER,
	SOUTH_LEFT,
	SOUTH,
	SOUTH_RIGHT,
	SOUTH_EAST,
	SOUTH_EAST_CORNER,
	EAST_BOTTOM,
	EAST,
	EAST_TOP,
	NORTH_EAST,
	NORTH_EAST_CORNER,
} from '../../helpers/orientation/Orientation.js';

const TRIM = {};
// TRIM.NORTH_RIGHT = 24;
// TRIM.NORTH = 63;
// TRIM.NORTH_LEFT = 23;
TRIM[NORTH_WEST_CORNER] = 7;
TRIM[NORTH_WEST] = 24;
TRIM[WEST_TOP] = 28;
TRIM[WEST] = 45;
TRIM[WEST_BOTTOM] = 45;
TRIM[SOUTH_WEST] = 62;
TRIM[SOUTH_WEST_CORNER] = 39;
TRIM[SOUTH_LEFT] = 63;
TRIM[SOUTH] = 63;
TRIM[SOUTH_RIGHT] = 63;
TRIM[SOUTH_EAST] = 64;
TRIM[SOUTH_EAST_CORNER] = 40;
TRIM[EAST_BOTTOM] = 47;
TRIM[EAST] = 47;
TRIM[EAST_TOP] = 30;
TRIM[NORTH_EAST] = 29;
TRIM[NORTH_EAST_CORNER] = 29;

export class Trim extends GameObject {
	constructor(x, y, orientation = NORTH) {
		super({
			position: new Vector2(x, y)
		});
		if (orientation === NORTH_WEST) {
			this.addMidTopTrim(WEST_TOP);
		} else if (orientation === NORTH_EAST) {
			this.addMidTopTrim(EAST_TOP);
		} else if (orientation === WEST_TOP || orientation === EAST_TOP) {
			this.addTopTrim(orientation);
		} else {
			this.addTrim(orientation);
		}
		
		this.drawLayer = "FLOOR";
	}


	addMidTopTrim(orientation) {
		this.addChild(new Sprite({
			resource: resources.images.shopFloor,
			hFrames: 17,
			vFrames: 23,
			frame: TRIM[orientation],
			position: new Vector2(0, gridCells(-1))
		}));
		this.addChild(new Sprite({
			resource: resources.images.shopFloor,
			hFrames: 17,
			vFrames: 23,
			frame: TRIM[orientation.replace("_TOP", "")]
		}));
	}

	addTopTrim(orientation) {
		this.addChild(new Sprite({
			resource: resources.images.shopFloor,
			hFrames: 17,
			vFrames: 23,
			frame: TRIM[orientation],
			position: new Vector2(0, gridCells(-2))
		}));
		this.addChild(new Sprite({
			resource: resources.images.shopFloor,
			hFrames: 17,
			vFrames: 23,
			frame: TRIM[orientation.replace("_TOP", "")],
			position: new Vector2(0, gridCells(-1))
		}));
		this.addChild(new Sprite({
			resource: resources.images.shopFloor,
			hFrames: 17,
			vFrames: 23,
			frame: TRIM[orientation.replace("_TOP", "")]
		}));
	}

	addTrim(orientation) {
		this.addChild(new Sprite({
			resource: resources.images.shopFloor,
			hFrames: 17,
			vFrames: 23,
			frame: TRIM[orientation]
		}));
	}
}

export class TrimFactory {

	static generate(params) {
		let {floorPlan} = params;
		return new TrimFactory().get(floorPlan);
	}

	get(floorPlan) {
		const trims = [];	
		for (let x = -1; x < floorPlan.width() + 1; x ++) {
			for (let y = -1; y < floorPlan.height() + 1; y ++) {

				if (
					!(floorPlan.get(x, y) == 0)
					// !(
					// 	(floorPlan.get(x, y - 1) > 0 && floorPlan.get(x, y) == 0)
					// 	|| (floorPlan.get(x + 1, y) > 0 && floorPlan.get(x, y) == 0)
					// 	|| (floorPlan.get(x - 1, y) > 0 && floorPlan.get(x, y) == 0)
					// 	|| (floorPlan.get(x - 1, y - 1) > 0 && floorPlan.get(x, y) == 0)
					// 	|| (floorPlan.get(x + 1, y - 1) > 0 && floorPlan.get(x, y) == 0)
					// )
				) {
					continue;
				}

				let orientations = OrientationFactory.getOrientations(x, y, floorPlan);
				if (orientations === undefined) {
					continue;
				}
				// console.log("orientation", orientation);
				// const fpMatrixExtract = floorPlan.extract(x - 1, y - 1, 3, 3).compare(0);

				// console.log(fpMatrixExtract.toString());
				for (var i = 0; i < orientations.length; i++) {
					trims.push(new Trim(gridCells(x), gridCells(y), orientations[i]));
				}
			}
		}

		return trims;
	}
}