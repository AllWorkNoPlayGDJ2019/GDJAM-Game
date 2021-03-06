import { dayStats } from './dayStats'

export class GameStats {

    public readonly itemValue = 0.5;
    public money = 0;
    public accumulatedFreeHours = 0;
    public today = new Date();
    public gameStage = 0;
    public currentDay = new Date(1990, 5, 12, 5, 50, 0, 0);

    public get moneyGoal() {
        return this.daystatList[this.gameStage].moneyGoal;
    }


    public advanceDay() {
        this.currentDay.setDate(this.currentDay.getDate() + 1);
        this.currentDay.setHours(5, 50, 0, 0);
        console.log({ newTime: this.currentDay });
    }

    public successfulAction() {
        this.money += this.itemValue;
    }
    public successfulOvertimeAction() {
        this.money += this.itemValue * 2;
    }

    public finishDay(endTime: Date) {
        const freeHours = (24 - endTime.getUTCHours()) + (60 - endTime.getUTCMinutes()) / 60;
        this.accumulatedFreeHours+=freeHours;
        this.today.setDate(this.today.getDate() + 1);
        this.gameStage++;
    }

    day1: dayStats = {
        moneyGoal: 60,
        happinessGoal: 6,
        goodPhoto: "day1Happy",
        badPhoto: "day1Happy"
    };

    day2: dayStats = {
        moneyGoal: 60,
        happinessGoal: 12,
        goodPhoto: "day2Happy",
        badPhoto: "day2Sad"
    };

    day3: dayStats = {
        moneyGoal: 60,
        happinessGoal: 18,
        goodPhoto: "day3Happy",
        badPhoto: "day3Sad"
    };

    day4: dayStats = {
        moneyGoal: 60,
        happinessGoal: 24,
        goodPhoto: "day4Happy",
        badPhoto: "day4Sad"
    };

    public readonly storyImages: string[] = [];

    public selectImage(imageName: string) {
        console.log(imageName);
        this.storyImages.push(imageName);
    }

    public readonly daystatList = [
        this.day1,
        this.day1,
        this.day2,
        this.day3,
        this.day4
    ];
}