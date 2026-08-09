const filterButtons = document.querySelectorAll('.filter');
const articleRows = document.querySelectorAll('.article-row');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    articleRows.forEach((row) => {
      row.classList.toggle('is-hidden', filter !== 'all' && row.dataset.category !== filter);
    });
  });
});

document.querySelector('.subscribe-form').addEventListener('submit', (event) => {
  const email = document.querySelector('#email').value;
  if (!email) return;
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  button.textContent = '✓';
  button.setAttribute('aria-label', '已提交');
  document.querySelector('.subscribe-form p').textContent = '收到。谢谢你愿意一起保持好奇。';
});
