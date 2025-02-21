import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {Inventory} from '../inventory/Inventory.js';
import {Camera} from '../Camera.js'
import {SpriteTextString} from '../textbox/SpriteTextString.js'
import {storyFlags} from '../../StoryFlags.js';
import {TextInput} from '../input/TextInput.js';
import {SelectInput} from '../input/SelectInput.js';

export class Main extends GameObject {
	constructor() {
		super({});
		this.level = null;
		this.input = new Input();
		this.camera = new Camera();
	}

	ready() {

		const inventory = new Inventory();		
		this.addChild(inventory);

		events.on("HERO_REQUESTS_ACTION", this, (withObject) => {

			if (typeof withObject.getContent !== "function") {
				return;
			}

			const content = withObject.getContent();
			if (!content) {
				return;
			}

			// Potentially add a story flag
 
			if (content.addFlags) {
				console.log("Add FLAG", content.addFlags);
				storyFlags.add(content.addFlags);
			}

			const textbox = new SpriteTextString({
				portraitFrame: content.portraitFrame,
				string: content.string
			});

			this.addChild(textbox);

			const endingSub = events.on("END_TEXT_BOX", this, () => {
				textbox.destroy();
				events.off(endingSub);
			});
		});

		events.on("SHOW_TEXTBOX", this, (content) => {

			// Potentially add a story flag
 
			if (content.addFlags) {
				console.log("Add FLAG", content.addFlags);
				storyFlags.add(content.addFlags);
			}

			const textbox = new SpriteTextString({
				portraitFrame: content.portraitFrame,
				string: content.string
			});

			this.addChild(textbox);

			const endingSub = events.on("END_TEXT_BOX", this, () => {
				textbox.destroy();
				events.off(endingSub);
				if (typeof content.onEnd === "function") {
					content.onEnd();
				}
			});
		});

		events.on("CHANGE_LEVEL", this, newLevelInstance => {
			this.setLevel(newLevelInstance);
		});

		events.on("TEXT_INPUT", this, config => {
			// const textInput = new SelectInput(config);
			const textInput = new TextInput(config);
			this.addChild(textInput);

			const endingDecideSub = events.on("DECIDE_INPUT_TEXT", this, (text) => {
				events.emit("SUBMIT_INPUT_TEXT", text);
				textInput.destroy();
				events.off(endingDecideSub);
			});

			const endingCancelSub = events.on("CANCEL_INPUT_TEXT", this, () => {
				textInput.destroy();
				events.off(endingCancelSub);
			});
		});


		events.on("SELECT_INPUT", this, config => {
			const textInput = new SelectInput(config);
			this.addChild(textInput);

			const endingDecideSub = events.on("DECIDE_INPUT_TEXT", this, (text) => {
				events.emit("SUBMIT_INPUT_TEXT", text);
				textInput.destroy();
				events.off(endingDecideSub);
			});

			const endingCancelSub = events.on("CANCEL_INPUT_TEXT", this, () => {
				textInput.destroy();
				events.off(endingCancelSub);
			});
		});

		// setTimeout(() => {
		// 	events.emit("TEXT_INPUT", {
		// 		string: "What's your name?",
		// 	});
		// })

		// setTimeout(() => {
		// 	events.emit("SELECT_INPUT", {
		// 		string: "What's your name?",
		// 		options: ["Steve", "john", "Red", "Bob", "Matt", "Jerry", "Terry",
		// 			"Lteve", "Eohn", "Ted", "Uob", "Hatt", "Ferry", "ATerry"]
		// 	});
		// })
	}

	setLevel(newLevelInstance) {
		if (this.level) {
			this.level.destroy();
		}

		this.level = newLevelInstance;
		this.addChild(this.level);
	}

	drawBackground(ctx) {
		this.level?.background.drawImage(ctx, 0, 0);
	}

	drawObjects(ctx) {
		this.children.forEach(child => {
			if (child.drawLayer !== "HUD") {
				child.draw(ctx, 0,0);
			}
		});
	}

	drawForeground(ctx) {
		this.children.forEach(child => {
			if (child.drawLayer === "HUD") {
				child.draw(ctx, 0,0);
			}
		})

		// this.inventory.draw(ctx, this.inventory.position.x, this.inventory.position.y);
		// this.textbox.draw(ctx, 0, 0);
	}
}