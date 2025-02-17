import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';
import {storyFlags} from '../../StoryFlags.js';


export class Npc extends GameObject {
	constructor(x, y, textConfig) {
		super({
			position: new Vector2(x, y)
		});

		// Opt into being solid
		this.isSolid = true;
		this.content = textConfig.content;
		this.portraitFrame = textConfig.portraitFrame;

		const shadow = new Sprite({
			resource: resources.images.shadow,
			frameSize: new Vector2(32, 32),
			position: new Vector2(-8, -19)
		});
		this.addChild(shadow);

		const body = new Sprite({
			resource: resources.images.knight,
			frameSize: new Vector2(32, 32),
			hFrames: 2,
			vFrames: 1,
			position: new Vector2(-8, -20)
		})
		this.addChild(body);
	}

	getContent() {
		// explain story logic
		const match = storyFlags.getRelevantScenario(this.content);
		if (!match) {
			console.warn("No matches found in this list!", this.content);
			return null;
		}

		return {
			portraitFrame: this.portraitFrame,
			string: match.string,
			addFlags: match.addsFlag ?? null
		}
	}
}