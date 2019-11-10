/*
* Usage: 
* const tone = new CreateAudio("tone.mp3")
* tone.play()
*/

export class CreateAudio {

    public audio = new Audio();

    constructor(
        soundFile: string
    )
    {
        this.audio.src = "./assets/audio/" + soundFile
        this.audio.load()
        this.audio.play()
    }

    // Play audio
    play() {
        this.audio.play()
    }

    // Play audio (same thing)
    start() {
        this.audio.play()
    }

    // Stop audio
    stop() {
        this.audio.pause()
        this.audio.currentTime = 0
    }

    // Loop audio
    loop() {
        this.audio.loop = true
    }


};