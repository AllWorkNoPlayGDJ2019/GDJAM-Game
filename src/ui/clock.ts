import * as PIXI from 'pixi.js'

export class Clock {
    constructor(
        private readonly circleClock: PIXI.Sprite,
        private readonly hourPointer: PIXI.Sprite,
        private readonly minutePointer: PIXI.Sprite, private readonly scaleFactor: number) {

        this.workEndCallbacks = [];
        this.workStartCallback = [];

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

        this.time.setUTCHours(5, 50, 0, 0);

    }


    private workStartCallback: (() => void)[] = [];
    private workEndCallbacks: (() => void)[] = [];
    private endofDayCallbacks: (() => void)[] = [];

    public addWorkStartCallback(callback: () => void) {
        this.workStartCallback.push(callback);
    }

    public addWorkEndCallback(callback: () => void) {
        this.workEndCallbacks.push(callback);
    }

    public addEndofDayCallbacks(callback: () => void) {
        this.endofDayCallbacks.push(callback);
    }

    public removeEndofDayCallbacks(callback: () => void) {
        this.endofDayCallbacks = this.endofDayCallbacks.filter(x => x !== callback);
    }

    public removeStartofDayCallbacks(callback: () => void) {
        this.workStartCallback = this.workStartCallback.filter(x => x !== callback);
    }
    public removeWorkEndCallbacks(callback: () => void) {
        this.workEndCallbacks = this.workEndCallbacks.filter(x => x !== callback);
    }


    public readonly mainContainer: PIXI.Container;
    private time: Date = new Date();

    private timerId: number;
    public getTime() {
        return this.time;
    }

    public startClock() {
        console.log("started time");
        //this.time = startTime;
        this.timerId = window.setInterval(() => {
            this.time.setMinutes(this.time.getUTCMinutes() + 2, this.time.getSeconds() + 30);
           // console.log(this.time.getUTCHours() + ":" + this.time.getUTCMinutes());
            if (this.time.getUTCHours() == 6 && this.time.getUTCMinutes() == 0) {
                this.workStartCallback.forEach(x => x());
            }
            if (this.time.getUTCHours() == 18 && this.time.getUTCMinutes() == 0) {
                this.workEndCallbacks.forEach(x => x());
            }
            if (this.time.getUTCHours() == 23 && this.time.getUTCMinutes() == 55) {
                this.endofDayCallbacks.forEach(x => x());
            }
            this.displayTime(this.time.getUTCHours(), this.time.getUTCMinutes());
        }, 100);
    }
    public stopClock() {
        console.log("stopped time");
        window.clearInterval(this.timerId);
    }

    public displayTime(hour: number, minute: number) {
        const hourAngle = 2 * Math.PI * (hour % 12) / 12;
        const minuteAngle = 2 * Math.PI * ((minute) % 60) / 60;
        this.hourPointer.rotation = hourAngle;
        this.minutePointer.rotation = minuteAngle;
    }
}