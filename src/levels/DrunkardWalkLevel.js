import {Level} from '../objects/level/Level.js';
import {GameObject} from "../GameObject.js";
import {Vector2} from "../Vector2.js";
import {Sprite} from '../Sprite.js';
import {moveTowards} from '../helpers/Move.js';
import {resources} from '../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../helpers/Grid.js'
import {events} from '../Events.js';
import {Hero} from '../objects/hero/Hero.js';
import {Rod} from '../objects/rod/Rod.js';
import {Exit} from '../objects/exit/Exit.js';
import {Npc} from '../objects/npc/Npc.js';
import {Floor, FloorFactory} from '../objects/room/Floor.js';
import {Wall, WallFactory} from '../objects/room/Wall.js';
import {Trim, TrimFactory} from '../objects/room/Trim.js';
import {Vase} from '../objects/room/Vase.js';
import {Picture} from '../objects/room/Picture.js';
import {Television} from '../objects/room/Television.js';
import {Drawer} from '../objects/room/Drawer.js';
import {Bookshelf} from '../objects/room/Bookshelf.js';
import {OutdoorLevel1} from './OutdoorLevel1.js';
import {CaveLevel1} from './CaveLevel1.js';
import {TALKED_TO_A, TALKED_TO_B} from '../StoryFlags.js';
import {getCharacterWidth, getCharacterFrame} from '../objects/textbox/spriteFontMap.js';
import {WalkFactory, WalkFactoryQuery} from '../helpers/WalkFactory.js';
import {Matrix} from '../Matrix.js';
import {OrientationFactory} from '../helpers/orientation/OrientationFactory.js';

const DEFAULT_HERO_POSITION = new Vector2(gridCells(3), gridCells(3));

export class DrunkardWalkLevel extends Level {

	constructor(params={}) {
		super();
		console.log("PARAMS: ", params);
		try {
			this.params = params;
			this.background = new Sprite({
				resource: resources.images.shopBackground,
				frameSize: new Vector2(320, 180)
			});

			this.gameObjects = [];
			this.floors = [];
			this.wallSprites = [];
			if (params.seedNumber !== undefined) {
				params.seed = Math.seed(params.seedNumber);
			}
			this.seed = params.seed ?? Math.seed(Math.random());
			params.seed = this.seed;
			const floorPlan = this.buildFloorPlan(params);
			this.floorPlan = floorPlan;
			this.walls = new Set();

			console.log("START this.addFloorSprites");
			this.addFloorSprites(floorPlan, params);
			console.log("END this.addFloorSprites");

			if (params.showNextLevel === undefined || params.showNextLevel === true) {
				this.addNextLevelExit();	
			}

			const heroStart = params.heroPosition ?? this.findHighestPosition(floorPlan);

			this.caveExitPosition = heroStart.duplicate();
			this.caveExitPosition.x += gridCells(1);
			this.addGameObject(new Exit(this.caveExitPosition.x, this.caveExitPosition.y));

			const hero = new Hero(heroStart.x, heroStart.y);
			this.addGameObject(hero);
			
			console.log("START this.addTrimSprites")
			this.addTrimSprites(floorPlan, params);
			console.log("END this.addTrimSprites")
			console.log("START this.addWallSprites")
			this.addWallSprites(floorPlan, params);
			console.log("END this.addWallSprites");
			console.log("START this.addVases");
			this.addVases(floorPlan, params);
			console.log("END this.addVases");
			console.log("START this.addPictures");
			this.addPictures(params);
			console.log("END this.addPictures");

			console.log("START this.addTelevisions");
			this.addTelevisions(params);
			console.log("END this.addTelevisions");
			console.log("START this.addBookshelves");
			this.addBookshelves(params);
			console.log("END this.addBookshelves");
			console.log("START this.addDrawers");
			this.addDrawers(params);
			console.log("END this.addDrawers");

			console.log("START this.getWalls");
			this.walls = this.getWalls(this.walls, floorPlan);
			console.log("END this.getWalls");
		} catch (e) {
			console.error(e);	
		}
	}

	addNextLevelExit() {
		this.drunkWalkExitPosition = this.findFirstPosition(this.floorPlan);
		this.addGameObject(new Exit(this.drunkWalkExitPosition.x, this.drunkWalkExitPosition.y));
	}

	addGameObject(gameObject) {
		this.gameObjects.push(gameObject);
		this.addChild(gameObject);
	}

	addFloor(floor) {
		this.floors.push(floor);
		this.addChild(floor);
	}

	addWall(wall) {
		this.wallSprites.push(wall);
		this.addChild(wall);
	}

	findRandomSpot(seed, floors, gameObjects, widthToFind = gridCells(1)) {
		const nextLevelExit = this.findFirstPosition(this.floorPlan);
		floors = [...floors, {
			position: nextLevelExit
		}];
		return this.findRandomWallSpot(seed, floors, gameObjects, widthToFind);
	}

	findRandomWallSpot(seed, sprites, gameObjects, widthToFind = gridCells(1)) {
		let vector = new Vector2(0, 0);
		let start = Math.floor(seed() * sprites.length);
		let end = start - 1 ;
		// let start = 0;
		// let end = sprites.length - 1;

		for (var i = start; i % sprites.length != end; i++) {

			let index = i % sprites.length;
			if (
				this.isPositionFree(
					sprites,
					gameObjects,
					sprites[index].position.y,
					index,
					widthToFind)
			) {
				return sprites[index].position;
			}
		}
		return vector;
	}

	isPositionFree(sprites, gameObjects, y, index, length) {
		let currentSprite = sprites[index];
		while (length > 0 && currentSprite) {
			if (!this.atGameObject(currentSprite, gameObjects)) {
				length -= gridCells(1);
			} else {
				break;
			}

			currentSprite = this.findSprite(new Vector2(
				currentSprite.position.x + gridCells(1),
				currentSprite.position.y
			), sprites);

			if (length === 0) {
				return true;
			}
		}
		return false;
	}

	findSprite(position, sprites) {
		for (var i = sprites.length - 1; i >= 0; i--) {
			if (sprites[i].position.matches(position)) {
				return sprites[i];
			}
		}
	}

	atGameObject(obj, gameObjects) {
		for (var i = gameObjects.length - 1; i >= 0; i--) {
			// console.log(gameObjects[i]);
			const maxX = new Vector2(
				gameObjects[i].position.x + gameObjects[i].size.x,
				gameObjects[i].position.y
			);
			// console.log(gameObjects[i].drawLayer, maxX);
			if (gameObjects[i].position.matches(obj.position)
				|| maxX.matches(obj.position)) {
				return true;
			}
		}
		return false;
	}

	findFirstPosition(floorPlan) {
		for (let x = 0; x < floorPlan.width(); x ++) {
			for (let y = 0; y < floorPlan.height(); y ++) {
				if (floorPlan.get(x, y) > 1) {
					return new Vector2(gridCells(x), gridCells(y));
				}
			}
		}
		return new Vector2(0, 0);
	}

	findHighestPosition(floorPlan) {
		let max = new Vector2(0, 0);
		for (let x = 0; x < floorPlan.width(); x ++) {
			for (let y = 0; y < floorPlan.height(); y ++) {
				if (floorPlan.get(x, y) > floorPlan.get(max.x, max.y)) {
					max = new Vector2(x, y);
				}
			}
		}
		return new Vector2(gridCells(max.x), gridCells(max.y));
	}

	getWalls(walls, floorPlan) {
		for (let x = -1; x <= floorPlan.width(); x ++) {
			for (let y = -1; y <= floorPlan.height(); y ++) {
				if (floorPlan.get(x, y) == 0) {					
					walls.add(`${gridCells(x)}, ${gridCells(y)}`);
				}
			}
		}

		return walls;
	}

	buildFloorPlan(params) {

		const query = new WalkFactoryQuery(params);

		return WalkFactory.getFloorPlan(query);
	}

	addFloorSprites(floorPlan, params) {
		const floors =  FloorFactory.generate({
			floorPlan,
			seed: params.seed
		});
		for (var i = floors.length - 1; i >= 0; i--) {
			this.addFloor(floors[i]);
		}
	}

	addWallSprites(floorPlan, params) {
		const walls =  WallFactory.generate({
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

	addVases(floorPlan, params) {

		const spot = this.findRandomSpot(this.seed, this.floors, this.gameObjects);
		this.addGameObject(new Vase(spot.x, spot.y, undefined, params.seed));
		this.walls.add(`${spot.x}, ${spot.y}`);
	}

	addPictures(params) {
		const spot = this.findRandomWallSpot(this.seed, this.wallSprites, this.gameObjects);
		this.addGameObject(new Picture(spot.x, spot.y, undefined, params.seed));
	}

	addTelevisions(params) {
		const spot = this.findRandomWallSpot(this.seed, this.wallSprites, this.gameObjects, gridCells(2));
		this.addGameObject(new Television(spot.x, spot.y, undefined, params.seed));
	}

	addBookshelves(params) {
		// console.log(this, this.seed, this.floors, this.gameObjects, gridCells(3));
		const spot = this.findRandomSpot(this.seed, this.floors, this.gameObjects, gridCells(2));
		// console.log(spot);
		this.addGameObject(new Bookshelf(spot.x, spot.y, undefined, params.seed));

		this.walls.add(`${spot.x}, ${spot.y}`);
		this.walls.add(`${spot.x + gridCells(1)}, ${spot.y}`);
	}

	addDrawers(params) {
		// console.log(this, this.seed, this.floors, this.gameObjects, gridCells(3));
		const spot = this.findRandomSpot(this.seed, this.floors, this.gameObjects, gridCells(2));
		// console.log(spot);
		this.addGameObject(new Drawer(spot.x, spot.y, undefined, params.seed));

		this.walls.add(`${spot.x}, ${spot.y}`);
		this.walls.add(`${spot.x + gridCells(1)}, ${spot.y}`);
	}

	getOrientation(x, y, floorPlan) {
		return OrientationFactory.getOrientation(x, y, floorPlan);
	}

	ready() {
		events.on("HERO_EXIT", this, (exit) => {
			if (exit.position.matches(this.caveExitPosition)) {
				events.emit("CHANGE_LEVEL", this.getHome())
			}
			if (exit.position.matches(this.drunkWalkExitPosition)) {
				events.emit("CHANGE_LEVEL", this.getNextLevel());	
			}
		});
	}

	getHome() {
		return new CaveLevel1({
			heroPosition: new Vector2(gridCells(4), gridCells(4))
		});
	}

	getNextLevel() {
		return new DrunkardWalkLevel({
			seed: Math.seed(Math.random())
		});
	}
}