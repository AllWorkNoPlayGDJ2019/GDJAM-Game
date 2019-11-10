import * as PIXI from 'pixi.js'
import { Clock } from '../ui/clock';
import { AssetManager } from '../assetManager';
import { Clickable } from '../ui/clickable';
import { GameStats } from '../gameStats';
import { dollKeeper } from './dollKeeper';
import { SceneManager } from './sceneManager';
import { CreateAudio } from '../createAudio';


export class factoryScene implements gameScene {
    constructor(public readonly app: PIXI.Application,
        public readonly assetManager: AssetManager,
        private readonly sceneManager: SceneManager,
        public readonly gameStats: GameStats) {
    }

    public background;
    public belt;
    public beltContainer;
    public dollkeeper;
    
    public workBuzzerSound = new CreateAudio("workBuzzer.mp3");
    public lightSwitchSound = new CreateAudio("lightSwitch.mp3");
    public lightFilter = new PIXI.filters.AlphaFilter();

    public showScene() {
        
        this.app.stage = new PIXI.Container();
        this.app.stage.filterArea = new PIXI.Rectangle(0, 0, this.app.view.width, this.app.view.height);

        this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.background.tint = 0x0000000;
        this.background.width = this.app.view.width;
        this.background.height = this.app.view.height;
        this.app.stage.addChild(this.background)

        const appWidth = this.app.view.width;
        const appHeight = this.app.view.height;

        const getSprite = (spriteSrc) => {
            return PIXI.Sprite.from(spriteSrc);
        };




        const belt = getSprite(this.assetManager.Textures["beltbackground"]);
        this.app.stage.addChild(belt);
        this.beltContainer = new PIXI.Container();
        this.beltContainer.addChild(belt);
        belt.position.set(0, 0);
        belt.width = appWidth;
        belt.height = appHeight;
        this.app.stage.addChild(this.beltContainer);
        this.beltContainer.filters = [this.lightFilter];

        const factorySprite = getSprite(this.assetManager.Textures["belt"]);

        factorySprite.width = appWidth;
        factorySprite.height = appHeight;
        this.app.stage.addChild(factorySprite);
        const exitSign = getSprite(this.assetManager.Textures["exitSign"]);
        const exitButtonClickable = new Clickable(exitSign);
        exitButtonClickable.addCallback(() => {
            this.sceneManager.loadScene('home');
            this.gameStats.finishDay(clock.getTime());
        });
        exitSign.position.set(appWidth - exitSign.width, 0);
        this.app.stage.addChild(exitSign);

        const moneyUpdater = () => {
            const currentMoney = this.gameStats.money;
            const currentGoal = this.gameStats.moneyGoal;
            const textBox = new PIXI.Text(currentMoney + "/" + currentGoal, "white");
            this.app.stage.addChild(textBox);
            textBox.position.set(appWidth - exitSign.width - textBox.width, exitSign.height / 4);
        };

        const box = getSprite(this.assetManager.Textures["box"]);
        this.app.stage.addChild(box);
        box.scale.set(0.5, 0.5);
        box.position.set(appWidth - box.width, appHeight - box.height);


        const clock = new Clock(
            getSprite(this.assetManager.Textures["clockFace"]),
            getSprite(this.assetManager.Textures["clockHourPointer"]),
            getSprite(this.assetManager.Textures["clockMinutePointer"]), 0.5);


        clock.startClock(this.gameStats.currentDay);
        this.app.stage.addChild(clock.mainContainer);
        clock.mainContainer.position = new PIXI.Point(50, 50);

        this.dollkeeper = new dollKeeper(
            this.app.stage,
            4,
            this.assetManager.Textures["doll"],
            new PIXI.Point(128, 128),
            [new PIXI.Point(-10, 290),
            new PIXI.Point(-5, 300),
            new PIXI.Point(0, 310)],
            new PIXI.Point(appWidth, 0),
            200,
            new PIXI.Rectangle(appWidth - box.width, appHeight - box.height, box.width, box.height),
            () => { this.gameStats.successfulAction(); moneyUpdater(); }
        );
        


        this.workBegins();
        // test
        setTimeout(this.overTimeBegins, 10000);
    }

    public removeScene() {
        this.app.stage.removeChild(this.app.stage);
    }

    public workBegins()
    {
        this.lightSwitchSound.play();
        this.lightFilter.alpha = 0.5;

        setTimeout(() => {
            this.lightFilter.alpha = 1.0;
            this.workBuzzerSound.play();
            this.dollkeeper.startSpawn();
        },
        2000
        );
    }

    public overTimeBegins() {
        //play sound
        this.workBuzzerSound.play();

        setTimeout(() => {
            //dim lights

            this.lightFilter.alpha = 0.5;
            //this.beltContainer.AlphaFilter.alpha = 0.5;
            //play sound of lights turned off
            this.lightSwitchSound.play();
            //spawn dialog box
        },
        1000
        );
        //dim lights slowly
        //show work is over
        //show Overtime text
        //
    }
}
