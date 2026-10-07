(() => {
  const $ = (id) => document.getElementById(id);
  const progressFill = $('progressFill');
  const scanButton = $('scanButton');
  const resetButton = $('resetButton');
  const resolveButton = $('resolveButton');
  const progressbar = document.querySelector('[role="progressbar"]');
  const findingsList = $('findingsList');
  const activityList = $('activityList');
  const dialog = $('revealDialog');

  const stages = [
    'Warming up the pretend scanner…',
    'Looking for suspiciously suspicious things…',
    'Inspecting the imaginary internet…',
    'Counting the pixels on your screen…',
    'Asking the friendly computer ghosts…',
    'Almost done. Absolutely no files were read.'
  ];
  const fictionalFindings = [
    { name: 'Excessive tab hoarding', detail: '17 imaginary tabs • probably needs a snack', severity: 'VERY FAKE' },
    { name: 'Sentient cookie crumbs', detail: 'Found in the pretend browser jar', severity: 'NOT REAL' },
    { name: 'Low-level dad joke', detail: 'A pun is attempting to escape containment', severity: 'MILDLY SILLY' }
  ];
  let progress = 0;
  let timer = null;
  let seconds = 0;
  let clockTimer = null;
  let running = false;
  let resolved = false;
  let toastTimer = null;
  let simulationTimer = null;
  let simulationInterval = null;

  const programs = {
    alert: { title: 'Oops! Something silly', start() {
      $('simulationStage').innerHTML = '<div class="stage-alert"><div class="stage-emoji">⚠️</div><h3>Important computer announcement</h3><p>We have detected an unusually high number of open browser tabs.<br>Recommended action: take a stretch break and enjoy this extremely fake alert.</p><button class="stage-button" type="button" id="stageAcknowledge">Okay, you got me</button></div>';
      $('stageAcknowledge').addEventListener('click', () => { $('simulationStage').innerHTML = '<p class="stage-message">Alert acknowledged. The tabs are still imaginary. You’re doing great.</p>'; });
    } },
    update: { title: 'Definitely not updating', start() {
      $('simulationStage').innerHTML = '<div class="stage-alert"><div class="stage-emoji">↻</div><h3>Installing imaginary good vibes…</h3><p id="stageMessage">Preparing absolutely nothing. This is only a visual animation.</p><div class="stage-progress"><span id="stageFill"></span></div><p id="stagePercent" class="stage-message">0% · zero changes being made</p></div>';
      let n = 0;
      simulationInterval = setInterval(() => { n = Math.min(100, n + 5); $('stageFill').style.width = `${n}%`; $('stagePercent').textContent = `${n}% · zero changes being made`; if (n === 100) { clearInterval(simulationInterval); simulationInterval = null; $('stageMessage').textContent = 'Update complete! You have installed a nice little demo.'; } }, 250);
    } },
    terminal: { title: 'Hollywood hacker', start() {
      $('simulationStage').innerHTML = '<div class="stage-terminal" id="terminalLines"><p class="terminal-note">// Completely fictional terminal. No commands run.</p></div>';
      const lines = ['> locating the big red button…', '> consulting the imaginary mainframe…', '> compiling 100% more technobabble…', '> coffee.exe status: emotionally available', '> result: you are an excellent human'];
      let i = 0;
      simulationInterval = setInterval(() => { const line = document.createElement('p'); line.textContent = lines[i++]; $('terminalLines').append(line); if (i >= lines.length) { clearInterval(simulationInterval); simulationInterval = null; } }, 650);
    } },
    compliments: { title: 'Compliment storm', start() {
      $('simulationStage').innerHTML = '<div id="complimentArea"><p class="stage-message">Incoming compliments. Confined to this little box.</p></div>';
      const phrases = ['You make a difference.', 'Excellent human detected.', 'Your snacks are probably top-tier.', 'Thanks for being you.', 'You deserve a little treat.'];
      let i = 0;
      simulationInterval = setInterval(() => { const bubble = document.createElement('span'); bubble.className = 'compliment-bubble'; bubble.textContent = phrases[i++]; $('complimentArea').append(bubble); if (i >= phrases.length) { clearInterval(simulationInterval); simulationInterval = null; } }, 700);
    } },
    encrypt: { title: 'Very pretend files', start() {
      $('simulationStage').innerHTML = '<div class="stage-alert"><div class="stage-emoji">▦</div><h3>Imaginary file confetti</h3><p>No real files are touched or locked. Watch this very fake meter.</p><div class="stage-progress"><span id="stageFill"></span></div><p id="stagePercent" class="stage-message">0% of pretend files decorated</p></div>';
      let n = 0;
      simulationInterval = setInterval(() => { n = Math.min(100, n + 10); $('stageFill').style.width = `${n}%`; $('stagePercent').textContent = n === 100 ? '100% of pretend files decorated. Nothing was changed!' : `${n}% of pretend files decorated`; if (n === 100) { clearInterval(simulationInterval); simulationInterval = null; } }, 350);
    } },
    coffee: { title: 'Coffee.exe needs coffee', start() {
      $('simulationStage').innerHTML = '<div class="stage-alert"><div class="stage-emoji">☕</div><h3>System notice from Coffee.exe</h3><p>Motivation module running low. Suggested fix: stretch, sip water, or find a warm drink. This is your sign to take a kind little break.</p><button class="stage-button" type="button" id="stageAcknowledge">Break accepted</button></div>';
      $('stageAcknowledge').addEventListener('click', () => { $('simulationStage').innerHTML = '<p class="stage-message">Break accepted. Take care of yourself out there.</p>'; });
    } }
  };

  function stopProgram(reveal = true) {
    clearTimeout(simulationTimer);
    clearInterval(simulationInterval);
    simulationTimer = null;
    simulationInterval = null;
    $('simulationPanel').hidden = true;
    $('simulationStage').replaceChildren();
    if (reveal) {
      logEvent('Prank simulation stopped', 'Everything was pretend; nothing was changed');
      toast('Simulation stopped. Nothing was changed on this device.');
    }
  }

  document.querySelectorAll('.program-launch').forEach((button) => {
    button.addEventListener('click', () => {
      stopProgram(false);
      const program = programs[button.dataset.program];
      if (!program) return;
      $('simulationTitle').textContent = program.title;
      $('simulationPanel').hidden = false;
      program.start();
      $('simulationPanel').scrollIntoView({ behavior: 'smooth', block: 'center' });
      logEvent(`Started: ${program.title}`, 'Harmless visual gag, contained to this page');
    });
  });
  $('stopSimulation').addEventListener('click', () => stopProgram(true));

  const escapeHTML = (text) => text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

  function logEvent(title, detail) {
    const entry = document.createElement('li');
    entry.className = 'activity-entry';
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    entry.innerHTML = `<span class="activity-dot" aria-hidden="true"></span><span><strong>${escapeHTML(title)}</strong><small>${escapeHTML(detail)}</small></span><time>${time}</time>`;
    activityList.prepend(entry);
    while (activityList.children.length > 12) activityList.lastElementChild.remove();
  }

  function toast(message) {
    const element = $('toast');
    element.textContent = message;
    element.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove('visible'), 2800);
  }

  function renderProgress() {
    const value = Math.min(100, Math.round(progress));
    $('percent').textContent = value;
    progressFill.style.width = `${value}%`;
    progressbar.setAttribute('aria-valuenow', String(value));
    $('gauge').style.background = `conic-gradient(var(--mint) ${value * 3.6}deg,#253347 ${value * 3.6}deg)`;
    $('gauge').setAttribute('aria-label', `Simulated scan progress: ${value} percent`);
    $('checked').textContent = String(Math.round(value * 7.43));
  }

  function setRunning(value) {
    running = value;
    scanButton.innerHTML = value ? '<span aria-hidden="true">Ⅱ</span> Pause pretend scan' : '<span aria-hidden="true">▶</span> Start a pretend scan';
    resetButton.disabled = value;
  }

  function renderFindings() {
    if (progress < 100 && !resolved) {
      findingsList.innerHTML = '<div class="empty-state"><span aria-hidden="true">✳</span><p>Your totally fictional results will show up here.</p></div>';
      $('findingCount').textContent = '0';
      resolveButton.disabled = true;
      resolveButton.textContent = 'Resolve pretend findings';
      return;
    }
    if (resolved) {
      findingsList.innerHTML = '<div class="empty-state"><span aria-hidden="true">✓</span><p>All fictional findings safely sent to the pretend recycling bin.</p></div>';
      $('findingCount').textContent = '0';
      resolveButton.disabled = true;
      resolveButton.textContent = 'Nothing left to resolve';
      $('score').textContent = '100';
      $('devicePill').textContent = 'PROTECTED';
      $('devicePill').classList.remove('alert');
      $('scoreCaption').textContent = 'Everything is pretend-perfect again.';
      $('scoreTrack').style.width = '100%';
      return;
    }
    findingsList.innerHTML = fictionalFindings.map((item) => `<div class="finding-row"><span class="finding-icon" aria-hidden="true">✳</span><span class="finding-copy"><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.detail)}</small></span><span class="finding-severity">${escapeHTML(item.severity)}</span></div>`).join('');
    $('findingCount').textContent = String(fictionalFindings.length);
    resolveButton.disabled = false;
    resolveButton.textContent = 'Resolve pretend findings';
    $('score').textContent = '72';
    $('devicePill').textContent = 'JUST A DEMO';
    $('devicePill').classList.add('alert');
    $('scoreCaption').textContent = 'A completely fictional score for dramatic effect.';
    $('scoreTrack').style.width = '72%';
  }

  function finishScan() {
    clearInterval(timer);
    clearInterval(clockTimer);
    timer = null;
    clockTimer = null;
    progress = 100;
    renderProgress();
    setRunning(false);
    scanButton.disabled = true;
    scanButton.innerHTML = '<span aria-hidden="true">✓</span> Demo complete';
    $('scanMessage').textContent = 'Scan complete. The findings are fictional.';
    $('scanSubmessage').textContent = 'No device data was accessed. Want to see what this is really about?';
    renderFindings();
    logEvent('Pretend scan complete', `${fictionalFindings.length} completely made-up findings`);
  }

  function startScan() {
    if (progress >= 100) return;
    setRunning(true);
    $('scanSubmessage').textContent = 'Just animation—your files and settings are untouched.';
    logEvent('Pretend scan started', 'Browser-only animation; no files or settings touched');
    timer = setInterval(() => {
      progress = Math.min(100, progress + 2);
      renderProgress();
      const stageIndex = Math.min(stages.length - 1, Math.floor(progress / 17));
      $('scanMessage').textContent = stages[stageIndex];
      $('elapsed').textContent = `00:${String(seconds).padStart(2, '0')}`;
      if (progress >= 100) finishScan();
    }, 140);
    clockTimer = setInterval(() => {
      seconds += 1;
      $('elapsed').textContent = `00:${String(seconds).padStart(2, '0')}`;
    }, 1000);
  }

  function pauseScan() {
    clearInterval(timer);
    clearInterval(clockTimer);
    timer = null;
    clockTimer = null;
    setRunning(false);
    $('scanMessage').textContent = 'Pretend scan paused.';
    $('scanSubmessage').textContent = 'Pick up where you left off whenever you like.';
    logEvent('Pretend scan paused', `${Math.round(progress)}% complete`);
  }

  function resetDemo() {
    clearInterval(timer);
    clearInterval(clockTimer);
    timer = null;
    clockTimer = null;
    progress = 0;
    seconds = 0;
    resolved = false;
    setRunning(false);
    scanButton.disabled = false;
    renderProgress();
    $('elapsed').textContent = '00:00';
    $('scanMessage').textContent = 'Ready when you are.';
    $('scanSubmessage').textContent = 'No files are being read. This is just a little animation.';
    renderFindings();
    $('score').textContent = '100';
    $('devicePill').textContent = 'PROTECTED';
    $('devicePill').classList.remove('alert');
    $('scoreCaption').textContent = 'Looking good. (In this pretend universe.)';
    $('scoreTrack').style.width = '100%';
    logEvent('Demo reset', 'Back to a fictional clean slate');
  }

  scanButton.addEventListener('click', () => running ? pauseScan() : startScan());
  resetButton.addEventListener('click', resetDemo);
  resolveButton.addEventListener('click', () => {
    if (resolved || progress < 100) return;
    resolved = true;
    renderFindings();
    $('scanMessage').textContent = 'All pretend findings have been resolved.';
    $('scanSubmessage').textContent = 'The pretend recycling bin is feeling very accomplished.';
    logEvent('Pretend findings resolved', 'Safely recycled three fictional things');
    toast('Fictional findings resolved. Your device is unchanged.');
  });
  $('clearLogButton').addEventListener('click', () => {
    activityList.innerHTML = '';
    logEvent('Activity log cleared', 'This browser tab only');
    toast('Activity log cleared.');
  });
  function showReveal() {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else toast('This is a harmless simulation. Nothing scanned or changed.');
    logEvent('Joke revealed', 'This demo does not scan or change your device');
  }
  $('revealButton').addEventListener('click', showReveal);
  $('footerReveal').addEventListener('click', showReveal);
  $('closeDialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && dialog.open) dialog.close(); });
  renderProgress();
})();
