const form = document.querySelector('#cli-form');
const input = document.querySelector('#cli-input');
const output = document.querySelector('#cli-output');

const commands = {
  help: () => 'about · profile · posts · contact · open 1 · open 2 · github · clear',
  about: () => scrollToSection('about', 'opened ./about.md'),
  profile: () => scrollToSection('github-profile', 'loaded shubolab/shubolab'),
  posts: () => scrollToSection('posts', 'listed ./posts/'),
  contact: () => scrollToSection('contact', 'opened ./contact.txt'),
  'open 1': () => navigate('/posts/ssh-alias-codex-routing/'),
  'open 2': () => navigate('/posts/qq-pet-codex/'),
  github: () => navigate('https://github.com/shubolab', true),
  clear: () => {
    output.replaceChildren();
    return null;
  },
};

function scrollToSection(id, message) {
  document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' });
  return message;
}

function navigate(url, external = false) {
  if (external) window.open(url, '_blank', 'noopener,noreferrer');
  else window.location.href = url;
  return `opening ${url}`;
}

function printResult(command, result, isError = false) {
  const history = document.createElement('p');
  history.textContent = `visitor@shubolab:~$ ${command}`;
  const response = document.createElement('p');
  response.textContent = result;
  if (isError) response.className = 'error';
  output.replaceChildren(history, response);
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const command = input.value.trim().toLowerCase().replace(/\s+/g, ' ');
  input.value = '';
  if (!command) return;

  const handler = commands[command];
  if (!handler) {
    printResult(command, `command not found: ${command}. Try "help".`, true);
    return;
  }

  const result = handler();
  if (result) printResult(command, result);
});
