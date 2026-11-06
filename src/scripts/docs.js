const theme = document.querySelector('[data-theme-select]');
try {
  const saved = localStorage.getItem('laraveljs-docs-theme');
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.dataset.theme = saved;
    theme.value = saved;
  }
} catch {}
theme.addEventListener('change', () => {
  document.documentElement.dataset.theme = theme.value;
  try {
    localStorage.setItem('laraveljs-docs-theme', theme.value);
  } catch {}
});

const menu = document.querySelector('.docs-menu');
const sidebar = document.getElementById('docs-navigation');
menu.addEventListener('click', () => {
  const open = sidebar.toggleAttribute('data-open');
  menu.setAttribute('aria-expanded', String(open));
});

const dialog = document.querySelector('.docs-search-dialog');
const search = dialog.querySelector('input');
const results = [...dialog.querySelectorAll('.docs-results a')];
const noResults = dialog.querySelector('[role="status"]');
function filterResults() {
  const query = search.value.trim().toLowerCase();
  for (const result of results) {
    result.hidden = query ? !result.textContent.toLowerCase().includes(query) : result.href.includes('#');
  }
  noResults.hidden = results.some(result => !result.hidden);
}
function openSearch() {
  if (!dialog.open) {
    search.value = '';
    filterResults();
    dialog.showModal();
    search.focus();
  }
}
document.querySelector('[data-search-open]').addEventListener('click', openSearch);
search.addEventListener('input', filterResults);
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openSearch();
  }
});
dialog.addEventListener('keydown', event => {
  const visible = results.filter(result => !result.hidden);
  const index = visible.indexOf(document.activeElement);
  if (event.key === 'Escape') {
    event.preventDefault();
    dialog.close();
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    const next = event.key === 'ArrowDown' ? visible[Math.min(index + 1, visible.length - 1)] : visible[index - 1];
    (next ?? search).focus();
  } else if (event.key === 'Enter' && event.target === search) {
    event.preventDefault();
    visible[0]?.click();
  }
});
dialog.addEventListener('click', event => {
  if (event.target === dialog || event.target.closest('.docs-results a')) {
    dialog.close();
  }
});
