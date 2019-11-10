import * as PIXI from 'pixi.js'

export class AssetManager {

    constructor() {
        this.AssetLocations["clockFace"] = 'assets/clock_face.png';
        this.AssetLocations["clockHourPointer"] = 'assets/clock_hand_hour.png';
        this.AssetLocations["clockMinutePointer"] = 'assets/clock_hand_minute.png';
        this.AssetLocations["belt"]="assets/belt.png";
        this.AssetLocations["beltbackground"]="assets/belt_bckground.png";
        this.AssetLocations["box"]="assets/box.png";
        this.AssetLocations["factory"]="assets/factory.png";
        this.AssetLocations["doll"]="assets/doll.png";
        this.AssetLocations["exitSign"]="assets/exit.png";
        this.AssetLocations["homebackground"]="assets/home_background.png";
        this.AssetLocations["kidElementarySchoolGood"]="assets/elementary_school.png";
        this.AssetLocations["kidMiddleSchoolBad"]="assets/kid_middle_school_hurt.png";
        this.AssetLocations["startMenu"] = "assets/startMenu.png";
    }
    public load(): Promise<void> {
        console.log('loading');
        const loader = new PIXI.Loader();
        return new Promise((resolve) => {
            for (let key of Object.keys(this.AssetLocations)) {
                loader.add(key, this.AssetLocations[key]);
            }
            loader.load((_, resources) => {
                for (let key of Object.keys(this.AssetLocations)) {
                    this.Textures[key] = resources[key].texture;
                }
                resolve();
            });
        });
    }

    public readonly AssetLocations: { [name: string]: string; } = {};
    public readonly Textures: { [name: string]: PIXI.Texture; } = {};



}