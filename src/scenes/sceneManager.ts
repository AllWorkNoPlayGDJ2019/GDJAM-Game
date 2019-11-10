export class SceneManager {
    public scenes: { [name: string]: gameScene };
    public currentScene: gameScene = null;
    public loadScene(sceneName: string) {
        const sceneToLoad = this.scenes[sceneName];
        if (sceneToLoad === undefined) {
            console.error("scene " + sceneName + " doesn't exist in the game objects");
            return;
        }
        if (this.currentScene !== null) { (this.currentScene).removeScene(); }
        sceneToLoad.showScene();
    }

}