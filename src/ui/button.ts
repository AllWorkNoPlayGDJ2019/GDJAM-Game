import * as PIXI from 'pixi.js'
export class Button {
    constructor(private container: PIXI.Container,
        private sprite: PIXI.Sprite,
        private position: PIXI.Point) {
        this.sprite.position.set(this.position.x, this.position.y);
        this.sprite.interactive = true;
        this.sprite.on('mousedown', this.buttonClick);
        this.sprite.on('touchstart', this.buttonClick);
        this.container.addChild(sprite);
    }

    private callbacks: (() => {})[] = [];
    private buttonClick() {
        this.callbacks.forEach(x => x());
    }
    public addCallback(callback: () => {}) {
        this.callbacks.push(callback);
    }
}