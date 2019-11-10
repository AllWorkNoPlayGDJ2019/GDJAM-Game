import * as PIXI from 'pixi.js'
export class Hoverable {
    constructor(private sprite: PIXI.Sprite) {
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite
            .on('mouseover', ()=>this.mouseover())
            .on('touchstart',()=>this.mouseover())

            .on('mouseout',()=> this.mouseout())
            .on('touchend',()=> this.mouseout());
        this.mouseOutCallbacks = [];
        this.mouseOverCallbacks = [];
    }

    private readonly mouseOverCallbacks: (() => {})[];
    private readonly mouseOutCallbacks: (() => {})[];
    private mouseover() {
        this.mouseOverCallbacks.forEach(x => x());
    }
    private mouseout() {
        this.mouseOutCallbacks.forEach(x => x());
    }
    public addMouseOverCallback(callback: () => {}) {
        this.mouseOverCallbacks.push(callback);
    }
    public addMouseOutCallback(callback: () => {}) {
        this.mouseOutCallbacks.push(callback);
    }

}