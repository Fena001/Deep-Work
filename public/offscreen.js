chrome.runtime.onMessage.addListener((msg) => {
    const audio = document.getElementById('audio-player');
  
    if (msg.type === 'PLAY') {
      if (!audio.src.includes(msg.track)) {
        audio.src = msg.track; 
      }
      audio.volume = msg.volume || 1.0;
      audio.play();
    } 
    else if (msg.type === 'STOP') {
      audio.pause();
    } 
    else if (msg.type === 'SET_VOLUME') {
      audio.volume = msg.volume;
    }
});