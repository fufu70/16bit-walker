import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {
	CENTER,
	CENTER_NORTH_WEST_CORNER,
	CENTER_NORTH,
	CENTER_NORTH_WEST,
	CENTER_WEST,
} from '../../helpers/orientation/Orientation.js';
import {OrientationFactory} from '../../helpers/orientation/OrientationFactory.js';

const BRICK = "BRICK";
const YELLOW_TILE = "YELLOW_TILE";
const BLUE_TILE = "BLUE_TILE";
const GRAY_PATTERN = "GRAY_PATTERN";
const HERRINGBONE = "HERRINGBONE";
const CARPET_PATTERN = "CARPET_PATTERN";
const CARPET_HORIZONTAL = "CARPET_HORIZONTAL";
const CARPET_VERTICAL = "CARPET_VERTICAL";
const CARPET_DUNNO = "CARPET_DUNNO";
const PATTERNS = [
	BRICK,
	YELLOW_TILE,
	BLUE_TILE,
	GRAY_PATTERN,
	HERRINGBONE,
	CARPET_PATTERN,
	CARPET_HORIZONTAL,
	CARPET_VERTICAL,
	CARPET_DUNNO,
];


const FLOORS = {};
FLOORS[BRICK] = {};
FLOORS[BRICK][CENTER] = 114;
FLOORS[BRICK][CENTER_NORTH_WEST_CORNER] = 98;
FLOORS[BRICK][CENTER_NORTH] = 97;
FLOORS[BRICK][CENTER_NORTH_WEST] = 96;
FLOORS[BRICK][CENTER_WEST] = 113;
FLOORS[YELLOW_TILE] = {};
FLOORS[YELLOW_TILE][CENTER] = 148;
FLOORS[YELLOW_TILE][CENTER_NORTH_WEST_CORNER] = 132;
FLOORS[YELLOW_TILE][CENTER_NORTH] = 131;
FLOORS[YELLOW_TILE][CENTER_NORTH_WEST] = 130;
FLOORS[YELLOW_TILE][CENTER_WEST] = 147;
FLOORS[BLUE_TILE] = {};
FLOORS[BLUE_TILE][CENTER] = 182;
FLOORS[BLUE_TILE][CENTER_NORTH_WEST_CORNER] = 166;
FLOORS[BLUE_TILE][CENTER_NORTH] = 165;
FLOORS[BLUE_TILE][CENTER_NORTH_WEST] = 164;
FLOORS[BLUE_TILE][CENTER_WEST] = 181;
FLOORS[GRAY_PATTERN] = {};
FLOORS[GRAY_PATTERN][CENTER] = 216;
FLOORS[GRAY_PATTERN][CENTER_NORTH_WEST_CORNER] = 200;
FLOORS[GRAY_PATTERN][CENTER_NORTH] = 199;
FLOORS[GRAY_PATTERN][CENTER_NORTH_WEST] = 198;
FLOORS[GRAY_PATTERN][CENTER_WEST] = 215;
FLOORS[HERRINGBONE]=  {};
FLOORS[HERRINGBONE][CENTER] = 250;
FLOORS[HERRINGBONE][CENTER_NORTH_WEST_CORNER] = 234;
FLOORS[HERRINGBONE][CENTER_NORTH] = 233;
FLOORS[HERRINGBONE][CENTER_NORTH_WEST] = 232;
FLOORS[HERRINGBONE][CENTER_WEST] = 249;
FLOORS[CARPET_PATTERN]=  {};
FLOORS[CARPET_PATTERN][CENTER] = 117;
FLOORS[CARPET_PATTERN][CENTER_NORTH_WEST_CORNER] = 101;
FLOORS[CARPET_PATTERN][CENTER_NORTH] = 100;
FLOORS[CARPET_PATTERN][CENTER_NORTH_WEST] = 99;
FLOORS[CARPET_PATTERN][CENTER_WEST] = 116;
FLOORS[CARPET_HORIZONTAL]=  {};
FLOORS[CARPET_HORIZONTAL][CENTER] = 151;
FLOORS[CARPET_HORIZONTAL][CENTER_NORTH_WEST_CORNER] = 135;
FLOORS[CARPET_HORIZONTAL][CENTER_NORTH] = 134;
FLOORS[CARPET_HORIZONTAL][CENTER_NORTH_WEST] = 133;
FLOORS[CARPET_HORIZONTAL][CENTER_WEST] = 150;
FLOORS[CARPET_VERTICAL]=  {};
FLOORS[CARPET_VERTICAL][CENTER] = 185;
FLOORS[CARPET_VERTICAL][CENTER_NORTH_WEST_CORNER] = 169;
FLOORS[CARPET_VERTICAL][CENTER_NORTH] = 168;
FLOORS[CARPET_VERTICAL][CENTER_NORTH_WEST] = 167;
FLOORS[CARPET_VERTICAL][CENTER_WEST] = 184;
FLOORS[CARPET_DUNNO]=  {};
FLOORS[CARPET_DUNNO][CENTER] = 219;
FLOORS[CARPET_DUNNO][CENTER_NORTH_WEST_CORNER] = 203;
FLOORS[CARPET_DUNNO][CENTER_NORTH] = 202;
FLOORS[CARPET_DUNNO][CENTER_NORTH_WEST] = 201;
FLOORS[CARPET_DUNNO][CENTER_WEST] = 218;

export class Floor extends GameObject {
	constructor(x, y, style = BRICK, orientation = CENTER) {
		super({
			position: new Vector2(x, y)
		});
		this.drawLayer = "FLOOR";

		const sprite = new Sprite({
			resource: resources.images.shopFloor,
			hFrames: 17,
			vFrames: 23,
			frame: FLOORS[style][orientation]
		});
		this.addChild(sprite);
	}
}

export class FloorFactory {
	static generate(params) {
		let {floorPlan, seed, style} = params;
		return new FloorFactory().get(floorPlan, seed, style);
	}

	get(floorPlan, seed, style) {
		if (!style && seed) {
			style = this.seedStyle(seed);
		}
		console.log(style);

		const floors = [];

		
		for (let x = 0; x < floorPlan.width(); x ++) {
			for (let y = 0; y < floorPlan.height(); y ++) {
				if (floorPlan.get(x, y) > 0) {

					let orientation = OrientationFactory.getOrientation(x, y, floorPlan);
					floors.push(new Floor(gridCells(x), gridCells(y), style, orientation));
				}
			}
		}

		return floors;
	}

	seedStyle(seed) {
		return PATTERNS[Math.floor(PATTERNS.length * seed())];
	}
}