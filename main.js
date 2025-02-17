import './style.css'
import {resources} from './src/Resources.js';
import {Sprite} from './src/Sprite.js';
import {Vector2} from './src/Vector2.js';
import {GameLoop} from './src/GameLoop.js';
import {Input, LEFT, RIGHT, UP, DOWN} from './src/Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from './src/helpers/Grid.js'
import {moveTowards} from './src/helpers/Move.js';
import {OutdoorLevel1} from './src/levels/OutdoorLevel1.js';
import {Hero} from './src/objects/hero/Hero.js';
import {Rod} from './src/objects/rod/Rod.js';
import {Exit} from './src/objects/exit/Exit.js';
import {Main} from './src/objects/main/Main.js';
import {Inventory} from './src/objects/inventory/Inventory.js';
import {Camera} from './src/objects/Camera.js';
import {GameObject} from './src/GameObject.js';
import {events} from './src/Events.js';
import * as Empty from './src/Math.js';

// grabbing the canvas to draw to
const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

// building the scene
const mainScene = new Main({
	position: new Vector2(0, 0)
});
mainScene.setLevel(new OutdoorLevel1());


const draw = () => {
	ctx.clearRect(0, 0, canvas.windows, canvas.height);
	mainScene.drawBackground(ctx);

	ctx.save();

	if (mainScene.camera) {
		// Offset by camera position
		ctx.translate(mainScene.camera.position.x, mainScene.camera.position.y);	
	}

	// Draw objects in the mounted scene
	mainScene.drawObjects(ctx);

	// restore the original state
	ctx.restore();

	mainScene.drawForeground(ctx);
}

const update = (delta) => {
	mainScene.stepEntry(delta, mainScene);
	mainScene.input?.update();
}

// Start the game
const gameLoop = new GameLoop(update, draw);
gameLoop.start();