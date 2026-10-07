const progressFill = document.getElementById('progressFill');
const scanStatus = document.getElementById('scanStatus');
const removeButton = document.getElementById('removeButton');
const dismissButton = document.getElementById('dismissButton');

const messages = [
  'Initializing...',
  'Checking startup files...',
  'Scanning browsing history...',
  'Analyzing active processes...',
  'Searching for malicious signatures...',
  'Quarantine ready...'
];

let progress = 0;
let messageIndex = 0;

function updateScan() {
  if (progress <= 100) {
    progressFill.style.width = `${progress}%`;
    scanStatus.textContent = messages[Math.min(messageIndex, messages.length - 1)];

    progress += 5;
    messageIndex += 1;

    if (progress > 100) {
      progressFill.style.width = '100%';
      scanStatus.textContent = 'Threats located. Action required.';
      return;
    }

    setTimeout(updateScan, 220);
  }
}

removeButton.addEventListener('click', () => {
  scanStatus.textContent = 'Quarantine sequence started...';
  removeButton.textContent = 'Quarantining...';
  removeButton.disabled = true;

  setTimeout(() => {
    scanStatus.textContent = 'Fake threat removed successfully.';
    removeButton.textContent = 'Completed';
  }, 1200);
});

dismissButton.addEventListener('click', () => {
  scanStatus.textContent = 'Warning dismissed by user.';
  dismissButton.textContent = 'Dismissed';
  dismissButton.disabled = true;
});

updateScan();
