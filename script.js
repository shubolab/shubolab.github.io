const form = document.querySelector('#cli-form');
const input = document.querySelector('#cli-input');
const cliOutput = document.querySelector('#cli-output');
const bootTranscript = document.querySelector('#boot-transcript');
const history = [];
let historyIndex = 0;

const commandNames = [
  'help', 'whoami', 'pwd', 'ls', 'ls posts', 'cat about.md', 'cat contact.txt',
  'gh profile', 'open 1', 'open 2', 'clear', 'reset', 'history', 'date', 'sudo'
];

const responses = {
  help: 'help             show commands\nwhoami           show profile\npwd              print working directory\nls posts         list published posts\ncat about.md     show about\ncat contact.txt  show contact\ngh profile       open profile source\nopen 1           open SSH alias post\nopen 2           open QQ pet post\nclear            clear screen\nreset            restore initial screen',
  whoami: 'Shubo — LLM application development / Cybersecurity',
  pwd: '/home/shubo',
  ls: 'about.md  contact.txt  posts/',
  'ls posts': 'ssh-alias-codex-routing.md\nqq-pet-codex.md',
  'cat about.md': '目前主要做 LLM 应用开发和网络安全。\nLanguages: Python, Go',
  'cat contact.txt': 'EMAIL   wsb814183583@gmail.com\nWECHAT  i814183583\nGITHUB  github.com/shubolab',
  history: () => history.map((item, index) => `${String(index + 1).padStart(3)}  ${item}`).join('\n'),
  date: () => new Date().toString(),
  sudo: 'visitor is not in the sudoers file. This incident will be reported.',
};

function addEntry(command, result, error = false) {
  const entry = document.createElement('div');
  entry.className = 'terminal-entry';
  const commandLine = document.createElement('p');
  commandLine.className = 'command';
  commandLine.innerHTML = '<span class="user">visitor@shubolab</span>:<span class="cwd">~</span>$ ';
  commandLine.append(document.createTextNode(command));
  const resultLine = document.createElement('pre');
  resultLine.className = error ? 'result error' : 'result';
  resultLine.textContent = result;
  entry.append(commandLine, resultLine);
  cliOutput.append(entry);
  entry.scrollIntoView({ block: 'nearest' });
}

function runCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!command) return;
  history.push(command);
  historyIndex = history.length;

  if (command === 'clear') {
    bootTranscript.hidden = true;
    cliOutput.replaceChildren();
    return;
  }
  if (command === 'reset') {
    bootTranscript.hidden = false;
    cliOutput.replaceChildren();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (command === 'open 1') {
    window.location.href = '/posts/ssh-alias-codex-routing/';
    return;
  }
  if (command === 'open 2') {
    window.location.href = '/posts/qq-pet-codex/';
    return;
  }
  if (command === 'gh profile') {
    window.open('https://github.com/shubolab/shubolab', '_blank', 'noopener,noreferrer');
    addEntry(command, 'opening github.com/shubolab/shubolab');
    return;
  }

  const response = responses[command];
  if (response) {
    addEntry(command, typeof response === 'function' ? response() : response);
  } else {
    addEntry(command, `bash: ${command}: command not found`, true);
  }
}

function completeInput() {
  const value = input.value.toLowerCase();
  const matches = commandNames.filter((command) => command.startsWith(value));
  if (matches.length === 1) input.value = matches[0];
  else if (matches.length > 1) addEntry(value || '[tab]', matches.join('  '));
}

function moveHistory(direction) {
  if (!history.length) return;
  historyIndex = Math.min(history.length, Math.max(0, historyIndex + direction));
  input.value = history[historyIndex] ?? '';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = input.value;
  input.value = '';
  runCommand(value);
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') { event.preventDefault(); moveHistory(-1); }
  if (event.key === 'ArrowDown') { event.preventDefault(); moveHistory(1); }
  if (event.key === 'Tab') { event.preventDefault(); completeInput(); }
  if (event.ctrlKey && event.key.toLowerCase() === 'l') { event.preventDefault(); runCommand('clear'); }
});

document.querySelectorAll('[data-command]').forEach((button) => {
  button.addEventListener('click', () => runCommand(button.dataset.command));
});

document.querySelector('.new-session').addEventListener('click', () => runCommand('ls posts'));

document.querySelectorAll('.extra-keys button').forEach((button) => {
  button.addEventListener('click', () => {
    const insert = button.dataset.insert;
    const action = button.dataset.keyAction;
    if (insert) input.setRangeText(insert, input.selectionStart, input.selectionEnd, 'end');
    if (action === 'escape') input.value = '';
    if (action === 'tab') completeInput();
    if (action === 'up') moveHistory(-1);
    if (action === 'down') moveHistory(1);
    if (action === 'home') input.setSelectionRange(0, 0);
    if (action === 'end') input.setSelectionRange(input.value.length, input.value.length);
    if (action === 'control' || action === 'alt') button.classList.toggle('latched');
    input.focus();
  });
});
