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
import {CaveLevel1} from './CaveLevel1.js';
import {AssetLevel} from './AssetLevel.js';
import {QuestionsLevel} from './QuestionsLevel.js';


const DEFAULT_HERO_POSITION = new Vector2(gridCells(6), gridCells(5));
const CAVE_EXIT = new Vector2(gridCells(6), gridCells(3));
const MODERN_INTERIOR_EXIT = new Vector2(gridCells(11), gridCells(2));
const INTERIOR_EXIT = new Vector2(gridCells(14), gridCells(3));
const QUESTIONS_EXIT = new Vector2(gridCells(3), gridCells(6));


export class OutdoorLevel1 extends Level {
	constructor(params={}) {
		super();
		this.params = params;
		this.background = new Sprite({
			resource: resources.images.sky,
			frameSize: new Vector2(320, 180)
		});

		const groundSprite = new Sprite({
			resource: resources.images.ground,
			frameSize: new Vector2(320, 180)
		});
		this.addChild(groundSprite);

		const rod = new Rod(gridCells(7), gridCells(6));
		this.addChild(rod);

		this.addChild(new Exit(CAVE_EXIT.x, CAVE_EXIT.y));
		this.addChild(new Exit(MODERN_INTERIOR_EXIT.x, MODERN_INTERIOR_EXIT.y));
		this.addChild(new Exit(INTERIOR_EXIT.x, INTERIOR_EXIT.y));
		this.addChild(new Exit(QUESTIONS_EXIT.x, QUESTIONS_EXIT.y));

		const heroStart = params.heroPosition ?? DEFAULT_HERO_POSITION;

		const hero = new Hero(heroStart.x, heroStart.y);
		this.addChild(hero);

		this.walls = new Set();
		this.walls.add(`64, 48`); // tree
		this.walls.add(`64, 64`); // squares
		this.walls.add(`64, 80`);
		this.walls.add(`80, 64`);
		this.walls.add(`80, 80`);
		this.walls.add(`112, 80`); // water
		this.walls.add(`128, 80`); // water
		this.walls.add(`144, 80`); // water
		this.walls.add(`160, 80`); // water
	}


	ready() {
		events.on("HERO_EXIT", this, (exit) => {
			if (exit.position.matches(CAVE_EXIT)) {
				events.emit("CHANGE_LEVEL", new CaveLevel1({
					heroPosition: new Vector2(gridCells(4), gridCells(5))
				}))
			}
			if (exit.position.matches(QUESTIONS_EXIT)) {
				events.emit("CHANGE_LEVEL", new QuestionsLevel({
					seed: Math.seed(Math.random())
				}));
			}
			if (exit.position.matches(MODERN_INTERIOR_EXIT)) {
				events.emit("CHANGE_LEVEL", new AssetLevel({
					sprite: new Sprite({
						resource: resources.images.shopFloor,
						hFrames: 17,
						vFrames: 23
					}),
					nextLevel: new OutdoorLevel1({
						heroPosition: new Vector2(gridCells(12), gridCells(2))
					})
				}));	
			}
			if (exit.position.matches(INTERIOR_EXIT)) {
				events.emit("CHANGE_LEVEL", new AssetLevel({
					sprite: new Sprite({
						resource: resources.images.shopObjects,
						hFrames: 16,
						vFrames: 1424 / 16
					}),
					nextLevel: new OutdoorLevel1({
						heroPosition: new Vector2(gridCells(15), gridCells(2))
					})
				}));	
			}
		});
	}
}