import { GameStats } from "../gameStats";

export class SceneManager {
    constructor(private readonly gamestats:GameStats){}
    public scenes: { [name: string]: gameScene };
    public currentScene: gameScene = null;
    public loadScene(sceneName: string) {
        if(this.gamestats.gameStage==this.gamestats.daystatList.length){
            sceneName ="endScene";
        }
        const sceneToLoad = this.scenes[sceneName];
        if (sceneToLoad === undefined) {
            console.error("scene " + sceneName + " doesn't exist in the game objects");
            return;
        }
        if (this.currentScene !== null) {
            console.log("removing previous scene");
            (this.currentScene).removeScene();
        }
        sceneToLoad.showScene();
        this.currentScene = sceneToLoad;
    }

}