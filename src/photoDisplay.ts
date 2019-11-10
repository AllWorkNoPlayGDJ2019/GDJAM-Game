import * as PIXI from 'pixi.js'
import { utilMath } from './utilMath';
import { AssetManager } from './assetManager';
import { GameStats } from './gameStats';

export class photoDisplay {
    constructor(public readonly app: PIXI.Application,
        public readonly assetManager: AssetManager,
        public readonly gameStats: GameStats) {
    }

    public chooseAndDisplayPhoto() {
        const todayStat = this.gameStats.daystatList[this.gameStats.gameStage];
        const selectedPhoto = (this.gameStats.childHappiness > todayStat.happinessGoal) ?
            todayStat.goodPhoto : todayStat.badPhoto;
        this.gameStats.selectImage(selectedPhoto);
        this.spawnPhoto(selectedPhoto);
    }

    public spawnPhoto(assetName: string) {

        const photo = PIXI.Sprite.from(this.assetManager.Textures[assetName]);
        this.app.stage.addChild(photo);
        photo.position.set(this.app.view.width / 2, 0);
        photo.pivot.set(photo.width / 2, photo.height / 2);

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
}