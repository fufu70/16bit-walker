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
		try {

			this.params = params;
			this.background = new Sprite({
				resource: resources.images.shopBackground,
				frameSize: new Vector2(320, 180)
			});

			this.gameObjects = [];
			this.floors = [];

			this.seed = params.seed ?? Math.seed(Math.random());
			params.seed = this.seed;
			const floorPlan = this.buildFloorPlan(params);
			this.floorPlan = floorPlan;
			this.walls = new Set();

			console.log("START this.addFloorSprites")
			this.addFloorSprites(floorPlan, params);
			console.log("END this.addFloorSprites")


			this.drunkWalkExitPosition = this.findFirstPosition(floorPlan);
			this.addGameObject(new Exit(this.drunkWalkExitPosition.x, this.drunkWalkExitPosition.y));

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
			this.addPictures(floorPlan, params);
			console.log("END this.addPictures");

			console.log("START this.getWalls");
			this.walls = this.getWalls(this.walls, floorPlan);
			console.log("END this.getWalls");
		} catch (e) {
			console.error(e);	
		}
	}

	addGameObject(gameObject) {
		this.gameObjects.push(gameObject);
		this.addChild(gameObject);
	}

	addFloor(floor) {
		this.floors.push(floor);
		this.addChild(floor);
	}

	findRandomSpot(seed, floors, gameObjects) {
		let vector = new Vector2(0, 0);
		for (var i = Math.floor(seed() * floors.length); i < floors.length; i++) {
			if (!this.atGameObject(floors[i], gameObjects)) {
				return floors[i].position;
			}
		}
		return vector;
	}

	atGameObject(obj, gameObjects) {
		for (var i = gameObjects.length - 1; i >= 0; i--) {
			if (gameObjects[i].position.matches(obj.position)) {
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
			this.addChild(walls[i]);
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
		console.log(params.seed);

		this.walls.add(`${spot.x}, ${spot.y}`);
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