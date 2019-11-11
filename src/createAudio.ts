/*
* Usage: 
* const tone = new CreateAudio("tone.mp3")
* tone.play()
* tone.loop() // if looping
* tone.stop() // don't forget to stop looping tracks when switching scenes
* tone.setVolume(0.5) // half volume
* tone.stopAll() // stops all audio
*
* Calling the same sound effect multiple times:
*   
*   // Don't recreate sound, use .play() again
*   // Example to play sound efffect 5 times with a specified interval
*
*           // Create sound
*        const clickSound = new CreateAudio("button_click.mp3");
*        
*        let clickCount = 0;
*
*           // Play sound every 500 milliseconds
*        const playSound5x = setInterval(() => {
*            clickCount = clickCount + 1;
*            clickSound.play();
*            if (crankCount === 5) {
*                window.clearInterval(playSound5x);
*            }
*        }, 500)
*/

export class CreateAudio {

    public audio = new Audio();

    constructor(
        soundFile: string
    )
    {
        this.audio.src = "./assets/audio/" + soundFile;
        this.audio.load();
    }

    // Play audio
    play() {
        this.audio.pause(); // if the same audio is called to play again, reset and play
        this.audio.currentTime = 0;
        this.audio.play();
    }

    // Play audio which will not be interrupted if called again before clip is done playing
    playUninterrupted() {
        this.audio.play();
    }

    // Play audio (same thing)
    start() {
        this.audio.play();
    }

    // Stop audio
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    // Loop audio
    loop() {
        this.audio.loop = true;
    }

    // Set volume
    setVolume(volume: number) {
        this.audio.volume = volume;
    }

};