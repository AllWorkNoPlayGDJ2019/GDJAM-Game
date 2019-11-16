import * as PIXI from 'pixi.js'

export class AssetManager {

    constructor() {
        this.addSpritePaths();
        this.AssetLocations["clockFace"] = 'assets/clock_face.png';
        this.AssetLocations["clockHourPointer"] = 'assets/clock_hand_hour.png';
        this.AssetLocations["clockMinutePointer"] = 'assets/clock_hand_minute.png';
        this.AssetLocations["belt"] = "assets/belt.png";
        this.AssetLocations["beltbackground"] = "assets/belt_bckground.png";
        this.AssetLocations["box"] = "assets/box.png";
        this.AssetLocations["factory"] = "assets/factory.png";
        this.AssetLocations["doll"] = "assets/doll.png";
        this.AssetLocations["exitSign"] = "assets/exit.png";
        this.AssetLocations["homebackground"] = "assets/home_background.png";
        this.AssetLocations["playButton"] = "assets/play_hover.png";
        this.AssetLocations["startMenu"] = "assets/startMenu.png";
        this.AssetLocations["textBoxSample"] = "assets/textBoxes/textBoxSample.png";
        this.AssetLocations["day1Happy"] = "assets/day_1.png";
        this.AssetLocations["day2Happy"] = "assets/day_2_happy.png";
        this.AssetLocations["day2Sad"] = "assets/day_2_sad.png";
        this.AssetLocations["day3Happy"] = "assets/day_3_happy.png";
        this.AssetLocations["day3Sad"] = "assets/day_3_sad.png";
        this.AssetLocations["day4Happy"] = "assets/day_4_happy.png";
        this.AssetLocations["day4Sad"] = "assets/day_4_sad.png";
        this.AssetLocations["day5Factory"] = "assets/day_5_factory.png";
        this.AssetLocations["day5University"] = "assets/day_5_university.png";

        this.AssetLocations["day5Postcard"] = "assets/day_5_university_postcard.png";
        this.AssetLocations["day5PostcardText"] = "assets/day_5_university_postcard_text.png";

        this.AssetLocations["day5Gone"] = "assets/day_5_shes_gone.png";
        this.AssetLocations["startPrompt"] = "assets/start_scene.png";
        this.AssetLocations["toWork"] = "assets/go_to_work.png";
        this.AssetLocations["overtime"] = "assets/overtime.png";

        this.AssetLocations["redPocket"] = "assets/red_pocket.png";
        this.AssetLocations["workEnds"] = "assets/overtimeBegins.png";

        this.AssetLocations["workBegins"] = "assets/work_starts_.png";



    }

    private addSpritePaths() {
        const shadowSpritePaths1 = [
            "assets/shadowWorkerFrames/shadowsA1.png",  // we're only using the first of each since animation not working, ie. A1, B1, C1
            "assets/shadowWorkerFrames/shadowsA2.png",
            "assets/shadowWorkerFrames/shadowsA3.png",
            "assets/shadowWorkerFrames/shadowsA4.png",
            "assets/shadowWorkerFrames/shadowsA5.png"
        ];

        const shadowSpritePaths2 = [
            "assets/shadowWorkerFrames/shadowsB1.png",
            "assets/shadowWorkerFrames/shadowsB2.png",
            "assets/shadowWorkerFrames/shadowsB3.png",
            "assets/shadowWorkerFrames/shadowsB4.png",
            "assets/shadowWorkerFrames/shadowsB5.png"
        ];

        const shadowSpritePaths3 = [
            "assets/shadowWorkerFrames/shadowsC1.png",
            "assets/shadowWorkerFrames/shadowsC2.png",
            "assets/shadowWorkerFrames/shadowsC3.png",
            "assets/shadowWorkerFrames/shadowsC4.png",
            "assets/shadowWorkerFrames/shadowsC5.png"
        ];
        const allSpritePaths = [shadowSpritePaths1,shadowSpritePaths2,shadowSpritePaths3];
        this.animationSpriteNames = allSpritePaths.map(x=>x.map(path=> path.split('.')[0].substring(1 + path.lastIndexOf('/'))));
        const allSpritePathsFlat = [];
        allSpritePaths.map(x=>allSpritePathsFlat.push(...x));
        allSpritePathsFlat.forEach(path => this.AssetLocations[path.split('.')[0].substring(1 + path.lastIndexOf('/'))] = path);
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
                console.log({ loaded: this.Textures });
                resolve();
            });
        });
    }
    public  animationSpriteNames :string[][];
    public readonly AssetLocations: { [name: string]: string; } = {};
    public readonly Textures: { [name: string]: PIXI.Texture; } = {};




}