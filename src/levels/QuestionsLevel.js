import {DrunkardWalkLevel} from './DrunkardWalkLevel.js';
import {QuestionRod} from '../objects/rod/QuestionRod.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../helpers/Grid.js';
import {Vector2} from "../Vector2.js";
import {QUESTIONS} from './constants/CivicsQuestions.js';
import {OutdoorLevel1} from './OutdoorLevel1.js';
import {events} from '../Events.js';

export class QuestionsLevel extends DrunkardWalkLevel {
	constructor(params={}) {
		try {
			super({
				...params,
				width: 100,
				height: 100,
				maxSteps: 50 + ((params.questions.length ?? 0)+ 4),
				showNextLevel: params.showNextLevel ?? false
			});
			this.questionsList = params.questions ?? [...QUESTIONS];
			this.placeQuestionRod(this.findRandomSpot(this.seed, this.floors, this.gameObjects));
		} catch (e) {
			console.error(e);	
		}
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