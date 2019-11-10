import {dayStats} from './dayStats'

export class GameStats{

    public readonly itemValue =0.5;
    public  money = 0;
    public  childHappiness = 0;
    public today = new Date();
    public gameStage = 0;
    public currentDay = new Date(1990, 5, 12, 6, 0, 0, 0);

    public moneyGoal=100;


    public advanceDay(){
        this.currentDay.setDate(this.currentDay.getDate()+1);
        this.currentDay.setHours(6,0,0,0);
        console.log({newTime:this.currentDay});
    }

    public successfulAction() {
        this.money += this.itemValue;
    }
    public successfulOvertimeAction() {
        this.money += this.itemValue * 2;
    }

    public finishDay(endTime: Date) {
        if (endTime.getHours() >= 22) {
            this.childHappiness -= 10;
        }
        else {
            this.childHappiness += (24 - endTime.getHours());
        }
        this.today.setDate(this.today.getDate()+1);
        this.gameStage++;
    }

    day1: dayStats = {
        moneyGoal: 60,
        happinessGoal: 6,
        goodPhoto: "kidInfantGood",
        badPhoto: "kidInfantBad"
    };

    day2: dayStats = {
        moneyGoal: 60,
        happinessGoal: 12,
        goodPhoto: "kidElementarySchoolGood",
        badPhoto: "kidElementarySchoolBad"
    };

    day3: dayStats = {
        moneyGoal: 60,
        happinessGoal: 18,
        goodPhoto: "kidMiddleSchoolGood",
        badPhoto: "kidMiddleSchoolBad"
    };

    day4: dayStats = {
        moneyGoal: 60,
        happinessGoal: 24,
        goodPhoto: "kidHighSchoolGood",
        badPhoto: "kidHighSchoolBad"
    };

   public readonly daystatList = [
       this.day1,
       this.day2,
       this.day3,
       this.day4
    ];
}