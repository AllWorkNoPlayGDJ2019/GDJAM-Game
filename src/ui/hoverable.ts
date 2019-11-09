import * as PIXI from 'pixi.js'
export class Hoverable {
    constructor(private container: PIXI.Container,
        private sprite: PIXI.Sprite,
        private position: PIXI.Point) {
        this.sprite.position.set(this.position.x, this.position.y);
        this.sprite.interactive = true;
        this.sprite
            .on('mouseover', this.mouseover)
            .on('touchstart', this.mouseover)

            .on('mouseout', this.mouseout)
            .on('touchend', this.mouseout);
        this.container.addChild(sprite);
    }

    private mouseOverCallbacks: (() => {})[] = [];
    private mouseOutCallbacks: (() => {})[] = [];
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