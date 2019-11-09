import * as PIXI from 'pixi.js'
export class Dragable {
    constructor(private container: PIXI.Container,
        private sprite: PIXI.Sprite,
        private position: PIXI.Point) {
        this.sprite.position.set(this.position.x, this.position.y);
        this.sprite.interactive = true;
        this.sprite
            .on('mousedown', this.onDragStart)
            .on('touchstart', this.onDragStart)
            // events for drag end
            .on('mouseup', this.onDragEnd)
            .on('mouseupoutside', this.onDragEnd)
            .on('touchend', this.onDragEnd)
            .on('touchendoutside', this.onDragEnd)
            // events for drag move
            .on('mousemove', this.onDragMove)
            .on('touchmove', this.onDragMove);

        this.sprite.on

        this.container.addChild(sprite);
    }

    private data: PIXI.Point | any = null;
    private isDragging: boolean = false;
    onDragStart(eventData) {
        this.isDragging = true;
        this.data = eventData;
    }
    onDragEnd() {
        this.isDragging = false;
        this.data = null;

    }
    onDragMove() {
        if (this.isDragging) {
            var newPosition = this.sprite.parent;
            this.position.x = newPosition.x;
            this.position.y = newPosition.y;
        }
    }
}