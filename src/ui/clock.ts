import * as PIXI from 'pixi.js'

export class Clock {
    constructor(
        private readonly circleClock: PIXI.Sprite,
        private readonly hourPointer: PIXI.Sprite,
        private readonly minutePointer: PIXI.Sprite, private readonly scaleFactor: number) {
        this.mainContainer = new PIXI.Container();
        this.mainContainer.addChild(this.circleClock);
        this.mainContainer.addChild(this.hourPointer);
        this.mainContainer.addChild(this.minutePointer);

        this.circleClock.scale.set(this.scaleFactor, this.scaleFactor);

        this.hourPointer.pivot.set(this.hourPointer.width / 2, this.hourPointer.height / 2);
        this.hourPointer.position.set(this.scaleFactor * this.hourPointer.width / 2, this.scaleFactor * this.hourPointer.height / 2);
        this.hourPointer.scale.set(this.scaleFactor, this.scaleFactor);

        this.minutePointer.pivot.set(this.minutePointer.width / 2, this.minutePointer.height / 2);
        this.minutePointer.position.set(this.scaleFactor * this.minutePointer.width / 2, this.scaleFactor * this.minutePointer.height / 2);
        this.minutePointer.scale.set(this.scaleFactor, this.scaleFactor);
    }


    public readonly mainContainer: PIXI.Container;
    private time: Date = new Date();

    private timerId: number;
    public getTime() {
        return this.time;
    }

    public startClock(startTime:Date) {
        this.time = startTime;
        window.setInterval(() => {
            this.time.setMinutes(this.time.getMinutes() + 5);
            this.displayTime(this.time.getHours(), this.time.getMinutes());
        }, 1000);
    }
    public stopClock() {
        window.clearInterval(this.timerId);
    }

    public displayTime(hour: number, minute: number) {
        const hourAngle = 2 * Math.PI * (hour % 12) / 12;
        const minuteAngle = 2 * Math.PI * ((minute) % 60) / 60;
        this.hourPointer.rotation = hourAngle;
        this.minutePointer.rotation = minuteAngle;
        console.log(hour, minute);
    }
}