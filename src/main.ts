import * as PIXI from 'pixi.js'
import { factoryScene } from "./scenes/factoryScene";
import { demoScene } from '../src/scenes/demoScene';
import { homeScene } from '../src/scenes/homeScene';
import { AssetManager } from './assetManager';
import { GameStats } from './gameStats';
import { photoDisplay } from './photoDisplay';
import { menuScene } from './scenes/menuScene';
import { SceneManager } from "./scenes/sceneManager";
import { endScene } from './scenes/endScene';
require('../assets/main.css');

const app = new PIXI.Application({
    width: window.innerWidth, height: window.innerHeight,
    backgroundColor: 0x0
});
app.resizeTo=window;
app.resize();
console.log([window.innerHeight,window.innerWidth,app.view]);
document.body.appendChild(app.view);
const gameStat = new GameStats();
const sceneManager = new SceneManager(gameStat);

const assetManager = new AssetManager();


const photoDisplayer = new photoDisplay(app, assetManager, gameStat);
const menuscene = new menuScene(app,assetManager,sceneManager, photoDisplayer);

assetManager.load().then(() => {
    sceneManager.scenes= {
        factoryScene: new factoryScene(app, assetManager, sceneManager,gameStat, photoDisplayer),
        demoScene: new demoScene(app),
        menuScene:menuscene,
        homeScene: new homeScene(app, assetManager, gameStat, sceneManager, photoDisplayer),
        endScene:new endScene(app,assetManager,sceneManager,gameStat,photoDisplayer)
    };
    sceneManager.loadScene("menuScene");
});
