import {DrunkOutdoorLevel} from './DrunkOutdoorLevel.js';
import {QuestionRod} from '../objects/rod/QuestionRod.js';
import {NpcFactory} from '../objects/npc/NpcFactory.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../helpers/Grid.js';
import {Vector2} from "../Vector2.js";
import {QUESTIONS} from './constants/CivicsQuestions.js';
import {QuestionsLevel} from './QuestionsLevel.js';
import {events} from '../Events.js';
import {resources} from '../Resources.js';

export class IntroductionLevel extends DrunkOutdoorLevel {
	constructor(params={}) {
		try {
			super({
				...params,
			});
			setTimeout(() => {
				events.emit("HERO_REQUESTS_ACTION", this.npc);
			}, 1000);
		} catch (e) {
			console.error(e);
		}
	}

	beforeGeneratingSprites() {
		this.placeNpc(this.params);
	}

	placeNpc(params) {
		console.log("FLOOR", this.floorPlan.toString().replaceAll("0", " "));
		const loc = this.caveExitPosition.duplicate();
		console.log(loc);
		loc.x += gridCells(2);
		loc.y += gridCells(-2);
		this.floorPlan = this.addFloorAroundPosition(loc, this.floorPlan);
		this.npc = NpcFactory.getRandom(loc, {
			content: this.getContent(params, this.questionsList)
		}, this.seed);
		this.addGameObject(this.npc);
	}

	getContent(params, questionsList) {
		return [
			{
				string: "Let's try and answer some questions ...  head down those stairs and we can begin.",
				requires: [`INTRODUCED_LEVEL ${params.levelTitle}`]
			},
			{
				string: `Welcome to the ${params.levelTitle} level! Go down the stairs and start exploring!`,
				requires: [],
				addsFlag: `INTRODUCED_LEVEL ${params.levelTitle}`
			},
		];
	}

	ready() {
		super.ready();
	}

	getNextLevel() {
		return undefined;
	}

	getHome() {
		return this.params.getLevel();
	}
}