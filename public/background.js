chrome.runtime.onInstalled.addListener(() => {
  console.log("Flow State Engine Installed");
  chrome.alarms.create("HEARTBEAT", { periodInMinutes: 1 });
});

let creatingOffscreen = false;
async function setupOffscreenDocument(path) {
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [path]
  });

  if (existingContexts.length > 0) return;

  if (creatingOffscreen) return;
  creatingOffscreen = true;
  await chrome.offscreen.createDocument({
    url: path,
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'Playing focus sounds in background',
  });
  creatingOffscreen = false;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  if (request.action === "PLAY_SOUND") {
    setupOffscreenDocument('offscreen.html').then(() => {
      chrome.runtime.sendMessage({ 
        type: 'PLAY', 
        track: request.track, 
        volume: request.volume 
      });
    });
  }
  if (request.action === "STOP_SOUND") {
    chrome.runtime.sendMessage({ type: 'STOP' });
  }
  if (request.action === "SET_VOLUME") {
    chrome.runtime.sendMessage({ type: 'SET_VOLUME', volume: request.volume });
  }

  if (request.action === "EMERGENCY_OVERRIDE") {
    disableBlocking();
    setTimeout(restoreBlocking, 60000);
  }

  if (request.action === "ADD_RECURRING_SESSION") {
    chrome.storage.local.get(["recurringSessions"], (data) => {
      const sessions = data.recurringSessions || [];
      const newSessions = [...sessions, request.schedule];
      chrome.storage.local.set({ recurringSessions: newSessions });
      showNotification("Schedule Added", `${request.schedule.name} is now active.`);
    });
  }
  if (request.action === "DELETE_RECURRING_SESSION") {
    chrome.storage.local.get(["recurringSessions"], (data) => {
      const sessions = data.recurringSessions || [];
      const filtered = sessions.filter(s => s.id !== request.id);
      chrome.storage.local.set({ recurringSessions: filtered });
    });
  }

  if (request.action === "SCHEDULE_SESSION") {
    const sessionID = request.id || Date.now().toString();
    chrome.storage.local.get(["scheduledSessions"], (data) => {
      const list = data.scheduledSessions || {};
      list[sessionID] = {
        sites: request.sites,
        duration: request.durationMinutes,
        name: request.name || "Scheduled Session",
        timeDisplay: request.timeDisplay
      };
      chrome.storage.local.set({ scheduledSessions: list });
    });
    chrome.alarms.create(`START_SESSION::${sessionID}`, { delayInMinutes: request.delayMinutes });
  }

  if (request.action === "CANCEL_SCHEDULED_SESSION") {
    const sessionID = request.id;
    chrome.alarms.clear(`START_SESSION::${sessionID}`);
    chrome.storage.local.get(["scheduledSessions"], (data) => {
      const list = data.scheduledSessions || {};
      delete list[sessionID];
      chrome.storage.local.set({ scheduledSessions: list });
    });
  }

  if (request.action === "START_SESSION") updateCurrentRules(request.sites);
  if (request.action === "STOP_SESSION") {
      disableBlocking();
      chrome.alarms.clearAll();
      chrome.storage.local.remove(["currentRules", "activeRecurringID"]);
      chrome.alarms.create("HEARTBEAT", { periodInMinutes: 1 });
      
      chrome.runtime.sendMessage({ type: 'STOP' });
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith("START_SESSION::")) {
    const sessionID = alarm.name.split("::")[1];
    chrome.storage.local.get(["scheduledSessions"], (data) => {
      const session = data.scheduledSessions ? data.scheduledSessions[sessionID] : null;
      if (session) {
        updateCurrentRules(session.sites);
        chrome.alarms.create(`STOP_SESSION::${sessionID}`, { delayInMinutes: session.duration || 60 });
        showNotification("Session Started", `Starting: ${session.name}`);
        const updatedList = { ...data.scheduledSessions };
        delete updatedList[sessionID];
        chrome.storage.local.set({ scheduledSessions: updatedList });
      }
    });
  }

  if (alarm.name.startsWith("STOP_SESSION::")) {
    disableBlocking();
    showNotification("Session Complete", "Great work!");
    chrome.storage.local.remove("currentRules");
    saveHistory("Scheduled Session", 60);
    chrome.runtime.sendMessage({ type: 'STOP' });
  }

  if (alarm.name === "HEARTBEAT") {
    checkAllRecurringSessions();
  }
});

function checkAllRecurringSessions() {
  chrome.storage.local.get(["recurringSessions", "activeRecurringID"], (data) => {
    const sessions = data.recurringSessions || [];
    const activeID = data.activeRecurringID;
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = days[now.getDay()];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (activeID) {
      const activeSession = sessions.find(s => s.id === activeID);
      if (activeSession) {
         const endMinutes = convertToMinutes(activeSession.endTime);
         if (currentMinutes >= endMinutes || !activeSession.days.includes(currentDay)) {
            disableBlocking();
            chrome.storage.local.remove(["activeRecurringID", "currentRules"]);
            saveHistory(activeSession.name, 60);
            showNotification("Session Ended", `${activeSession.name} finished.`);
            chrome.runtime.sendMessage({ type: 'STOP' });
         }
      } else {
        disableBlocking();
        chrome.storage.local.remove("activeRecurringID");
      }
      return;
    }

    for (const session of sessions) {
      if (!session.active) continue;
      if (!session.days.includes(currentDay)) continue;
      const startMinutes = convertToMinutes(session.startTime);
      const endMinutes = convertToMinutes(session.endTime);

      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        updateCurrentRules(session.sites);
        chrome.storage.local.set({ activeRecurringID: session.id });
        showNotification("Recurring Session", `Starting ${session.name}`);
        return;
      }
    }
  });
}

async function updateCurrentRules(sites) {
  await disableBlocking();
  chrome.storage.local.set({ currentRules: sites });
  const rules = sites.map((domain, index) => {
    const action = { type: "redirect", redirect: { extensionPath: "/blocked.html" } };
    if (domain === "*") {
      return { id: index + 1, priority: 1, action, condition: { urlFilter: "*", resourceTypes: ["main_frame"] } };
    }
    return { id: index + 1, priority: 1, action, condition: { urlFilter: `||${domain}`, resourceTypes: ["main_frame"] } };
  });
  await chrome.declarativeNetRequest.updateDynamicRules({ addRules: rules });
}

async function disableBlocking() {
  const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
  const ruleIds = currentRules.map(rule => rule.id);
  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ruleIds, addRules: [] });
}

async function restoreBlocking() {
  chrome.storage.local.get(["currentRules"], (data) => {
    if (data.currentRules) updateCurrentRules(data.currentRules);
  });
}

function convertToMinutes(timeObj) {
  let hours = parseInt(timeObj.h);
  if (timeObj.p === 'PM' && hours !== 12) hours += 12;
  if (timeObj.p === 'AM' && hours === 12) hours = 0;
  return (hours * 60) + parseInt(timeObj.m);
}

function saveHistory(name, durationMins) {
  const newEntry = {
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: `${Math.round(durationMins)} min`,
    blocklist: name,
    status: 'Completed'
  };
  chrome.storage.local.get(["flow_history"], (result) => {
    const history = result.flow_history || [];
    const updatedHistory = [newEntry, ...history];
    chrome.storage.local.set({ flow_history: updatedHistory });
  });
}

function showNotification(title, message) {
  chrome.notifications.create({ type: "basic", iconUrl: "icon.png", title, message, priority: 2 });
}