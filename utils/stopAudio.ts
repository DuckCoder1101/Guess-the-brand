const stopAudio = () => {
  // Stop all audio elements
  for (let audio of Array.from(document.querySelectorAll("audio"))) {
    audio.pause();
    audio.currentTime = 0;
  }
};

export default stopAudio
