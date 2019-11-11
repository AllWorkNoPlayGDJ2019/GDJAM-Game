import * as PIXI from 'pixi.js'
import { Clock } from '../ui/clock';
import { AssetManager } from '../assetManager';
import { Clickable } from '../ui/clickable';
import { GameStats } from '../gameStats';
import { dollKeeper } from './dollKeeper';
import { SceneManager } from './sceneManager';
import { CreateAudio } from '../createAudio';
import { photoDisplay } from '../photoDisplay';
import { utilMath } from '../utilMath';

export class factoryScene implements gameScene {
    constructor(public readonly app: PIXI.Application,
        public readonly assetManager: AssetManager,
        private readonly sceneManager: SceneManager,
        public readonly gameStats: GameStats,
        public readonly photoDisplayer: photoDisplay) {
    }




    public background: PIXI.Sprite;
    public belt: PIXI.Sprite;
    public beltContainer: PIXI.Container;
    public dollkeeper: dollKeeper;

    public clockSound = new CreateAudio("clock.mp3");
    public conveyorSound = new CreateAudio("conveyor.mp3");
    public workBuzzerSound = new CreateAudio("workBuzzer.mp3");
    public lightSwitchSound = new CreateAudio("lightSwitch.mp3");

   public crowdSound = new CreateAudio("crowd.mp3");

    public lightFilter = new PIXI.filters.AlphaFilter();
    private clock: Clock;
    public spriteAnim; 

    private textBox: PIXI.Text;

    public shadowSpritePaths1: string[] = [
        "assets/shadowWorkerFrames/shadowsA1.png",  // we're only using the first of each since animation not working, ie. A1, B1, C1
        "assets/shadowWorkerFrames/shadowsA2.png",
        "assets/shadowWorkerFrames/shadowsA3.png",
        "assets/shadowWorkerFrames/shadowsA4.png",
        "assets/shadowWorkerFrames/shadowsA5.png"
    ];

    public shadowSpritePaths2: string[] = [
        "assets/shadowWorkerFrames/shadowsB1.png",
        "assets/shadowWorkerFrames/shadowsB2.png",
        "assets/shadowWorkerFrames/shadowsB3.png",
        "assets/shadowWorkerFrames/shadowsB4.png",
        "assets/shadowWorkerFrames/shadowsB5.png"
    ];

    public shadowSpritePaths3: string[] = [
        "assets/shadowWorkerFrames/shadowsC1.png",
        "assets/shadowWorkerFrames/shadowsC2.png",
        "assets/shadowWorkerFrames/shadowsC3.png",
        "assets/shadowWorkerFrames/shadowsC4.png",
        "assets/shadowWorkerFrames/shadowsC5.png"
    ];

    public showScene() {

        this.app.stage = new PIXI.Container();

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

        // Play looping audios
        this.conveyorSound.play();
        this.conveyorSound.loop();
        this.clockSound.play();
        this.clockSound.loop();
        this.crowdSound.play();
        this.crowdSound.loop();

        // Spawn shadows
        this.spawnShadows(3);

        const factorySprite = getSprite(this.assetManager.Textures["belt"]);

        factorySprite.width = appWidth;
        factorySprite.height = appHeight;
        const playButton = getSprite(this.assetManager.Textures["exitSign"]);
        const playButtonClickable = new Clickable(playButton);

        playButtonClickable.addCallback(() => {
            this.gameStats.finishDay(this.clock.getTime());
            this.sceneManager.loadScene('homeScene');
        });

        playButton.interactive = true;
        playButton.zIndex = Infinity;
        playButton.position.set(appWidth-playButton.width,0);

        this.app.stage.addChild(playButton);
        this.app.stage.addChild(factorySprite);

        const moneyUpdater = () => {
            const currentMoney = this.gameStats.money;
            const currentGoal =300; this.gameStats.moneyGoal;
            if (this.textBox === undefined) {
                const style = new PIXI.TextStyle({
                    "fill": "#d20000",
                    "fontFamily": "Courier New",
                    "fontWeight": "bold"
                });
                this.textBox = new PIXI.Text(currentMoney + "/" + currentGoal, style);
                this.app.stage.addChild(this.textBox);
                this.textBox.position.set(appWidth / 2 - 0.5 * this.textBox.width, appHeight * 0.2);
            }
            this.textBox.text = currentMoney + "/" + currentGoal;
        };
        const moneyAnimation = () => {
            const addStyle = new PIXI.TextStyle(
                {
                    "fill": "#d20000",
                    "fontFamily": "Courier New",
                    "fontWeight": "bold"
                });
            const addMoneyBox = new PIXI.Text("+" + this.gameStats.itemValue.toString(),addStyle);
            this.app.stage.addChild(addMoneyBox);
            addMoneyBox.position.set(this.textBox.position.x - addMoneyBox.width, this.textBox.position.y + this.textBox.height);
            setTimeout(()=> this.app.stage.removeChild(addMoneyBox),100);
        };

        moneyUpdater();

        const box = getSprite(this.assetManager.Textures["box"]);
        box.scale.set(0.5, 0.5);
        box.position.set(appWidth - box.width, appHeight - 0.75 * box.height);

        this.clock = new Clock(
            getSprite(this.assetManager.Textures["clockFace"]),
            getSprite(this.assetManager.Textures["clockHourPointer"]),
            getSprite(this.assetManager.Textures["clockMinutePointer"]), 0.5);

        this.clock.startClock();
        this.clock.addEndofDayCallbacks(() => this.stayAtWork());
        this.clock.addWorkEndCallback(() => this.overTimeBegins());
        this.clock.addWorkStartCallback(() => this.workBegins());

        this.app.stage.addChild(this.clock.mainContainer);
        this.clock.mainContainer.position = new PIXI.Point(50, 50);
        this.lightFilter.alpha = 0.5;

      const dollSize = 128;
        this.dollkeeper = new dollKeeper(
            this.app.stage,
            4,
            this.assetManager.Textures["doll"],
            new PIXI.Point(dollSize, dollSize),
            [new PIXI.Point(-100, appHeight * 0.75 - 0.5 * dollSize),
            new PIXI.Point(-80, appHeight * 0.775 - 0.5 * dollSize),
            new PIXI.Point(-60, appHeight * 0.8 - 0.5 * dollSize)],
            new PIXI.Point(appWidth, 0),
            200,
            new PIXI.Rectangle(appWidth - box.width, appHeight - box.height, box.width, box.height),
            () => {
                this.gameStats.successfulAction();
                moneyUpdater();
                moneyAnimation();
            }
        );

        this.app.stage.addChildAt(box, this.app.stage.children.length);

    }


    private stayAtWork() {
        console.log("stay at factory");
        
        this.photoDisplayer.spawnClickablePrompt("overtime", [()=>{
            this.gameStats.finishDay(this.clock.getTime());
            this.sceneManager.loadScene('homeScene');
        }]
        );
    }

    public spawnShadows(rowCount: number) {

        for (let rows = rowCount; rows > 0; rows--) {
            let shadowSprite;
            if (rows === 1) {
                shadowSprite = PIXI.Sprite.from(this.shadowSpritePaths1[0]);
            } else if (rows === 2) {
                shadowSprite = PIXI.Sprite.from(this.shadowSpritePaths2[0]);
            } else {
                shadowSprite = PIXI.Sprite.from(this.shadowSpritePaths3[0]);
            }
            const shadowPos = shadowSprite.position;
            const shadowTarg = new PIXI.Point(0, 0);

            shadowSprite.position.set(0 - this.app.view.width, 0); // manual spacing fix
            shadowSprite.width = this.app.view.width;
            shadowSprite.height = this.app.view.height;

            this.app.stage.addChild(shadowSprite);



            let intervalCount = 0;
            const spriteID = setInterval(() => {
                intervalCount++;
                shadowSprite.position = utilMath.lerpPoint(shadowPos, shadowTarg, 0.03);
                if (shadowPos.position === shadowTarg || intervalCount >= 150) {
                    console.log("done");
                    window.clearInterval(spriteID);
                    this.animateWorkers(shadowSprite);
                }
            }, 33)

        }

    }

    public animateWorkers(shadowSprite :any) {
        let interval = 0;
        let direction = "up"; // workers move up and down while working, starting with up

        this.spriteAnim = setInterval(() => {
            interval = interval + 1;

            // switch directions each 5 animation frames
            if (interval > 5) { 
                interval = 0;
                if (direction === "up")
                    direction = "down";
                else if (direction === "down")
                    direction = "up";
            }
            
            // set lerp targets
            const shadowTargetUp = new PIXI.Point(0, 0 + this.app.view.height*0.03);
            const shadowTargetDown = new PIXI.Point(0, 0 - this.app.view.height*0.03);

            // move up or down
            if (direction === "up") {
                shadowSprite.position = utilMath.lerpPoint(shadowSprite.position, shadowTargetUp, 0.03);
            } else {
                shadowSprite.position = utilMath.lerpPoint(shadowSprite.position, shadowTargetDown, 0.03);
            }

        }, 100)
    }

    public removeScene() {
        this.crowdSound.stop();
        this.conveyorSound.stop();
        this.clockSound.stop();
        window.clearInterval(this.spriteAnim);
        this.clock.stopClock();
        this.app.stage.removeChild(this.app.stage);
        this.app.stage.removeChild(this.textBox);
        this.conveyorSound.stop();   // Stop audio
        this.clockSound.stop();
        this.textBox = undefined;

        this.clock.removeEndofDayCallbacks(() => this.stayAtWork());
        this.clock.removeWorkEndCallbacks(() => this.overTimeBegins());
        this.clock.removeStartofDayCallbacks(() => this.workBegins());
    }

    public workBegins() {
        this.clock.stopClock();
        this.lightSwitchSound.play();
        this.lightFilter.alpha = 1.0;
        this.clock.startClock();
        setTimeout(() => {
            this.workBuzzerSound.play();
            this.dollkeeper.startSpawn();
        }, 1000);
    }

    public overTimeBegins() {
        //play sound
        this.workBuzzerSound.play();
        this.crowdSound.stop();
        this.clock.stopClock();

        setTimeout(() => {
            //dim lights
            this.lightFilter.alpha = 0.5;
            this.lightSwitchSound.play();
            //spawn dialog box
            this.clock.startClock();
            //spawn dialog box
        }, 1000);
        //dim lights slowly
        //show work is over
        //show Overtime text
        //
    }
}
