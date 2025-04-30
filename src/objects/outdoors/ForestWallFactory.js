import {WallFactory} from '../room/Wall.js';
import {gridCells} from '../../helpers/Grid.js';
import {Vector2} from "../../Vector2.js";
import {Tree} from './Tree.js';
import {Rock} from './Rock.js';
import {Bush} from './Bush.js';
import {Platform} from './Platform.js';

export class ForestWallFactory extends WallFactory {

	get(floorPlan, seed, style) {
		let walls = [];
		let wallSet = new Set();
		console.log(floorPlan);
		floorPlan.traverse({
			callback: (x, y, matrixValue) => {
				if (!this.isWall(x, y, matrixValue, floorPlan)) {
					return;
				}

				if (this.hasWall(x, y, wallSet)) {
					return;
				}
				const binPackResp = this.binPackForest(x, y, walls, wallSet, floorPlan);

				if (binPackResp.addedForest) {
					walls = binPackResp.walls;
					wallSet = binPackResp.wallSet;
				} else {
					walls.push(this.getWallSprite(x, y));
				}
			},
			padding: 10
		});

		return walls;
	}

	binPackForest(x, y, walls, wallSet, floorPlan) {
		let addedForest = false;
		for (let size = 20; size >= 3; size --) {
			if (this.isForest(x, y, floorPlan, size)) {
				const sprites = this.getForestSprites(x, y, size);
				sprites.map(sprite => {
					walls.push(sprite);
					// walls.push(new OutdoorFloor)
				});
				wallSet = this.addWallPatch(x, y, size, wallSet);
				addedForest = true;
				break;
			}	
		}

		return {
			walls: walls,
			wallSet: wallSet,
			addedForest: addedForest
		};
	}

	hasWall(x, y, wallSet) {
		return wallSet.has(`${x}, ${y}`);
	}

	addWallPatch(x, y, size, wallSet) {
		for (var i = x; i < x + size; i++) {
			for (var j = y; j < y + size; j++) {
				wallSet.add(`${i}, ${j}`);
			}
		}
		return wallSet;
	}

	isForest(x, y, floorPlan, size) {
		let isFloor = true;
		let extract = floorPlan.extract(x, y, size, size);
		extract.traverse({
			callback: (i, j, matrixValue) => {
				if (matrixValue >= 1) {
					// console.log(x, y, matrixValue);
					isFloor = false;
				}
			}
		});
		return isFloor;
	}

	isWall(x, y, matrixValue, floorPlan) {
		return matrixValue == 0
	}

	getWallSprite(x, y)  {
		const option = Math.floor(Math.random() * 4);
		if (option == 0) {
			return new Tree(gridCells(x), gridCells(y));
		} else if (option == 1) {
			return new Rock(gridCells(x), gridCells(y));
		} else if (option == 2) {
			return new Bush(gridCells(x), gridCells(y));
		} else if (option == 3) {
			return new Platform(gridCells(x), gridCells(y));
		}
	}

	getForestSprites(x, y, size) {
		const fromPosition = new Vector2(gridCells(x), gridCells(y));
		const toPosition = new Vector2(gridCells(x + size - 1), gridCells(y + size - 1));
		return this.forestSprites(fromPosition, toPosition, Math.pow(size, 2) * 3);
	}

	forestSprites(fromPosition, toPosition, trees) {
		let sprites = [];
		sprites.push(new Tree(fromPosition.x, fromPosition.y));
		sprites.push(new Tree(toPosition.x, fromPosition.y));
		const depthX = toPosition.x - fromPosition.x;
		const depthY = toPosition.y - fromPosition.y;
		const depthYMap = new Map();
		for (var i = 0; i < trees; i++) {

			const randomX = Math.floor(Math.random() * depthX);
			const randomY = Math.floor(Math.random() * depthY);
			sprites.push(new Tree(
				fromPosition.x, fromPosition.y + randomY, 
				Math.floor(Math.random() * depthX), 
				0)
			);
		}
		sprites.push(new Tree(fromPosition.x, toPosition.y));
		sprites.push(new Tree(toPosition.x, toPosition.y));
		return sprites;
		// this.addForestWalls(fromPosition, toPosition);
	}

	addForestWalls(fromPosition, toPosition) {
		for (var x = fromPosition.x; x <= toPosition.x; x += gridCells(1)) {
			for (var y = fromPosition.y; y <= toPosition.y; y += gridCells(1)) {
				this.walls.add(`${x}, ${y}`);
			}
		}
	}
}