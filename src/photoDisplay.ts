import * as PIXI from 'pixi.js'
import { utilMath } from './utilMath';
import { AssetManager } from './assetManager';
import { GameStats } from './gameStats';
import { Clickable } from './ui/clickable';
import { Dragable } from './ui/dragable';
import { CreateAudio } from './createAudio';

export class photoDisplay {
    constructor(public readonly app: PIXI.Application,
        public readonly assetManager: AssetManager,
        public readonly gameStats: GameStats) {
    }

    private readonly photoSound = new CreateAudio("switch-5.mp3");     

    public chooseAndDisplayPhoto() {
        const todayStat = this.gameStats.daystatList[this.gameStats.gameStage];
        if (this.gameStats.childHappiness > todayStat.happinessGoal) {
            this.spawnPhoto(todayStat.goodPhoto);
        }
    }

    public spawnPhoto(assetName: string) {
        const photo = PIXI.Sprite.from(this.assetManager.Textures[assetName]);
        this.app.stage.addChild(photo);
        photo.position.set(this.app.view.width / 2, 0);
        photo.pivot.set(photo.width / 2, photo.height / 2);


        const dragBehaviour = new Dragable(photo);
        dragBehaviour.addStartCallback(()=>{
            this.photoSound.stop();
            this.photoSound.play();
        });

        const angleVariance = 0.9;
        const photoTargetPosition = new PIXI.Point(this.app.view.width / 2, this.app.view.height / 2);
        const photoTargetRotation = Math.random() * angleVariance - angleVariance / 2;

        const photoIntervalID = setInterval(() => {
            photo.position = utilMath.lerpPoint(photo.position, photoTargetPosition, 0.02);
            photo.rotation = utilMath.lerp(photo.rotation, photoTargetRotation, 0.015);

            if (photo.position === photoTargetPosition) {
                window.clearInterval(photoIntervalID);
            }
        }, 33)
    }

    public spawnClickablePrompt(assetName: string, callbacks: (() => void)[]) {
        const photo = PIXI.Sprite.from(this.assetManager.Textures[assetName]);
        this.app.stage.addChild(photo);
        const top = new PIXI.Point(this.app.view.width / 2, 0.0);
        const photoTargetPosition = new PIXI.Point(this.app.view.width / 2, this.app.view.height / 2);

        photo.position = top;
        photo.pivot.set(photo.width / 2, photo.height / 2);

        const clickableSprite = new Clickable(photo);

        // add callbacks from arguments
        callbacks.forEach((element) => {
            clickableSprite.addCallback(element);
        }
        );

        // appear
        const photoIntervalID = setInterval(() => {
            photo.position = utilMath.lerpPoint(photo.position, photoTargetPosition, 0.08);
            photo.alpha = utilMath.lerp(photo.alpha, 1.0, 0.05);
        }, 33);

        clickableSprite.addCallback(() => {
            window.clearInterval(photoIntervalID);
            // disappear
            const disappearID = setInterval(() => {
                photo.position = utilMath.lerpPoint(photo.position, top, 0.08);
                photo.alpha = utilMath.lerp(photo.alpha, 0.0, 0.05);

                if(photo.alpha < 0.1)
                {
                    photo.parent.removeChild(photo);
                    window.clearInterval(disappearID);
                }

            }, 33);

           //setTimeout(() => {
           //    window.clearInterval(disappearID);
           //    photo.parent.removeChild();
           //}, 2.0);
        });
    }
}