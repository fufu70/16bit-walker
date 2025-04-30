import {DrunkardWalkLevel} from './DrunkardWalkLevel.js';
import {Floor, RoomFloorFactory} from '../objects/room/Floor.js';
import {Wall, RoomWallFactory} from '../objects/room/Wall.js';
import {Trim, TrimFactory} from '../objects/room/Trim.js';
import {Vase} from '../objects/room/Vase.js';
import {Picture} from '../objects/room/Picture.js';
import {Television} from '../objects/room/Television.js';
import {Drawer} from '../objects/room/Drawer.js';
import {Bookshelf} from '../objects/room/Bookshelf.js';
import {Vector2} from "../Vector2.js";
import {gridCells, GRID_SIZE, isSpaceFree} from '../helpers/Grid.js'


export class DrunkRoomLevel extends DrunkardWalkLevel {

	addFloors(floorPlan, params) {
		// console.log("START this.addFloorSprites");
		this.addFloorSprites(floorPlan, params);
		// console.log("END this.addFloorSprites");
	}

	addFloorSprites(floorPlan, params) {
		const floors = RoomFloorFactory.generate({
			floorPlan,
			seed: params.seed
		});
		for (var i = floors.length - 1; i >= 0; i--) {
			this.addFloor(floors[i]);
		}
	}

	addWalls(floorPlan, params) {
		// console.log("START this.addTrimSprites")
		this.addTrimSprites(floorPlan, params);
		// console.log("END this.addTrimSprites")
		// console.log("START this.addWallSprites")
		this.addWallSprites(floorPlan, params);
	}


	addWallSprites(floorPlan, params) {
		const walls =  RoomWallFactory.generate({
			floorPlan,
			seed: params.seed
		});
		for (var i = walls.length - 1; i >= 0; i--) {
			this.addWall(walls[i]);
		}
	}

	addTrimSprites(floorPlan) {
		const trims =  TrimFactory.generate({
			floorPlan
		});
		for (var i = trims.length - 1; i >= 0; i--) {
			this.addChild(trims[i]);
		}
	}

	addItems(floorPlan, params) {
		for (var i = 0; i < Math.max(params.rooms ?? 0, 1); i++) {
			// console.log("START this.addVases");
			this.addVases(floorPlan, params);
			// console.log("END this.addVases");
			// console.log("START this.addPictures");
			this.addPictures(params);
			// console.log("END this.addPictures");

			// console.log("START this.addTelevisions");
			this.addTelevisions(params);
			// console.log("END this.addTelevisions");
			// console.log("START this.addBookshelves");
			this.addBookshelves(params);
			// console.log("END this.addBookshelves");
			// console.log("START this.addDrawers");
			this.addDrawers(params);
			// console.log("END this.addDrawers");
		}
	}

	addVases(floorPlan, params) {
		const spaceAround = new Vector2(gridCells(3), gridCells(3));
		const spot = this.findSpotOnFloor(spaceAround);
		if (spot === undefined) return;
		spot.x += gridCells(1);
		spot.y += gridCells(1);
		this.addGameObject(new Vase(spot.x, spot.y, undefined, params.seed));
	}

	addPictures(params) {
		const spot = this.findRandomWallSpot(this.seed, this.wallSprites, this.gameObjects);
		if (spot === undefined) return;
		this.addGameObject(new Picture(spot.x, spot.y, undefined, params.seed));
	}

	addTelevisions(params) {
		const spaceAround = new Vector2(gridCells(2), gridCells(1));
		const spot = this.findRandomWallSpot(this.seed, this.wallSprites, this.gameObjects, spaceAround);
		if (spot === undefined) return;
		this.addGameObject(new Television(spot.x, spot.y, undefined, params.seed));
	}

	addBookshelves(params) {
		const spaceAround = new Vector2(gridCells(4), gridCells(3));
		const spot = this.findSpotOnFloor(spaceAround);
		if (spot === undefined) return;
		spot.x += gridCells(1);
		spot.y += gridCells(1);
		this.addGameObject(new Bookshelf(spot.x, spot.y, undefined, params.seed));
	}

	addDrawers(params) {
		// console.log(this, this.seed, this.floors, this.gameObjects, gridCells(3));
		const spaceAround = new Vector2(gridCells(4), gridCells(3));
		const spot = this.findSpotOnFloor(spaceAround);
		if (spot === undefined) return;
		spot.x += gridCells(1);
		spot.y += gridCells(1);
		this.addGameObject(new Drawer(spot.x, spot.y, undefined, params.seed));
	}
}