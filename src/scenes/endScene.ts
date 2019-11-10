import * as PIXI from 'pixi.js'
import { AssetManager } from '../assetManager';
import { SceneManager } from './sceneManager';
import { GameStats } from '../gameStats';
import { Dragable } from '../ui/dragable';

export class endScene implements gameScene {
    constructor(public readonly app: PIXI.Application,
        public readonly assetManager: AssetManager,
        public readonly sceneManager: SceneManager,
        public readonly gameStats: GameStats) {
    }

    public showScene() {
        this.app.stage = new PIXI.Container();
        this.app.stage.filterArea = new PIXI.Rectangle(0, 0, this.app.view.width, this.app.view.height);

        const background = new PIXI.Sprite(PIXI.Texture.WHITE);
        background.tint = 0xc19a6b;
        background.width = this.app.view.width;
        background.height = this.app.view.height;
        this.app.stage.addChild(background)

        const appWidth = this.app.view.width;
        const appHeight = this.app.view.height;

        const getSprite = (spriteSrc) => {
            return PIXI.Sprite.from(spriteSrc);
        };

        const menu1 = getSprite(this.assetManager.Textures["endMenu"]);
        this.app.stage.addChild(menu1);
        menu1.position.set(0, 0);
        menu1.width = appWidth;
        menu1.height = appHeight;

        const images = this.gameStats.storyImages;
        images.forEach(image => {
            const imageSprite = getSprite(this.assetManager.Textures[image]);
            const imageSpriteDragable = new Dragable(imageSprite);
            imageSpriteDragable.addStartCallback(() => { });

            this.app.stage.addChild(imageSprite);
            imageSprite.position.set(
                0.2 * appWidth + Math.random() * 0.6 * appWidth,
                0.2 * appHeight + Math.random() * 0.6 * appHeight);
            imageSprite.scale.set(0.5, 0.5);
        });

    }

    public removeScene() {
        this.app.stage.removeChild(this.app.stage);
    }

}
