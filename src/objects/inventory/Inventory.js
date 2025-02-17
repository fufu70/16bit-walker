import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';


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
				image: resources.images.rod
			}
		];

		this.renderInventory();
	}

	ready() {
		events.on("HERO_PICKS_UP_ITEM", this, data => {
			this.nextId += 1;
			this.items.push({
				id: this.nextId,
				image: data.image
			});
			this.renderInventory();
		});
	}

	renderInventory() {
		// remove the stale drawings
		this.children.forEach(child => child.destroy());

		// draw fresh from the latest version of the list
		this.items.forEach((item, index) => {

			const sprite = new Sprite({
				resource: item.image,
				position: new Vector2(index * 12, 0)
			});
			this.addChild(sprite);
		})
	}

	removeFromInventory(id) {
		this.items = this.items.filter(item => item.id !== id);
		this.renderInventory();
	}
}