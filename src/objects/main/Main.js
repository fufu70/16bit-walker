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

// 		setTimeout(() => {
// events.emit('SHOW_TEXTBOX', {
// 	portraitFrame: 0,
// 	addFlags: null,
// 	string: `But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?`
// });
// 		});

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