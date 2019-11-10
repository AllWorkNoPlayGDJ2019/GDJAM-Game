import * as PIXI from 'pixi.js'
export class Clickable {
    constructor(private sprite: PIXI.Sprite) {
        this.callbacks = [];
        this.sprite.interactive = true;
        this.sprite.on('mousedown', ()=> this.buttonClick());
        this.sprite.on('touchstart', ()=>this.buttonClick());
    }

    private callbacks: (() => void) [];
    private buttonClick() {
        this.callbacks.forEach(x => x());
    }
    public addCallback(callback: () => void) {
        this.callbacks.push(callback);
    }
}