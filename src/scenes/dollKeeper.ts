import * as PIXI from "pixi.js";
import { Dragable } from "../ui/dragable";
import { doll } from "./doll";
import { CreateAudio } from '../createAudio';

export class dollKeeper {
    constructor(
        private readonly parent: PIXI.Container,
        private readonly moveSpeed: number,
        private readonly dollTexture: PIXI.Texture,
        private readonly dollSize: PIXI.Point,
        private readonly spawnPoints: PIXI.Point[],
        private readonly killPoint: PIXI.Point,
        private readonly spawnInterval: number,
        private readonly successArea: PIXI.Rectangle,
        private readonly successAction: () => void
    ) {

    }

    public dolls: doll[] = [];
    private intervalId;
    public startSpawn() {
        window.setInterval(() => this.spawnDoll(), this.spawnInterval);
        window.setInterval(() => this.updateDolls(), 20);
    }
    public stopSpawn() {
        window.clearInterval(this.intervalId);
    }
    private spawnDoll() {
        const getSprite = (spriteSrc) => {
            return PIXI.Sprite.from(spriteSrc);
        };
        const getNext = () => {
            const next = this.spawnPoints.shift();
            this.spawnPoints.push(next);
            return next;
        }
        const dollSprite = getSprite(this.dollTexture);
        dollSprite.pivot.set(dollSprite.width / 2, dollSprite.height);
        if (Math.random() > 0.2) {
            dollSprite.rotation = Math.PI * 0.5 * Math.random();
        }
        this.parent.addChildAt(dollSprite, this.parent.children.length - 1);

        const nextPos = getNext();
        const dollObj = new doll(
            dollSprite,
            true,
            this.parent,
            (doll) => this.dolls = this.dolls.filter(x => x !== doll)
        );
        dollObj.move(new PIXI.Point(dollSprite.position.x, dollSprite.position.y));
        this.dolls.push(dollObj);

        const dropSound = new CreateAudio("drop-item.mp3")

        const draggable = new Dragable(dollSprite);
        draggable.addStartCallback(() => { dollObj.interruptMovement(); console.log('callback') });
        draggable.addEndCallback(() => {
            const pos = dollSprite.position;
            if (this.successArea.contains(pos.x, pos.y)) {
                this.successAction();
                dropSound.play();
            }
            dollObj.kill();
        });

        dollSprite.width = this.dollSize.x;
        dollSprite.height = this.dollSize.y;
        dollSprite.position.set(nextPos.x, nextPos.y);
    }

    updateDolls() {
        for (let doll of this.dolls.filter(doll => doll.isBeltMovable === true)) {
            doll.move(new PIXI.Point(doll.getPosition().x + this.moveSpeed, doll.getPosition().y));
            if (doll.getPosition().x > this.killPoint.x) {
                doll.kill();
            }
        }
    }
}

