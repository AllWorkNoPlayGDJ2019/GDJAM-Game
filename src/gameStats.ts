import { dayStats } from './dayStats'

export class GameStats {

    public readonly itemValue = 0.5;
    public money = 0;
    public childHappiness = 0;
    public today = new Date();
    public gameStage = 0;
    public currentDay = new Date(1990, 5, 12, 5, 50, 0, 0);

    public moneyGoal = 100;


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
        if (endTime.getUTCHours() >= 22) {
            this.childHappiness -= 10;
        }
        else {
            this.childHappiness += (24 - endTime.getUTCHours());
        }
        this.today.setDate(this.today.getDate() + 1);
        this.gameStage++;
    }

    day1: dayStats = {
        moneyGoal: 50,
        happinessGoal: 8,
        goodPhoto: "kidElementarySchoolGood",
        badPhoto: "kidMiddleSchoolBad"
    };

    day2: dayStats = {
        moneyGoal: 100,
        happinessGoal: 16,
        goodPhoto: "kidElementarySchoolGood",
        badPhoto: "kidMiddleSchoolBad"
    };

    day3: dayStats = {
        moneyGoal: 200,
        happinessGoal: 32,
        goodPhoto: "kidElementarySchoolGood",
        badPhoto: "kidMiddleSchoolBad"
    };

    public readonly storyImages: string[] = [];

    public selectImage(imageName: string) {
        console.log(imageName);
        this.storyImages.push(imageName);
    }

    public readonly daystatList = [
        this.day1,
        this.day2,
        this.day3
    ];
}