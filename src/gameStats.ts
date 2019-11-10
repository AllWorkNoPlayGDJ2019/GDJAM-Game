import {dayStats} from './dayStats'

export class GameStats{

    public readonly itemValue =0.5;
    public  money = 0;
    public  childHappiness = 0;
    public today = new Date();
    public gameStage = 0;

    public moneyGoal=100;

    public successfulAction(){
        this.money+=this.itemValue;
    }
    public successfulOvertimeAction(){
        this.money+=this.itemValue*2;
    }

    public finishDay(endTime:Date){
        if(endTime.getHours()>=22){
            this.childHappiness-=10;
        }
        else {
            this.childHappiness+=( 24-endTime.getHours());
        }
        this.today.setDate(this.today.getDate()+1);
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

   public readonly daystatList = [
       this.day1,
       this.day2,
       this.day3
   ]
}