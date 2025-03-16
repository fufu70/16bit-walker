import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {Typewriter} from '../../helpers/text/Typewriter.js';


export class Inventory extends GameObject {
	items = [];

	constructor() {
		super({
			position: new Vector2(0, 1)
		});
		this.drawLayer = "HUD";

		this.nextId = 0;
		this.items = [
			{
				id: -1,
				image: resources.images.rod,
				count: 1
			}
		];
		this.typewriter = new Typewriter({});

		this.renderInventory();
	}

	ready() {
		events.on("HERO_PICKS_UP_ITEM", this, data => {
			const item = this.findItem(data);
			if (item === undefined) {
				this.nextId += 1;
				this.items.push({
					id: this.nextId,
					image: data.image,
					count: 1
				});
			} else {
				this.incrementCount(item);
			}
			this.renderInventory();
		});

		events.on("HERO_LOSES_ITEM", this, data => {
			const item = this.findItem(data);
			this.removeFromInventory(item);
			this.renderInventory();
		});
	}

	addNewItem(data) {
		this.nextId += 1;
		this.items.push({
			id: this.nextId,
			image: data.image,
			count: 1
		});
	}

	findItem(data) {
		return this.items.find(item => data.image === item.image);
	}

	incrementCount(item) {
		item.count ++;
	}

	decrementCount(item) {
		item.count --;
	}

	renderInventory() {
		// remove the stale drawings
		this.children.forEach(child => child.destroy());

		// draw fresh from the latest version of the list
		let position = 0;
		this.items.forEach((item, index) => {

			const sprite = new Sprite({
				resource: item.image,
				position: new Vector2(position, 0)
			});
			if (item.count > 1) {
				this.addCountSprite(position, item);
			}
			
			position += 12;
			this.addChild(sprite);
		})
	}

	addCountSprite(position, item) {
		let cursorX = position + 12
		let cursorY = 6;
		let currentShowingIndex = 0;
		const words = this.typewriter.generateWords(item.count + "");
		words.forEach(word => {
			word.chars.forEach(char => {
				const {sprite, width} = char;

				const withCharOffset = cursorX - 5;
				const wordSprite = sprite.clone();
				wordSprite.position = new Vector2(withCharOffset, cursorY);
				this.addChild(wordSprite);
				cursorX += width;

				// plus 1px between character
				cursorX += 1;

				// Uptick
				currentShowingIndex += 1;
			});
			// Move the cursor over
			cursorX += 3;
		});
	}

	removeFromInventory(item) {
		if (item.count == 1) {
			this.items = this.items.filter(it => it.id !== item.id);
		} else {
			this.decrementCount(item);
		}
		this.renderInventory();
	}
}