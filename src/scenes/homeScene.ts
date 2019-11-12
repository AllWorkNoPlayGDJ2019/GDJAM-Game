import * as PIXI from 'pixi.js'
import { AssetManager } from '../assetManager';
import { Clickable } from '../ui/clickable';
import { GameStats } from '../gameStats';
import { photoDisplay } from '../photoDisplay';
import { SceneManager } from './sceneManager';
import { CreateAudio } from '../createAudio';

export class homeScene implements gameScene {
    constructor(public readonly app: PIXI.Application,
        public readonly assetManager: AssetManager,
        public readonly gameStats: GameStats,
        public readonly sceneManager: SceneManager,
        public readonly photoDisplayer: photoDisplay) {
    }

    public showScene() {
        this.app.stage = new PIXI.Container();

        const background = new PIXI.Sprite(PIXI.Texture.WHITE);
        background.tint = 0x0000000;
        background.width = this.app.view.width;
        background.height = this.app.view.height;
        this.app.stage.addChild(background)

        const appWidth = this.app.view.width;
        const appHeight = this.app.view.height;

        const getSprite = (spriteSrc) => {
            return PIXI.Sprite.from(spriteSrc);
        };

        const home = getSprite(this.assetManager.Textures["homebackground"]);
        this.app.stage.addChild(home);
        home.position.set(0, 0);
        home.width = appWidth;
        home.height = appHeight;

        const style = new PIXI.TextStyle({
            "fill": "#000000",
            "fontFamily": "Courier New",
            "fontWeight": "bold",
            "fontSize": 48
        });
        const daysLeft = new PIXI.Text((5 - this.gameStats.gameStage).toString() + " WORK DAYS LEFT", style);
        this.app.stage.addChild(daysLeft);
        daysLeft.position.set(appWidth * 0.5 - daysLeft.width * 0.5, appHeight * 0.7);


        const moneyPocket = getSprite("redPocket");
        this.app.stage.addChild(moneyPocket);
        moneyPocket.pivot.set(moneyPocket.width / 2, moneyPocket.height / 2);
        moneyPocket.position.set(appWidth / 2, appHeight * 0.88);


        const moneyStyle = new PIXI.TextStyle({
            "fill": "#EEEE00",
            "fontFamily": "Courier New",
            "fontWeight": "bold",
            "fontSize": 32
        });
        const textBox = new PIXI.Text("money", moneyStyle);
        const currentMoney = this.gameStats.money;
        const currentGoal = 300; this.gameStats.moneyGoal;

        this.app.stage.addChild(textBox);
        textBox.position.set(appWidth / 2 - 0.5 * textBox.width, appHeight * 0.87);

        textBox.text = currentMoney.toFixed(1) + "/" + currentGoal + '¥';

        





        
        this.photoDisplayer.chooseAndDisplayPhoto();

        // Audio
        let roomAmbience = new CreateAudio("roomAmbience.mp3");
        roomAmbience.play();
        roomAmbience.loop();

        const exitSign = getSprite(this.assetManager.Textures["toWork"]);
        const exitButtonClickable = new Clickable(exitSign);
        exitButtonClickable.addCallback(() => {
            this.sceneManager.loadScene('factoryScene');
            roomAmbience.stop();
        });
        this.app.stage.addChild(exitSign);
        exitSign.position.set(appWidth - exitSign.width, 0);


    }

    public removeScene() {
        this.app.stage.removeChild(this.app.stage);
    }
}
