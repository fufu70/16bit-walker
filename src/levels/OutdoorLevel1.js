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
import {
	PRINCIPLES_OF_AMERICAN_DEMOCRACY,
	SYSTEM_OF_GOVERNMENT,
	RIGHTS_AND_RESPONSIBILITIES,
	COLONIAL_PERIOD_AND_INDEPENDENCE,
	CENTURY_18,
	RECENT_AMERICAN_HISTORY,
	GEOGRAPHY,
	SYMBOLS,
	HOLIDAYS,
} from './constants/CivicsQuestions.js';


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
		groundSprite.drawLayer = "FLOOR";
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
				const seed1 = Math.random();
				const seed2 = Math.random();
				const seed3 = Math.random();
				const seed4 = Math.random();
				const seed5 = Math.random();
				const seed6 = Math.random();
				const seed7 = Math.random();
				const seed8 = Math.random();
				const seed9 = Math.random();
				const seed1Func = () => Math.seed(seed1);
				const seed2Func = () => Math.seed(seed2);
				const seed3Func = () => Math.seed(seed3);
				const seed4Func = () => Math.seed(seed4);
				const seed5Func = () => Math.seed(seed5);
				const seed6Func = () => Math.seed(seed6);
				const seed7Func = () => Math.seed(seed7);
				const seed8Func = () => Math.seed(seed8);
				const seed9Func = () => Math.seed(seed9);

				const level1Params = {
					seedNumber: seed1,
					showNextLevel: true,
					questions: [...PRINCIPLES_OF_AMERICAN_DEMOCRACY]
				};
				const level2Params = {
					seedNumber: seed2,
					showNextLevel: true,
					questions: [...SYSTEM_OF_GOVERNMENT]
				};
				const level3Params = {
					seedNumber: seed3,
					showNextLevel: true,
					questions: [...RIGHTS_AND_RESPONSIBILITIES]
				};
				const level4Params = {
					seedNumber: seed4,
					showNextLevel: true,
					questions: [...COLONIAL_PERIOD_AND_INDEPENDENCE]
				};
				const level5Params = {
					seedNumber: seed5,
					showNextLevel: true,
					questions: [...CENTURY_18]
				};
				const level6Params = {
					seedNumber: seed6,
					showNextLevel: true,
					questions: [...RECENT_AMERICAN_HISTORY]
				};
				const level7Params = {
					seedNumber: seed7,
					showNextLevel: true,
					questions: [...GEOGRAPHY]
				};
				const level8Params = {
					seedNumber: seed8,
					showNextLevel: true,
					questions: [...SYMBOLS]
				};
				const level9Params = {
					seedNumber: seed9,
					showNextLevel: true,
					questions: [...HOLIDAYS],
					nextLevel: () => {
						return new CaveLevel1({
							heroPosition: new Vector2(gridCells(10), gridCells(5))
						})
					}
				};
				level8Params.nextLevel = () => {
					return new QuestionsLevel(level9Params);
				}
				level7Params.nextLevel = () => {
					return new QuestionsLevel(level8Params);
				}
				level6Params.nextLevel = () => {
					return new QuestionsLevel(level7Params);
				}
				level5Params.nextLevel = () => {
					return new QuestionsLevel(level6Params);
				}
				level4Params.nextLevel = () => {
					return new QuestionsLevel(level5Params);
				}
				level3Params.nextLevel = () => {
					return new QuestionsLevel(level4Params);
				}
				level2Params.nextLevel = () => {
					return new QuestionsLevel(level3Params);
				}
				level1Params.nextLevel = () => {
					return new QuestionsLevel(level2Params);
				}

				level9Params.previousLevel = () => {
					return new QuestionsLevel(level8Params);
				}
				level8Params.previousLevel = () => {
					return new QuestionsLevel(level7Params);
				}
				level7Params.previousLevel = () => {
					return new QuestionsLevel(level6Params);
				}
				level6Params.previousLevel = () => {
					return new QuestionsLevel(level5Params);
				}
				level5Params.previousLevel = () => {
					return new QuestionsLevel(level4Params);
				}
				level4Params.previousLevel = () => {
					return new QuestionsLevel(level3Params);
				}
				level3Params.previousLevel = () => {
					return new QuestionsLevel(level2Params);
				}
				level2Params.previousLevel = () => {
					return new QuestionsLevel(level1Params);
				}
				events.emit(
					"CHANGE_LEVEL",
					new QuestionsLevel(level1Params)
				);
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