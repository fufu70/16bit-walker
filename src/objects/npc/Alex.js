import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {resources} from '../../Resources.js';
import {Npc} from './Npc.js';


export class Alex extends Npc {
	constructor(x, y, textConfig) {
		super(
			x, 
			y, 
			textConfig, 
			new Sprite({
				resource: resources.images.alex,
				frameSize: new Vector2(16, 32),
				hFrames: 24,
				vFrames: 7,
				frame: 3,
				position: new Vector2(0, -22)
			}),
			3
		);
	}
}