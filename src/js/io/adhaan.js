import audioPlayer from 'web-audio-player';

export default class Adhaan {
	constructor({
		adhaanFile = 'audio/adhaan.mp3',
		loop = true,
		play = true,
		volume = 1
	} = {}) {
		this.loop = loop;
		this.play = play;
		this.audioPlayer = new audioPlayer(adhaanFile, {
			loop,
			volume
		});

		if (this.play) {
			this.audioPlayer.play();
  			this.audioPlayer.node.connect(this.audioPlayer.context.destination);
		}
	}

	pause() {
			this.audioPlayer.pause();
	}

	stop() {
			this.audioPlayer.stop();
	}
}