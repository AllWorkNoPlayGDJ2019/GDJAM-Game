export class doll {
    constructor(
        public sprite: PIXI.Sprite,
        public isBeltMovable: boolean,
        public parent: PIXI.Container,
        private readonly dollKilled: (me: doll) => void
    ) { }
    kill() {
        this.parent.removeChild(this.sprite);
        this.dollKilled(this);
    }
    move(position: PIXI.Point) {
        if (this.isBeltMovable===true) {
            this.sprite.position.set(position.x, position.y);
        }
    }
    interruptMovement() {
        this.isBeltMovable = false;
        console.log('interrupted');
    }
    getPosition() {
        return this.sprite.position;
    }
}