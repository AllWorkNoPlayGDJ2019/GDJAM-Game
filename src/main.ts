import * as PIXI from 'pixi.js'
import { factoryScene } from "./scenes/factoryScene";
import { demoScene } from '../src/scenes/demoScene';
import { AssetManager } from './assetManager';
import { GameStats } from './gameStats';
require('../assets/main.css');

const app = new PIXI.Application({
    width: window.innerWidth, height: window.innerHeight,
    backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

const gameStat = new GameStats();

const assetManager = new AssetManager();
assetManager.load().then(() => {
    const scenes = {
        factoryScene: new factoryScene(app, assetManager,gameStat),
        demoScene: new demoScene(app)
    }

    scenes.factoryScene.showScene();
});
//requestAnimationFrame( animate );
//
//function animate() {
//
//    requestAnimationFrame(animate);
//
//    // render the stage
//    app.renderer.render(app.stage);
//    //setTimeout(animate,1000/2);
//}