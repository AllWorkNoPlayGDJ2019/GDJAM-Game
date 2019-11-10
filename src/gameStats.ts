export class GameStats {

    public readonly itemValue = 0.5;
    public money = 0;
    public childHappiness = 0;
    public currentDay = new Date(1990, 5, 12, 6, 0, 0, 0);
    public moneyGoal = 100;

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
        this.currentDay.setDate(this.currentDay.getDate() + 1);
    }


}