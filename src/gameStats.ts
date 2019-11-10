export class GameStats{

    public readonly itemValue =0.5;
    public  money =0;
    public  childHappiness=0;
    public today = new Date();
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
    }

   
}