import * as PIXI from 'pixi.js'
import { Clock } from '../ui/clock';
import { AssetManager } from '../assetManager';
import { Clickable } from '../ui/clickable';
import { GameStats } from '../gameStats';


export class factoryScene implements gameScene {
    constructor(public readonly app: PIXI.Application,
        public readonly assetManager: AssetManager,
        public readonly gameStats:GameStats) {
    }

    public showScene() {
        this.app.stage = new PIXI.Container();
        this.app.stage.filterArea = new PIXI.Rectangle(0, 0, this.app.view.width, this.app.view.height);
        
        const background = new PIXI.Sprite(PIXI.Texture.WHITE);
        background.tint = 0x0000000;
        background.width = this.app.view.width;
        background.height = this.app.view.height;
        this.app.stage.addChild(background)
        
        
        const getSprite = (spriteSrc) => {
            return PIXI.Sprite.from(spriteSrc);
        };
        const factorySprite = getSprite(this.assetManager.Textures["belt"]);

        const appWidth = this.app.view.width;
        const appHeight = this.app.view.height;
        
        factorySprite.width = appWidth;
        factorySprite.height = appHeight;
        const belt = getSprite(this.assetManager.Textures["beltbackground"]);
        this.app.stage.addChild(belt);
        const beltContainer = new PIXI.Container();
        beltContainer.addChild(belt);
        belt.position.set(0,0);
        belt.width = appWidth;
        belt.height =appHeight;
        this.app.stage.addChild(beltContainer);
        this.app.stage.addChild(factorySprite);
        beltContainer.filters = [new PIXI.filters.AlphaFilter(0.5)];

        const exitSign = getSprite(this.assetManager.Textures["exitSign"]);
        const exitButtonClickable = new Clickable(exitSign);
        exitButtonClickable.addCallback(()=>alert('click'));
        exitSign.position.set(appWidth-exitSign.width,0);
        this.app.stage.addChild(exitSign);
        
        const currentMoney = this.gameStats.money;
        const currentGoal = this.gameStats.moneyGoal;
        const textBox = new PIXI.Text(currentMoney+"/"+currentGoal,"white");
        this.app.stage.addChild(textBox);
        
        textBox.position.set(appWidth-exitSign.width-textBox.width,exitSign.height/4);


        const clock = new Clock(
            getSprite(this.assetManager.Textures["clockFace"]),
            getSprite(this.assetManager.Textures["clockHourPointer"]),
            getSprite(this.assetManager.Textures["clockMinutePointer"]),0.5);
        clock.startClock();
        this.app.stage.addChild(clock.mainContainer);
        clock.mainContainer.position = new PIXI.Point(50, 50);

        




    }

}
