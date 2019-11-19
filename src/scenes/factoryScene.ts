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


    private isDisposing = false;
    private overtimeActive: boolean;
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
    public spriteAnim: number;

    private textBox: PIXI.Text;
    private box: PIXI.Sprite;

    private readonly getSprite = (spriteSrc) => {
        return PIXI.Sprite.from(spriteSrc);
    };
    private readonly getTexture = (textureSrc) => {
        return PIXI.Texture.from(textureSrc);
    }
    private stopWorkerAnimation = () => { };


    public showScene() {

        this.app.stage = new PIXI.Container();

        this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.background.tint = 0x0000000;
        this.background.width = this.app.view.width;
        this.background.height = this.app.view.height;
        this.app.stage.addChild(this.background)

        const appWidth = this.app.view.width;
        const appHeight = this.app.view.height;

        this.overtimeActive = false;


        const belt = this.getSprite(this.assetManager.Textures["factory"]);
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
        this.spawnAnimatedWorkers();

        const factorySprite = this.getSprite(this.assetManager.Textures["belt"]);

        factorySprite.width = appWidth;
        factorySprite.height = appHeight;
        const playButton = this.getSprite(this.assetManager.Textures["exitSign"]);
        const playButtonClickable = new Clickable(playButton);

        playButtonClickable.addCallback(() => {
            this.gameStats.finishDay(this.clock.getTime());
            this.sceneManager.loadScene('homeScene');
        });

        playButton.interactive = true;
        playButton.zIndex = Infinity;

        playButton.position.set(appWidth - playButton.width, 0.3 * appHeight);

        this.app.stage.addChild(playButton);
        this.app.stage.addChild(factorySprite);

        const moneyPocket = this.getSprite("redPocket");
        this.app.stage.addChild(moneyPocket);
        moneyPocket.pivot.set(moneyPocket.width / 2, moneyPocket.height / 2);
        moneyPocket.position.set(appWidth / 2, appHeight * 0.88);

        const moneyUpdater = () => {
            const currentMoney = this.gameStats.money;
            const currentGoal = 300; this.gameStats.moneyGoal;
            if (this.textBox === undefined) {
                const style = new PIXI.TextStyle({
                    "fill": "#EEEE00",
                    "fontFamily": "Courier New",
                    "fontWeight": "bold",
                    "fontSize": 32
                });
                this.textBox = new PIXI.Text("money", style);
                this.app.stage.addChild(this.textBox);
                this.textBox.position.set(appWidth / 2 - 0.5 * this.textBox.width, appHeight * 0.87);
            }
            this.textBox.text = currentMoney.toFixed(1) + "/" + currentGoal + '¥';
        };

        const moneyAnimation = () => {
            const addStyle = new PIXI.TextStyle(
                {
                    "fill": "#EEEE00",
                    "fontFamily": "Courier New",
                    "fontWeight": "bold"
                });


            const addMoneyBox = new PIXI.Text("+ ", addStyle);
            if (this.overtimeActive) {
                addMoneyBox.text += (this.gameStats.itemValue * 2).toString();
            } else {
                addMoneyBox.text += this.gameStats.itemValue.toString();
            }

            this.app.stage.addChild(addMoneyBox);
            addMoneyBox.position.set(this.textBox.position.x, this.textBox.position.y - this.textBox.height);


            const targetY = this.textBox.position.y - appHeight * 0.15;

            const startTime = new Date().getTime();
            const photoIntervalID = setInterval(() => {
                addMoneyBox.position.y = utilMath.lerp(addMoneyBox.position.y, targetY, 0.02);
                addMoneyBox.alpha = utilMath.lerp(addMoneyBox.alpha, 0.0, 0.02);

                if (new Date().getTime() - startTime > 200) {
                    window.clearInterval(photoIntervalID);
                    this.app.stage.removeChild(addMoneyBox)
                }
            }, 33)
        };

        moneyUpdater();

        this.box = this.getSprite(this.assetManager.Textures["box"]);
        this.box.scale.set(0.5, 0.5);
        this.box.pivot.set(this.box.width * 0.5, this.box.height * 0.5);
        this.box.position.set(appWidth - this.box.width, appHeight - 0.75 * this.box.height * 0.5);


        this.clock = new Clock(
            this.getSprite(this.assetManager.Textures["clockFace"]),
            this.getSprite(this.assetManager.Textures["clockHourPointer"]),
            this.getSprite(this.assetManager.Textures["clockMinutePointer"]), 0.5);

        this.clock.startClock();
        this.clock.addEndofDayCallbacks(() => this.stayAtWork());
        this.clock.addWorkEndCallback(() => this.overTimeBegins());
        this.clock.addWorkStartCallback(() => this.workBegins());

        this.app.stage.addChild(this.clock.mainContainer);
        this.clock.mainContainer.position.set(50, appHeight * 0.2);
        this.lightFilter.alpha = 0.5;

        const dollSize = 128;
        this.dollkeeper = new dollKeeper(
            this.app.stage,
            4,
            this.assetManager.Textures["doll"],
            new PIXI.Point(dollSize, dollSize),
            [new PIXI.Point(-220, appHeight * 0.75),
            new PIXI.Point(-180, appHeight * 0.775),
            new PIXI.Point(-140, appHeight * 0.8)],
            new PIXI.Point(appWidth, 0),
            200,
            new PIXI.Rectangle(this.box.position.x - this.box.pivot.x, this.box.position.y - this.box.pivot.y, this.box.width, this.box.height),
            () => {
                if (this.overtimeActive) {
                    this.gameStats.successfulOvertimeAction();
                } else {
                    this.gameStats.successfulAction();

                }
                moneyUpdater();
                moneyAnimation();
                this.boxAnimation();
            }
        );

        this.app.stage.addChildAt(this.box, this.app.stage.children.length);

    }


    private stayAtWork() {
        this.clock.stopClock();
        const intervalId = setInterval(() => {
            this.lightFilter.alpha -= 0.005;
            if (this.lightFilter.alpha <= 0.2) {
                window.clearInterval(intervalId);
                this.photoDisplayer.spawnClickablePrompt("overtime", [() => {
                    this.gameStats.finishDay(this.clock.getTime());
                    this.sceneManager.loadScene('homeScene');
                }]);
            }
        }, 20);

    }

    public spawnAnimatedWorkers() {
        const spriteAnimationNames = this.assetManager.animationSpriteNames;
        const spritePathsAnimations = spriteAnimationNames.map(spriteNames => spriteNames.map(this.getTexture));
        const animatedSprites = spritePathsAnimations.map(spritePathsAnimation =>
            new PIXI.AnimatedSprite(spritePathsAnimation));
        let playAnimation = true;
        animatedSprites.forEach(sprite => {
            this.app.stage.addChild(sprite);
            sprite.position.set(0, 0); // manual spacing fix
            sprite.width = this.app.view.width;
            sprite.height = this.app.view.height;
            sprite.gotoAndStop(1);
            const nextFrame = () => {
                if (playAnimation) {
                    sprite.gotoAndStop(Math.floor(sprite.totalFrames * 0.999 * Math.random()));
                    setTimeout(nextFrame, 300 + Math.random() * 300);
                }
            };
            nextFrame();
        });
        this.stopWorkerAnimation = () => playAnimation = false;
    }

    public removeScene() {
        console.log('removeScene');
        this.crowdSound.stop();
        this.conveyorSound.stop();
        this.clockSound.stop();
        this.stopWorkerAnimation();
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
        this.overtimeActive = false;
        this.lightSwitchSound.play();
        this.lightFilter.alpha = 1.0;

        this.clock.stopClock();
        this.photoDisplayer.spawnClickablePrompt("workBegins", [() => {
            setTimeout(() => {
                if (this.isDisposing === true) { return; }
                this.workBuzzerSound.play();
                this.dollkeeper.startSpawn();
                this.clock.startClock();
            }, 1000);

        }]);

    }

    public overTimeBegins() {
        this.overtimeActive = true;

        //play sound
        this.workBuzzerSound.play();
        this.crowdSound.stop();
        this.clock.stopClock();

        //spawn dialog box
        this.photoDisplayer.spawnClickablePrompt("workEnds", [() => {
            setTimeout(() => {
                if (this.isDisposing === true) { return; }
                this.lightFilter.alpha = 0.5;
                this.lightSwitchSound.play();
                this.clock.startClock();

            }, 1000);
        }]);
    }

    private boxAnimation() {
        const startTime = new Date().getTime();
        const interval = setInterval(() => {
            this.box.rotation = Math.random() * 0.1;

            if (new Date().getTime() - startTime > 200) {
                window.clearInterval(interval);
                this.box.rotation = 0;
            }
        }, 60)
    }
}
