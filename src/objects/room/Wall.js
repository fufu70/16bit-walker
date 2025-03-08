import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {
	NORTH_SINGLE,
	NORTH_RIGHT,
	NORTH,
	NORTH_LEFT
} from '../../helpers/orientation/Orientation.js';
import {
	RED_PATTERN,
	PATTERNS,
	WALLS
} from './constants/Walls.js';
import {OrientationFactory} from '../../helpers/orientation/OrientationFactory.js';


export class Wall extends GameObject {
	constructor(x, y, orientation = NORTH, style = RED_PATTERN) {
		super({
			position: new Vector2(x, y)
		});
		this.drawLayer = 'WALL'
		const topWall = new Sprite({
			resource: resources.images.shopFloor,
			hFrames: 17,
			vFrames: 23,
			frame: WALLS[style][orientation]["TopWall"],
			position: new Vector2(0, - 16)
		});
		this.addChild(topWall);
		const bottomWall = new Sprite({
			resource: resources.images.shopFloor,
			hFrames: 17,
			vFrames: 23,
			frame: WALLS[style][orientation]["BottomWall"]
		});
		this.addChild(bottomWall);
	}
}

export class WallFactory {
	static cache = new Map();

	static generate(params) {
		if (WallFactory.cache.has(JSON.stringify(params))) {
			WallFactory.cache.get(JSON.stringify(params));
		}
		let {floorPlan, seed, style} = params;
		const walls = new WallFactory().get(floorPlan, seed, style);
		WallFactory.cache.set(JSON.stringify(params), walls);
		return walls;
	}

	get(floorPlan, seed, style) {
		if (!style && seed) {
			style = this.seedStyle(seed);
		}

		const walls = [];

		for (let x = -1; x < floorPlan.width(); x ++) {
			for (let y = -1; y < floorPlan.height(); y ++) {

				if (!(floorPlan.get(x, y + 1) > 0 && floorPlan.get(x, y) == 0)) {
					continue;
				}

				let orientation = OrientationFactory.getOrientation(x, y, floorPlan);
				if (orientation === undefined) {
					continue;
				}
				// console.log("orientation", orientation);
				const fpMatrixExtract = floorPlan.extract(x - 1, y - 1, 3, 3).compare(0);

				// console.log(fpMatrixExtract.toString());
				walls.push(new Wall(gridCells(x), gridCells(y), orientation, style));
			}
		}

		return walls;
	}

	seedStyle(seed) {
		return PATTERNS[Math.floor(PATTERNS.length * seed())];
	}
}