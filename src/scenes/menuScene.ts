import * as PIXI from 'pixi.js'
import { AssetManager } from '../assetManager';
import { Clickable } from '../ui/clickable';
import { SceneManager } from './sceneManager';
import { Hoverable } from '../ui/hoverable';

export class menuScene implements gameScene {
    constructor(public readonly app: PIXI.Application,
        public readonly assetManager: AssetManager,
        public readonly sceneManager: SceneManager) {
    }

    public showScene() {
        this.app.stage = new PIXI.Container();
        this.app.stage.filterArea = new PIXI.Rectangle(0, 0, this.app.view.width, this.app.view.height);

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

        const menu1 = getSprite(this.assetManager.Textures["startMenu"]);
        this.app.stage.addChild(menu1);
        menu1.position.set(0, 0);
        menu1.width = appWidth;
        menu1.height = appHeight;

        const playButton = getSprite(this.assetManager.Textures["playButton"]);
        const playButtonClickable = new Clickable(playButton);
        const playButtonHoverable = new Hoverable(playButton);
        playButtonHoverable.addMouseOverCallback(() => playButton.alpha = 0.5);
        playButtonHoverable.addMouseOutCallback(() => playButton.alpha = 1);

        playButtonClickable.addCallback(() => {
            this.sceneManager.loadScene('factoryScene');
            alert('click');
        });
        this.app.stage.addChild(playButton);
        console.log(playButton.width)
        playButton.position.set(appWidth / 2 - playButton.width / 2, appHeight / 2);
        playButton.scale.set(0.5,0.5);

    }

    public removeScene() {
        this.app.stage.removeChild(this.app.stage);
    }

}
