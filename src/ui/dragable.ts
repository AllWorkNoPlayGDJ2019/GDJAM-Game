import * as PIXI from 'pixi.js'
export class Dragable {
    constructor(private readonly sprite: PIXI.Sprite) {
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.dragStartCallbacks = [];
        this.dragEndCallbacks = [];
        this.sprite
            .on('mousedown', (data) => this.onDragStart(data))
            .on('touchstart', (data) => this.onDragStart(data))
            // events for drag end
            .on('mouseup', () => this.onDragEnd())
            .on('mouseupoutside', () => this.onDragEnd())
            .on('touchend', () => this.onDragEnd())
            .on('touchendoutside', () => this.onDragEnd())
            // events for drag move
            .on('mousemove', () => this.onDragMove())
            .on('touchmove', () => this.onDragMove());
    }

    private data: PIXI.Point | any = null;

    private readonly dragStartCallbacks: (() => void)[] = [];
    private readonly dragEndCallbacks: (() => void)[] = [];

    public addStartCallback(callback: () => void) {
        this.dragStartCallbacks.push(callback);

    }

    public addEndCallback(callback: () => void) {
        this.dragEndCallbacks.push(callback);
    }

    private onDragStart(eventData) {
        this.dragStartCallbacks.forEach(callback => callback());
        this.data = eventData.data;
    }
    private onDragEnd() {
        this.data = null;
        this.dragEndCallbacks.forEach(callback => callback());
    }
    private onDragMove() {
        if (this.data !== null) {
            console.log('move');
            const newPosition = this.data.getLocalPosition(this.sprite.parent);
            this.sprite.position.x = newPosition.x;
            this.sprite.position.y = newPosition.y;
        }
    }
}