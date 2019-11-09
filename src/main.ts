import * as PIXI from 'pixi.js'
//import * as factory from './scenes/factory'
import { factoryScene } from "./scenes/factoryScene";
import { demoScene } from '../src/scenes/demoScene';
require('../assets/main.css');

console.log("works");
const app = new PIXI.Application({
    width: window.innerWidth, height: window.innerHeight,
    backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

const scenes = {
    factoryScene: new factoryScene(app),
    demoScene: new demoScene(app)
}

scenes.demoScene.showScene();