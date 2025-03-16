import {DrunkardWalkLevel} from './DrunkardWalkLevel.js';
import {QuestionRod} from '../objects/rod/QuestionRod.js';
import {NpcFactory} from '../objects/npc/NpcFactory.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../helpers/Grid.js';
import {Vector2} from "../Vector2.js";
import {QUESTIONS} from './constants/CivicsQuestions.js';
import {OutdoorLevel1} from './OutdoorLevel1.js';
import {events} from '../Events.js';
import {resources} from '../Resources.js';

export class QuestionsLevel extends DrunkardWalkLevel {
	constructor(params={}) {
		try {
			super({
				...params,
				width: 20,
				height: 20,
				maxSteps: 10 * ((params.questions.length ?? 0)+ 4),
				showNextLevel: params.showNextLevel ?? false,
				rotationChanges: params.questions.length ?? 0,
				rooms: Math.max(Math.ceil(params.questions.length / 6), 1),
				roomParams: {
					stepSize: 3,
					maxSteps: 10,
					rotationChanges: 1,
				},
				// heroPosition: new Vector2(0, 0)
			});
			events.emit("HERO_REQUESTS_ACTION", this.npc);
		} catch (e) {
			console.error(e);
		}
	}

	beforeGeneratingSprites() {
		this.questionsList = this.params.questions ?? [...QUESTIONS];
		this.questionsListSize = this.questionsList.length;
		this.placeNpc(this.params);
	}

	placeNpc(params) {
		this.placeQuestionRod(this.findSpotOnFloor());
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

	placeQuestionRod(vector) {
		const question = this.getQuestion();
		if (question) {
			this.addChild(new QuestionRod({
				position: vector,
				config: question.config,
				inputType: question.inputType,
				answers: question.answers
			}));
		} else {
			this.addNextLevelExit();
		}
	}

	getContent(params, questionsList) {
		return [
			{
				stringFunc: () => {
					return this.getLevelStatus();
				},
				requires: [`INTRODUCED_LEVEL ${params.levelTitle}`]
			},
			{
				string: `Welcome to the ${params.levelTitle} level! I'm so excited to have you here. There's ${questionsList.length} questions to study from that are going to be on the test. Feel free to walk around and pickup the purple rods. Each rod holds a unique question, if answered correctly you get to keep the rod. Come to me anytime and ask me about your progress. Time to Study!`,
				requires: [],
				addsFlag: `INTRODUCED_LEVEL ${params.levelTitle}`
			},
		];
	}

	getLevelStatus() {
		const amountCorrect = (this.questionsListSize - this.questionsList.length);
		const percent = ((this.questionsListSize - this.questionsList.length) / this.questionsListSize).toFixed(2);

		if (percent == 0) {
			return "Let's try and pickup a purple rod to start studying ...";
		}

		if (percent == 1) {
			return `You've done it! You've learned everything about the ${this.levelTitle} level. Time to go down the stairs to the next level!`;
		}

		let encouragement = "Baby Steps!";
		if (percent > 0.3 && percent < 0.5) {
			encouragement = "That's Great! Keep studying!";
		} else if (percent > 0.5 && percent < 0.7) {
			encouragement = `Mount Everest takes 58,070 steps. You've only taken 02`;
		} else if (percent > 0.7 && percent < 1.0) {
			encouragement = `Holy Mackeral!`;
		}

		return `You've answered ${amountCorrect} question${amountCorrect > 1 ? 's' : ''} so far. ${encouragement} Only ${this.questionsList.length} question${this.questionsList.length > 1 ? 's' : 0} left!`;
	}

	ready() {
		super.ready();
		events.on("HERO_ANSWERED_CORRECTLY", this, (question) => {
			// remove question from list
			this.questionsList = this.questionsList.filter(q => {
				return q.config.string !== question
			});
			this.placeQuestionRod(this.findRandomSpot(this.seed, this.floors, this.gameObjects));
		});

		events.on("HERO_ANSWERED_INCORRECTLY", this, (question) => {
			events.emit("HERO_LOSES_ITEM", {
				image: resources.images.rod
			});
			this.placeQuestionRod(this.findRandomSpot(this.seed, this.floors, this.gameObjects));
		});
	}

	getHome() {
		if (typeof this.params.previousLevel === 'function') {
			return this.params.previousLevel();
		}
		if (typeof this.params.previousLevel ===  'object') {
			return this.params.previousLevel;
		}
		return new OutdoorLevel1({
			heroPosition: new Vector2(gridCells(4), gridCells(6))
		});
	}

	getNextLevel() {
		if (typeof this.params.nextLevel === 'function') {
			return this.params.nextLevel();
		}
		if (typeof this.params.nextLevel ===  'object') {
			return this.params.nextLevel;
		}
		return new QuestionsLevel({
			seed: this.params.seed
		});
	}

	getQuestion() {
		return this.questionsList[Math.floor(this.params.seed() * this.questionsList.length)];
	}
}