
const blowButton = document.getElementById("blow-button");
const cakeScreen = document.getElementById("cake-screen");
const finalScreen = document.getElementById("final-screen");
const startScreen = document.getElementById("start-screen");
const audio = document.getElementById("birthday-audio");

function listenToBlow() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const audioContext = new AudioContext();
    const mic = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    mic.connect(analyser);
    analyser.fftSize = 512;
    const buffer = new Uint8Array(analyser.frequencyBinCount);

    function detect() {
      analyser.getByteFrequencyData(buffer);
      let max = Math.max(...buffer);
      if (max > 80) {
        stream.getTracks().forEach(t => t.stop());
        showFinalScreen();
      } else {
        requestAnimationFrame(detect);
      }
    }

    detect();
  });
}

function showFinalScreen() {
  startScreen.style.display = "none";
  cakeScreen.style.display = "none";
  finalScreen.style.display = "block";
  audio.play();
}

blowButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  cakeScreen.style.display = "block";
  listenToBlow();
});
