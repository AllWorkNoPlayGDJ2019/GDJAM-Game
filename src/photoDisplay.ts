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
        const selectedPhoto = (this.gameStats.accumulatedFreeHours > todayStat.happinessGoal) ?
            todayStat.goodPhoto : todayStat.badPhoto;
        this.gameStats.selectImage(selectedPhoto);
        this.spawnPhoto(selectedPhoto);
    }

    public spawnPhoto(assetName: string)  : PIXI.Sprite {
        const photo = PIXI.Sprite.from(this.assetManager.Textures[assetName]);
        this.app.stage.addChild(photo);
        photo.position.set(this.app.view.width / 2, 0);
        photo.pivot.set(photo.width / 2, photo.height / 2);
        photo.scale.x = 1.2;
        photo.scale.y = 1.2;

        const dragBehaviour = new Dragable(photo);
        dragBehaviour.addStartCallback(() => {
            photo.parent.setChildIndex(photo,photo.parent.children.length-1);
            this.photoSound.stop();
            this.photoSound.play();
        });

        const angleVariance = 0.9;
        const photoTargetPosition = new PIXI.Point(this.app.view.width / 2, this.app.view.height / 2);
        const photoTargetRotation = Math.random() * angleVariance - angleVariance / 2;

        const startTime = new Date().getTime();
        const photoIntervalID = setInterval(() => {
            const point =  utilMath.lerpPoint(photo.position, photoTargetPosition, 0.02);
            photo.position.set(point.x,point.y);
            photo.rotation = utilMath.lerp(photo.rotation, photoTargetRotation, 0.015);

            if (new Date().getTime() - startTime > 2000) {
                window.clearInterval(photoIntervalID);
            }
        }, 33)

        return photo;
    }

    public spawnPhotoDoubleSided(frontSideName: string, backSideName: string){
        const photo = PIXI.Sprite.from(this.assetManager.Textures[frontSideName]);
        this.app.stage.addChild(photo);
        photo.pivot.set(photo.width / 2, photo.height / 2);
        photo.position.set(this.app.view.width / 2, this.app.view.height/2);

        const angleVariance = 0.9;
        const photoTargetPosition = new PIXI.Point(this.app.view.width / 2, this.app.view.height / 2);
        const photoTargetRotation = Math.random() * angleVariance - angleVariance / 2;

        const startTime = new Date().getTime();
        
        const photoIntervalID = setInterval(() => {
            const point =  utilMath.lerpPoint(photo.position, photoTargetPosition, 0.02);
            photo.position.set(point.x,point.y);
            photo.rotation = utilMath.lerp(photo.rotation, photoTargetRotation, 0.015);

            if (new Date().getTime() - startTime > 2000) {
                window.clearInterval(photoIntervalID);
            }
        }, 33)


        const dragBehaviour = new Dragable(photo);
        dragBehaviour.addStartCallback(() => {
            this.photoSound.stop();
            this.photoSound.play();
        });

        // backside
        const backSide = PIXI.Sprite.from(this.assetManager.Textures[backSideName]);
        photo.addChild(backSide);
        //backSide.pivot.set(photo.width / 2, photo.height / 2);
        //backSide.position.set(this.app.view.width / 2, 0);
        backSide.visible = false;
        backSide.zIndex = 999999;

        const clickable = new Clickable(photo);
        clickable.addCallback(()=>
        {
            if(backSide.visible)
            {
                backSide.visible = false;
            } else 
            {
                backSide.visible = true;
            }
        });
    }

    public spawnClickablePrompt(assetName: string, callbacks: (() => void)[] = [])  : PIXI.Sprite{
        const photo = PIXI.Sprite.from(this.assetManager.Textures[assetName]);
        this.app.stage.addChild(photo);
        const top = new PIXI.Point(this.app.view.width / 2, 0.0);
        const photoTargetPosition = new PIXI.Point(this.app.view.width / 2, this.app.view.height / 2);

        photo.position.set(top.x,top.y);
        photo.pivot.set(photo.width / 2, photo.height / 2);

        const clickableSprite = new Clickable(photo);

        // add callbacks from arguments
        callbacks.forEach((element) => {
            clickableSprite.addCallback(element);
        }
        );

        // appear
        const photoIntervalID = setInterval(() => {
            const point = utilMath.lerpPoint(photo.position, photoTargetPosition, 0.08);
            photo.position.set(point.x,point.y);
            photo.alpha = utilMath.lerp(photo.alpha, 1.0, 0.05);
        }, 33);

        clickableSprite.addCallback(() => {
            window.clearInterval(photoIntervalID);
            // disappear
            const disappearID = setInterval(() => {
                const point =  utilMath.lerpPoint(photo.position, top, 0.08);
                photo.position.set(point.x,point.y);
                photo.alpha = utilMath.lerp(photo.alpha, 0.0, 0.05);

                if (photo.alpha < 0.1) {
                    photo.parent.removeChild(photo);
                    photo.destroy();
                    window.clearInterval(disappearID);
                }

            }, 33);

            //setTimeout(() => {
            //    window.clearInterval(disappearID);
            //    photo.parent.removeChild();
            //}, 2.0);
        });

        return photo;
    }
}