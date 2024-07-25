// tick sound
export function playTickSound() {
  const audioContext = new window.AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(500, audioContext.currentTime); // Further reduced frequency for a lower sound
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Reduced volume for less noise
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}
