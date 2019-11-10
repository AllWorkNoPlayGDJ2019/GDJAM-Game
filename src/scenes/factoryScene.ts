import * as PIXI from 'pixi.js'
import { Clock } from '../ui/clock';
import { AssetManager } from '../assetManager';
import { Clickable } from '../ui/clickable';
import { GameStats } from '../gameStats';
import { dollKeeper } from './dollKeeper';
import { SceneManager } from './sceneManager';


export class factoryScene implements gameScene {
    constructor(public readonly app: PIXI.Application,
        public readonly assetManager: AssetManager,
        private readonly sceneManager: SceneManager,
        public readonly gameStats: GameStats) {
    }

    private clock: Clock;

    private textBox: PIXI.Text;

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


        const belt = getSprite(this.assetManager.Textures["beltbackground"]);
        this.app.stage.addChild(belt);
        const beltContainer = new PIXI.Container();
        beltContainer.addChild(belt);
        belt.position.set(0, 0);
        belt.width = appWidth;
        belt.height = appHeight;
        this.app.stage.addChild(beltContainer);

        const factorySprite = getSprite(this.assetManager.Textures["belt"]);

        factorySprite.width = appWidth;
        factorySprite.height = appHeight;
        const playButton = getSprite(this.assetManager.Textures["exitSign"]);
        const playButtonClickable = new Clickable(playButton);

        playButtonClickable.addCallback(() => {
            this.sceneManager.loadScene('homeScene');
            this.gameStats.finishDay(this.clock.getTime());
            alert('click');
        });
        playButton.interactive = true;
        playButton.zIndex = Infinity;
        playButton.position.set(appWidth-playButton.width,0);
        this.app.stage.addChild(playButton);
        this.app.stage.addChild(factorySprite);
        

        const moneyUpdater = () => {
            const currentMoney = this.gameStats.money;
            const currentGoal = this.gameStats.moneyGoal;
            if (this.textBox === undefined) {
                const style = new PIXI.TextStyle({
                    "fill": "#d20000",
                    "fontFamily": "Courier New",
                    "fontWeight": "bold"
                });
                this.textBox = new PIXI.Text(currentMoney + "/" + currentGoal, style);
                this.app.stage.addChild(this.textBox);
                this.textBox.position.set(appWidth / 2 - 0.5 * this.textBox.width, appHeight*0.2);
            }
            this.textBox.text = currentMoney + "/" + currentGoal;
        };
        moneyUpdater();

        const box = getSprite(this.assetManager.Textures["box"]);
        box.scale.set(0.5, 0.5);
        box.position.set(appWidth - box.width, appHeight -0.75* box.height);


        this.clock = new Clock(
            getSprite(this.assetManager.Textures["clockFace"]),
            getSprite(this.assetManager.Textures["clockHourPointer"]),
            getSprite(this.assetManager.Textures["clockMinutePointer"]), 0.5);


        this.clock.startClock(this.gameStats.currentDay);
        this.app.stage.addChild(this.clock.mainContainer);
        this.clock.mainContainer.position = new PIXI.Point(50, 50);

        const dollSize = 128;
        const dollkeeper = new dollKeeper(
            this.app.stage,
            4,
            this.assetManager.Textures["doll"],
            new PIXI.Point(dollSize, dollSize),
            [new PIXI.Point(-100, appHeight * 0.75 -0.5* dollSize),
            new PIXI.Point(-80, appHeight * 0.775 - 0.5*dollSize),
            new PIXI.Point(-60, appHeight * 0.8 - 0.5*dollSize)],
            new PIXI.Point(appWidth, 0),
            200,
            new PIXI.Rectangle(appWidth - box.width, appHeight - box.height, box.width, box.height),
            () => { this.gameStats.successfulAction(); moneyUpdater(); }
        );
        dollkeeper.startSpawn();
        this.app.stage.addChildAt(box, this.app.stage.children.length);
        
    }

    public removeScene() {
        this.clock.stopClock();
        this.app.stage.removeChild(this.app.stage);
    }
}
