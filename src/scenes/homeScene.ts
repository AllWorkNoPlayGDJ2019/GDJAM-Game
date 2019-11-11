import * as PIXI from 'pixi.js'
import { AssetManager } from '../assetManager';
import { Clickable } from '../ui/clickable';
import { GameStats } from '../gameStats';
import { photoDisplay } from '../photoDisplay';
import { SceneManager } from './sceneManager';
import { CreateAudio } from '../createAudio';

export class homeScene implements gameScene {
    constructor(public readonly app: PIXI.Application,
        public readonly assetManager: AssetManager,
        public readonly gameStats: GameStats,
        public readonly sceneManager: SceneManager,
        public readonly photoDisplayer: photoDisplay) {
    }

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

        const home = getSprite(this.assetManager.Textures["homebackground"]);
        this.app.stage.addChild(home);
        home.position.set(0, 0);
        home.width = appWidth;
        home.height = appHeight;

   /*     this.photoDisplayer.spawnClickablePrompt("textBoxSample", [
            () => {
                const exitSign = PIXI.Sprite.from(this.assetManager.Textures["exitSign"]);
                const exitButtonClickable = new Clickable(exitSign);
                exitButtonClickable.addCallback(() => {
                    this.sceneManager.loadScene('factoryScene');
                });
                this.app.stage.addChild(exitSign);
                exitSign.position.set(this.app.view.width - exitSign.width, 0);

                // spawn photo
                this.photoDisplayer.chooseAndDisplayPhoto()
            }
        ]);
      */
        
      
      
      
      
      this.photoDisplayer.chooseAndDisplayPhoto();
//this.photoDisplayer.spawnPhoto("day5PostcardText");

        //this.photoDisplayer.spawnPhotoDoubleSided("day5Postcard", "day5PostcardText");

        // Audio
        let roomAmbience = new CreateAudio("roomAmbience.mp3");
        roomAmbience.play();
        roomAmbience.loop();

        const exitSign = getSprite(this.assetManager.Textures["toWork"]);
        const exitButtonClickable = new Clickable(exitSign);
        exitButtonClickable.addCallback(() => {
            this.sceneManager.loadScene('factoryScene');
            roomAmbience.stop();
        });
        this.app.stage.addChild(exitSign);
        exitSign.position.set(appWidth - exitSign.width, 0);


    }

    public removeScene() {
        this.app.stage.removeChild(this.app.stage);
    }
}
