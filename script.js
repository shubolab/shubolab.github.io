const form = document.querySelector('#cli-form');
const input = document.querySelector('#cli-input');
const cliOutput = document.querySelector('#cli-output');
const bootTranscript = document.querySelector('#boot-transcript');
const history = [];
let historyIndex = 0;
let bootAnimationFrame = null;
let bootTextNodes = [];
let bootIsStreaming = false;

const commandNames = [
  'help', 'neofetch', 'whoami', 'pwd', 'ls', 'ls posts', 'cat about.md', 'cat contact.txt',
  'gh profile', 'open 1', 'open 2', 'clear', 'reset', 'history', 'date', 'sudo'
];

const responses = {
  help: 'help             show commands\nneofetch         show profile\nwhoami           print user\npwd              print working directory\nls posts         list published posts\ncat about.md     show about\ncat contact.txt  show contact\ngh profile       open profile source\nopen 1           open SSH alias post\nopen 2           open QQ pet post\nclear            clear screen\nreset            restore initial screen',
  neofetch: 'shubo@lab\n--------------------\nProfile:   Shubo\nFocus:     LLM Application Development\nSecurity:  Cybersecurity\nLanguages: Python, Go\nShell:     zsh + Powerlevel10k\nSessions:  3\nPosts:     2\nGitHub:    shubolab',
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

function createPrompt(command) {
  const prompt = document.createElement('div');
  prompt.className = 'p10k-prompt';
  const context = document.createElement('div');
  context.className = 'p10k-context';
  context.innerHTML = '<span class="prompt-rail">╭─</span><span class="prompt-segment host visitor">visitor@shubolab</span><span class="prompt-segment path">~</span><span class="prompt-ok">✓</span>';
  const commandLine = document.createElement('div');
  commandLine.className = 'p10k-command';
  const arrow = document.createElement('span');
  arrow.textContent = '╰─❯';
  const code = document.createElement('code');
  code.textContent = command;
  commandLine.append(arrow, code);
  prompt.append(context, commandLine);
  return prompt;
}

function addEntry(command, result, error = false) {
  const entry = document.createElement('div');
  entry.className = 'terminal-entry';
  const resultLine = document.createElement('pre');
  resultLine.className = error ? 'result error' : 'result';
  resultLine.textContent = result;
  entry.append(createPrompt(command), resultLine);
  cliOutput.append(entry);
  entry.scrollIntoView({ block: 'nearest' });
}

function revealBootText() {
  bootTextNodes.forEach(({ node, text }) => { node.nodeValue = text; });
  document.body.classList.remove('stream-active', 'stream-interrupted');
  bootTranscript.querySelectorAll('.stream-visible, .stream-output-visible').forEach((element) => {
    element.classList.remove('stream-visible', 'stream-output-visible');
  });
  bootIsStreaming = false;
}

function stopBootStream(interrupted = false) {
  if (!bootIsStreaming) return;
  cancelAnimationFrame(bootAnimationFrame);
  bootIsStreaming = false;
  if (interrupted) {
    document.body.classList.add('stream-interrupted');
    const interrupt = document.createElement('p');
    interrupt.className = 'interrupt-line';
    interrupt.textContent = '^C';
    cliOutput.append(interrupt);
    input.focus({ preventScroll: true });
  } else {
    revealBootText();
  }
}

function startBootStream() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const walker = document.createTreeWalker(bootTranscript, NodeFilter.SHOW_TEXT);
  let currentNode;
  while ((currentNode = walker.nextNode())) {
    if (!currentNode.nodeValue.trim()) continue;
    bootTextNodes.push({ node: currentNode, text: currentNode.nodeValue });
  }
  const totalCharacters = bootTextNodes.reduce((sum, item) => sum + item.text.length, 0);
  if (!totalCharacters) return;

  bootTextNodes.forEach(({ node }) => { node.nodeValue = ''; });
  document.body.classList.add('stream-active');
  bootIsStreaming = true;
  const startedAt = performance.now();
  const duration = 1800;

  const render = (now) => {
    if (!bootIsStreaming) return;
    const target = Math.min(totalCharacters, Math.floor(((now - startedAt) / duration) * totalCharacters));
    let remaining = target;
    for (const item of bootTextNodes) {
      const visibleLength = Math.min(item.text.length, Math.max(0, remaining));
      item.node.nodeValue = item.text.slice(0, visibleLength);
      if (visibleLength > 0) {
        item.node.parentElement?.closest('.terminal-entry')?.classList.add('stream-visible');
        item.node.parentElement?.closest('.output')?.classList.add('stream-output-visible');
      }
      remaining -= visibleLength;
    }
    if (target >= totalCharacters) {
      revealBootText();
      return;
    }
    bootAnimationFrame = requestAnimationFrame(render);
  };
  bootAnimationFrame = requestAnimationFrame(render);
}

function runCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!command) return;
  history.push(command);
  historyIndex = history.length;

  if (command === 'clear') {
    stopBootStream(false);
    bootTranscript.hidden = true;
    cliOutput.replaceChildren();
    return;
  }
  if (command === 'reset') {
    revealBootText();
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
  if (response) addEntry(command, typeof response === 'function' ? response() : response);
  else addEntry(command, `bash: ${command}: command not found`, true);
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

document.addEventListener('keydown', (event) => {
  if (bootIsStreaming && event.ctrlKey && event.key.toLowerCase() === 'c') {
    event.preventDefault();
    stopBootStream(true);
  }
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

startBootStream();
