import {GameObject} from "./GameObject.js";

export class HudGameObject extends GameObject {
	addChild(child) {
		child.alwaysRender = true;
		super.addChild(child);
	}
}