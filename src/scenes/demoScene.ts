import * as PIXI from 'pixi.js'
import { CreateAudio } from "../createAudio";

export class demoScene implements gameScene {
    constructor(public readonly app: PIXI.Application) {
    }

    public showScene() {
        const container = new PIXI.Container();

        this.app.stage.addChild(container);

        // Create a new texture
        const texture = PIXI.Texture.WHITE;

        // Create a 5x5 grid of bunnies
        for (let i = 0; i < 25; i++) {
            const bunny = new PIXI.Sprite(texture);
            bunny.anchor.set(0.5);
            bunny.x = (i % 5) * 40;
            bunny.y = Math.floor(i / 5) * 40;
            container.addChild(bunny);
        }

        // Move container to the center
        container.x = this.app.screen.width / 2;
        container.y = this.app.screen.height / 2;

        // Center bunny sprite in local container coordinates
        container.pivot.x = container.width / 2;
        container.pivot.y = container.height / 2;

        // Listen for animate update
        this.app.ticker.add((delta) => {
            // rotate the container!
            // use delta to create frame-independent transform
            container.rotation -= 0.01 * delta;
        });

        // Play audio
        const crowd = new CreateAudio("tone.mp3")
        crowd.play();
        crowd.loop();

    }
}