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
		this.drawLayer = 'WALL';
		if (WALLS[style][orientation] === undefined || WALLS[style][orientation]["TopWall"]=== undefined) {
			console.error("ERROR for WALL", style, orientation);
			return;
		}
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
		if (WallFactory.cache.has(JSON.stringify(params.floorPlan))) {
			WallFactory.cache.get(JSON.stringify(params.floorPlan));
		}
		let {floorPlan, seed, style} = params;
		const walls = new (this.prototype.constructor)().get(floorPlan, seed, style);
		WallFactory.cache.set(JSON.stringify(params.floorPlan), walls);
		return walls;
	}

	get(floorPlan, seed, style) {
		if (!style && seed) {
			style = this.seedStyle(seed);
		}

		const walls = [];
		floorPlan.traverse({
			callback: (x, y, matrixValue) => {
				if (!this.isWall(x, y, matrixValue, floorPlan)) {
					return;
				}

				let orientation = OrientationFactory.getOrientation(x, y, floorPlan);
				if (orientation === undefined) {
					return;
				}
				// console.log("orientation", orientation);
				// const fpMatrixExtract = floorPlan.extract(x - 1, y - 1, 3, 3).compare(0);

				// console.log(fpMatrixExtract.toString());
				walls.push(this.getWallSprite(x, y, orientation, style));
			},
			padding: 2
		});

		return walls;
	}
	
	isWall(x, y, matrixValue, floorPlan) {

	}

	getWallSprite(x, y, orientation, style) {
		
	}

	seedStyle(seed) {
		return PATTERNS[Math.floor(PATTERNS.length * seed())];
	}
}

export class RoomWallFactory extends WallFactory {
	isWall(x, y, matrixValue, floorPlan) {
		return floorPlan.get(x, y + 1) > 0 && matrixValue == 0
	}

	getWallSprite(x, y, orientation, style)  {
		return new Wall(gridCells(x), gridCells(y), orientation, style);
	}
}