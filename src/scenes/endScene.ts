import * as PIXI from 'pixi.js'
import { AssetManager } from '../assetManager';
import { SceneManager } from './sceneManager';
import { GameStats } from '../gameStats';
import { Dragable } from '../ui/dragable';
import { Clickable } from '../ui/clickable';
import { photoDisplay } from '../photoDisplay';

export class endScene implements gameScene {
    constructor(public readonly app: PIXI.Application,
        public readonly assetManager: AssetManager,
        public readonly sceneManager: SceneManager,
        public readonly gameStats: GameStats,
        private readonly photoDisplayer:photoDisplay) {
    }
    

    public showScene() {
        this.app.stage = new PIXI.Container();
        this.app.stage.filterArea = new PIXI.Rectangle(0, 0, this.app.view.width, this.app.view.height);

        const background = new PIXI.Sprite(this.assetManager.Textures["homebackground"]);
        background.tint = 0xc19a6b;
        background.width = this.app.view.width;
        background.height = this.app.view.height;
        this.app.stage.addChild(background)

        const appWidth = this.app.view.width;
        const appHeight = this.app.view.height;

        const getSprite = (spriteSrc) => {
            return PIXI.Sprite.from(spriteSrc);
        };
        const playButton = getSprite(this.assetManager.Textures["exitSign"]);
        const playButtonClickable = new Clickable(playButton);

        playButtonClickable.addCallback(() => {
            window.location.reload(true);
        });

        playButton.interactive = true;
        playButton.zIndex = Infinity;
        playButton.position.set(appWidth - playButton.width, appHeight-playButton.height);
        this.app.stage.addChild(playButton);

        const images = this.gameStats.storyImages;
        console.log(images);
        const money =this.gameStats.money;
        const happyness = this.gameStats.childHappiness;
        if(money>=300){
            this.photoDisplayer.spawnPhotoDoubleSided("day5Postcard", "day5PostcardText");
            this.gameStats.selectImage("day5University");
        }else if(money<=300&&happyness>=30){
            this.photoDisplayer.spawnPhoto("day5Factory");
        }else{
            this.photoDisplayer.spawnPhoto("day5Gone");
        }

        images.forEach(image => {
            const imageSprite = getSprite(this.assetManager.Textures[image]);
            const imageSpriteDragable = new Dragable(imageSprite);
            imageSpriteDragable.addStartCallback(() => {
                imageSprite.parent.setChildIndex(imageSprite,imageSprite.parent.children.length-1);
             });
            imageSprite.anchor.set(0.5,0.5);
            this.app.stage.addChild(imageSprite);
            imageSprite.rotation = Math.random()*Math.PI*0.25-Math.PI*0.125;
            imageSprite.position.set(
                0.2 * appWidth + Math.random() * 0.6 * appWidth - 0*imageSprite.width,
                0.2 * appHeight + Math.random() * 0.6 * appHeight - 0*imageSprite.height);
            imageSprite.scale.set(1, 1);
        });

    }

    public removeScene() {
        this.app.stage.removeChild(this.app.stage);
    }

}
