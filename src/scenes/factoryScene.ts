import * as PIXI from 'pixi.js'

export class factoryScene implements gameScene {
    constructor(public readonly app: PIXI.Application) {
    }

    public showScene() {
        this.app.stage = new PIXI.Container();
        const background = new PIXI.Sprite(PIXI.Texture.WHITE);
        background.tint=0x0000000;
        background.width = this.app.view.width;
        background.height = this.app.view.height;
        this.app.stage.addChild(background)
    }

}
