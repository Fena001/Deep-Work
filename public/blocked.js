document.getElementById('overrideBtn').addEventListener('click', () => {
  if (confirm("Are you sure? This will pause blocking for 60 seconds.")) {
    chrome.runtime.sendMessage({ action: "EMERGENCY_OVERRIDE" });
    window.close();
  }
});