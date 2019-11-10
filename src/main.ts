import * as PIXI from 'pixi.js'
import { factoryScene } from "./scenes/factoryScene";
import { demoScene } from '../src/scenes/demoScene';
import { homeScene } from '../src/scenes/homeScene';
import { AssetManager } from './assetManager';
import { GameStats } from './gameStats';
import { photoDisplay } from './photoDisplay';
require('../assets/main.css');

const app = new PIXI.Application({
    width: window.innerWidth, height: window.innerHeight,
    backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);


const gameStat = new GameStats();

const assetManager = new AssetManager();
const photoDisplayer = new photoDisplay(app, assetManager, gameStat);
assetManager.load().then(() => {
    const scenes = {
        factoryScene: new factoryScene(app, assetManager, gameStat),
        demoScene: new demoScene(app),
        homeScene: new homeScene(app, assetManager, gameStat, photoDisplayer)
    }
    scenes.homeScene.showScene();
    //scenes.factoryScene.showScene();
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