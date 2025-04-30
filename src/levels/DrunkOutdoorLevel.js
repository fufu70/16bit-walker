import {DrunkardWalkLevel} from './DrunkardWalkLevel.js';
import {OutdoorFloor, OutdoorFloorFactory} from '../objects/outdoors/Floor.js';
import {ForestWallFactory} from '../objects/outdoors/ForestWallFactory.js';
import {Sprite} from '../Sprite.js';
import {resources} from '../Resources.js';
import {Vector2} from "../Vector2.js";
import {gridCells, GRID_SIZE, isSpaceFree} from '../helpers/Grid.js'


export class DrunkOutdoorLevel extends DrunkardWalkLevel {

	constructor(params={}) {
		try {
			super({
				...params,
				width: 10,
				height: 10,
				maxSteps: (800),
				showNextLevel: false,
				rotationChanges: 400,
				rooms: 3,
				roomParams: {
					stepSize: 3,
					maxSteps: 10,
					rotationChanges: 1,
				},
				background: new Sprite({
					resource: resources.images.greenBackground,
					frameSize: new Vector2(320, 180),
					alwaysRender: true
				})
				// heroPosition: new Vector2(0, 0)
			});
		} catch (e) {
			console.error(e);
		}
	}


	beforeGeneratingSprites() {
		console.log("FLOOR", this.floorPlan.toString().replaceAll("0", " "));
	}

	addFloors(floorPlan, params) {
		// console.log("START this.addFloorSprites");
		this.addFloorSprites(floorPlan, params);
		// console.log("END this.addFloorSprites");
		// floorPlan.travers()
	}

	addFloorSprites(floorPlan, params) {
		const floors = OutdoorFloorFactory.generate({
			floorPlan,
			seed: params.seed
		});
		for (var i = floors.length - 1; i >= 0; i--) {
			this.addFloor(floors[i]);
		}
	}

	addWalls(floorPlan, params) {
		const walls = ForestWallFactory.generate({
			floorPlan
		});
		for (var i = walls.length - 1; i >= 0; i--) {
			this.addWall(walls[i]);
		}
	}

	addItems(floorPlan, params) {
		// for (var i = 0; i < Math.max(params.rooms ?? 0, 1); i++) {
		// 	// console.log("START this.addVases");
		// 	this.addVases(floorPlan, params);
		// 	// console.log("END this.addVases");
		// 	// console.log("START this.addPictures");
		// 	this.addPictures(params);
		// 	// console.log("END this.addPictures");

		// 	// console.log("START this.addTelevisions");
		// 	this.addTelevisions(params);
		// 	// console.log("END this.addTelevisions");
		// 	// console.log("START this.addBookshelves");
		// 	this.addBookshelves(params);
		// 	// console.log("END this.addBookshelves");
		// 	// console.log("START this.addDrawers");
		// 	this.addDrawers(params);
		// 	// console.log("END this.addDrawers");
		// }
	}
}