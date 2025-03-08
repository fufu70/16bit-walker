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
import {Adam} from '../objects/npc/Adam.js';
import {Alex} from '../objects/npc/Alex.js';
import {Amelia} from '../objects/npc/Amelia.js';
import {Bob} from '../objects/npc/Bob.js';
import {Knight} from '../objects/npc/Knight.js';
import {OutdoorLevel1} from './OutdoorLevel1.js';
import {DrunkardWalkLevel} from './DrunkardWalkLevel.js';
import {TALKED_TO_A, TALKED_TO_B} from '../StoryFlags.js';

const DEFAULT_HERO_POSITION = new Vector2(gridCells(3), gridCells(3));
const OUTDOOR_EXIT = new Vector2(gridCells(3), gridCells(5));
const DRUNKWALK_EXIT = new Vector2(gridCells(3), gridCells(4));

export class CaveLevel1 extends Level {

	constructor(params={}) {
		super();
		this.params = params;
		this.background = new Sprite({
			resource: resources.images.cave,
			frameSize: new Vector2(320, 180)
		});

		const groundSprite = new Sprite({
			resource: resources.images.caveGround,
			frameSize: new Vector2(320, 180),
		});
		groundSprite.drawLayer = "FLOOR";
		this.addChild(groundSprite);

		this.addChild(new Exit(OUTDOOR_EXIT.x, OUTDOOR_EXIT.y));
		this.addChild(new Exit(DRUNKWALK_EXIT.x, DRUNKWALK_EXIT.y));

		const heroStart = params.heroPosition ?? DEFAULT_HERO_POSITION;

		const hero = new Hero(heroStart.x, heroStart.y);
		this.addChild(hero);

		const rod = new Rod(gridCells(7), gridCells(5));
		this.addChild(rod);

		const npc1 = new Bob(gridCells(5), gridCells(5), {
			content: [
				{
					string: "I just can't stand that guy",
					requires: [TALKED_TO_B],
					bypass: [TALKED_TO_A],
					addsFlag: TALKED_TO_A
				},
				{
					string: "He's just the worst!",
					requires: [TALKED_TO_A]
				},
				{
					string: "Grumble grumble. Another day at work.",
					requires: []
				},
			]
		});
		this.addChild(npc1);

		const npc2 = new Knight(gridCells(8), gridCells(5), {
			content: [
				{
					string: "What a wonderful day at work in the cave!",
					addsFlag: TALKED_TO_B
				},
			]
		});
		this.addChild(npc2);

		this.walls = new Set();
	}

	ready() {
		events.on("HERO_EXIT", this, (exit) => {
			if (exit.position.matches(OUTDOOR_EXIT)) {
				events.emit("CHANGE_LEVEL", new OutdoorLevel1({
					heroPosition: new Vector2(gridCells(7), gridCells(3))
				}));	
			}
			if (exit.position.matches(DRUNKWALK_EXIT)) {
				events.emit("CHANGE_LEVEL", new DrunkardWalkLevel({
					seed: Math.seed(Math.random()),
					maxSteps: 10
				}));	
			}
		});
	}
}