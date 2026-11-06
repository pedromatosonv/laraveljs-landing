const menuLinks = {
  Framework: [['Overview', '#framework'], ['Starter Kits', '#tooling'], ['Documentation', '#examples'], ['Design principles', '#principles']],
  Products: [['LaravelJS Cloud', '#cloud'], ['Preview Environments', '#cloud'], ['Nightwatch', '#tooling']],
  Resources: [['Code Examples', '#examples'], ['Frontend Integrations', '#tooling'], ['Original Laravel project', 'https://laravel.com/']],
  Events: [['Community events', '#events'], ['Laracon EU', 'https://laracon.eu/']],
  'Sign in': [['Original Laravel Cloud', 'https://cloud.laravel.com/'], ['Original Laravel Nightwatch', 'https://nightwatch.laravel.com/']],
};

function createLink(label, href) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = label;
  return link;
}

const navigation = document.querySelector('nav');
const mobileMenu = document.createElement('div');
mobileMenu.className = 'ljs-mobile';
mobileMenu.id = 'mobile-menu';
mobileMenu.hidden = true;
for (const label of ['Framework', 'Products', 'Resources', 'Events']) {
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.textContent = label;
  details.append(summary, ...menuLinks[label].map(([name, href]) => createLink(name, href)));
  mobileMenu.append(details);
}
mobileMenu.append(createLink('Docs', '#examples'));
const mobileSearch = document.createElement('button');
mobileSearch.type = 'button';
mobileSearch.dataset.search = '';
mobileSearch.textContent = 'Search docs';
mobileMenu.append(mobileSearch);
navigation.append(mobileMenu);

const mobileTrigger = navigation.querySelector('[data-mobile]');
mobileTrigger.setAttribute('aria-controls', mobileMenu.id);
function showMobile(open) {
  mobileMenu.hidden = !open;
  mobileTrigger.setAttribute('aria-expanded', String(open));
  mobileTrigger.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
}
showMobile(false);
mobileTrigger.addEventListener('click', () => showMobile(mobileMenu.hidden));
mobileMenu.addEventListener('click', (event) => {
  if (event.target.closest('a,button')) showMobile(false);
});

let closeCurrentMenu = () => {};
for (const trigger of navigation.querySelectorAll('[data-menu][aria-expanded]')) {
  const items = menuLinks[trigger.dataset.menu];
  const wrapper = trigger.parentElement;
  const panel = document.createElement('div');
  panel.className = 'ljs-menu';
  panel.hidden = true;
  panel.id = 'menu-' + trigger.dataset.menu.toLowerCase().replaceAll(' ', '-');
  panel.style.left = '0';
  wrapper.style.position = 'relative';
  panel.append(...items.map(([name, href]) => createLink(name, href)));
  wrapper.append(panel);
  trigger.setAttribute('aria-controls', panel.id);
  trigger.removeAttribute('aria-haspopup');
  const close = () => {
    panel.hidden = true;
    trigger.dataset.state = 'closed';
    trigger.setAttribute('aria-expanded', 'false');
  };
  trigger.addEventListener('click', () => {
    const opening = panel.hidden;
    closeCurrentMenu();
    if (!opening) return;
    panel.hidden = false;
    trigger.dataset.state = 'open';
    trigger.setAttribute('aria-expanded', 'true');
    closeCurrentMenu = close;
  });
  panel.addEventListener('click', close);
}
document.addEventListener('click', (event) => {
  if (!event.target.closest('[data-menu],.ljs-menu')) closeCurrentMenu();
  if (!event.target.closest('nav')) showMobile(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const trigger = navigation.querySelector('[data-menu][aria-expanded="true"]');
    closeCurrentMenu();
    trigger?.focus();
    if (!mobileMenu.hidden) {
      showMobile(false);
      mobileTrigger.focus();
    }
  }
});

const examples = {
  Auth: [['routes/web.ts', "Route.get('/dashboard', async ({ auth, view }) => {\n  const user = await auth.user()\n  return view('dashboard', { user })\n}).middleware('auth')"], ['UserController.ts', "export class UserController {\n  async show({ auth, view }) {\n    return view('profile', { user: await auth.user() })\n  }\n}"]],
  'AI SDK': [['routes/api.ts', "Route.post('/summarize', async ({ request }) => {\n  const result = await SummaryAgent.prompt(request.input('text'))\n  return { summary: result.text }\n})"], ['SummaryAgent.ts', "export const SummaryAgent = Agent.create({\n  instructions: 'Summarize the key points in plain language.',\n})"]],
  ORM: [['Post.ts', "export class Post extends Model {\n  static table = 'posts'\n  static author = belongsTo(User)\n}"], ['PostController.ts', "const posts = await Post.query()\n  .where('published', true)\n  .with('author')\n  .latest()\n  .paginate(20)"]],
  Migrations: [['create_posts.ts', "export async function up(schema) {\n  await schema.create('posts', table => {\n    table.id()\n    table.string('title')\n    table.timestamps()\n  })\n}"], ['rollback.ts', "export async function down(schema) {\n  await schema.drop('posts')\n}"]],
  Validation: [['CreatePost.ts', "export const CreatePost = schema.object({\n  title: schema.string().min(3).max(100),\n  body: schema.string().min(10),\n})"], ['PostController.ts', "const input = await request.validate(CreatePost)\nconst post = await Post.create(input)\nreturn response.created(post)"]],
  Storage: [['UploadController.ts', "const file = request.file('avatar')\nconst path = await Storage.disk('s3').put('avatars', file)\nreturn { url: await Storage.url(path) }"], ['config/storage.ts', "export default {\n  disk: env('STORAGE_DISK', 'local'),\n  visibility: 'private',\n}"]],
  Queues: [['SendWelcomeEmail.ts', "export class SendWelcomeEmail extends Job {\n  async handle({ userId }) {\n    const user = await User.findOrFail(userId)\n    await Mail.to(user.email).send(new WelcomeEmail(user))\n  }\n}"], ['UserController.ts', "const user = await User.create(input)\nawait SendWelcomeEmail.dispatch({ userId: user.id })\nreturn response.created(user)"]],
  Testing: [['posts.test.ts', "test('guests cannot publish posts', async ({ client }) => {\n  const response = await client.post('/posts', { title: 'Hello' })\n  response.assertStatus(401)\n})"], ['UserFactory.ts', "export const UserFactory = Factory.define(User, ({ faker }) => ({\n  email: faker.internet.email(),\n}))"]],
};
const exampleButtons = [...document.querySelectorAll('[data-example]')];
const fileTabs = [...document.querySelectorAll('[data-file]')];
let activeExample = 'Auth';
let activeFile = 0;

function highlight(code, source) {
  code.replaceChildren();
  const pattern = /(\/\/[^\n]*|'[^']*'|\b(?:async|await|const|return|class|export|default|extends|new|function|true)\b)/g;
  let cursor = 0;
  for (const match of source.matchAll(pattern)) {
    code.append(source.slice(cursor, match.index));
    const token = document.createElement('span');
    token.className = match[0].startsWith('//') ? 'comment' : match[0].startsWith("'") ? 'str' : 'kw';
    token.textContent = match[0];
    code.append(token);
    cursor = match.index + match[0].length;
  }
  code.append(source.slice(cursor));
}

function renderExamples() {
  for (const button of exampleButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.example === activeExample));
  }
  for (const [i, tab] of fileTabs.entries()) {
    const [filename, source] = examples[activeExample][i];
    const selected = i === activeFile;
    tab.querySelector('.ljs-filename').textContent = filename;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    panel.hidden = !selected;
    highlight(panel.querySelector('code'), source);
  }
}
for (const button of exampleButtons) {
  button.addEventListener('click', () => {
    activeExample = button.dataset.example;
    activeFile = 0;
    renderExamples();
  });
}
for (const [index, tab] of fileTabs.entries()) {
  tab.addEventListener('click', () => {
    activeFile = index;
    renderExamples();
  });
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    fileTabs[1 - index].click();
    fileTabs[1 - index].focus();
  });
}
renderExamples();

const dialog = document.getElementById('search-dialog');
const searchInput = dialog.querySelector('input');
const searchResults = dialog.querySelector('.ljs-search-results');
const searchEntries = [
  ['Framework overview', 'LaravelJS conventions and framework features', '#framework'],
  ...Object.keys(examples).map(name => [name, 'TypeScript code example', '#examples']),
  ['Cloud and previews', 'Deployment workflow', '#cloud'],
  ['Frontend starter kits', 'React, Vue and Svelte', '#tooling'],
];
function renderSearch() {
  const query = searchInput.value.trim().toLowerCase();
  searchResults.replaceChildren();
  for (const [label, description, href] of searchEntries) {
    if (!(label + ' ' + description).toLowerCase().includes(query)) continue;
    const link = createLink(label, href);
    const sub = document.createElement('small');
    sub.textContent = description;
    link.append(sub);
    link.addEventListener('click', () => {
      exampleButtons.find(button => button.dataset.example === label)?.click();
      dialog.close();
    });
    searchResults.append(link);
  }
  if (!searchResults.childElementCount) {
    const empty = document.createElement('p');
    empty.textContent = 'No matching documentation.';
    searchResults.append(empty);
  }
}
function openSearch() {
  if (dialog.open) return;
  searchInput.value = '';
  renderSearch();
  dialog.showModal();
  searchInput.focus();
}
for (const button of document.querySelectorAll('[data-search]')) button.addEventListener('click', openSearch);
searchInput.addEventListener('input', renderSearch);
searchInput.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    searchResults.querySelector('a')?.focus();
  }
  if (event.key === 'Enter') {
    event.preventDefault();
    searchResults.querySelector('a')?.click();
  }
});
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openSearch();
  }
});

const aiToggle = document.querySelector('[aria-label="Toggle AI"]');
aiToggle?.addEventListener('click', () => {
  const enabled = aiToggle.getAttribute('aria-pressed') === 'true';
  aiToggle.setAttribute('aria-pressed', String(!enabled));
  document.getElementById('framework').classList.toggle('ljs-ai-off', enabled);
});

function showCube(side, index) {
  for (const group of document.querySelectorAll('[data-' + side + '-cube]')) {
    const active = Number(group.getAttribute('data-' + side + '-cube')) === index;
    group.classList.toggle('opacity-0', !active);
    group.classList.toggle('blur-sm', !active);
  }
}
let cubeIndex = 0;
const cubeInterval = matchMedia('(prefers-reduced-motion: reduce)').matches ? null : setInterval(() => {
  cubeIndex++;
  showCube('tool', cubeIndex % document.querySelectorAll('[data-tool-cube]').length);
  showCube('front', cubeIndex % document.querySelectorAll('[data-front-cube]').length);
}, 2500);
for (const [side, attribute] of [['tool', 'data-hero-tool'], ['front', 'data-hero-front']]) {
  for (const tile of document.querySelectorAll('[' + attribute + ']')) {
    tile.addEventListener('click', () => {
      clearInterval(cubeInterval);
      showCube(side, Number(tile.getAttribute(attribute)));
    });
  }
}

document.querySelector('#updates form').addEventListener('submit', (event) => {
  event.preventDefault();
  event.currentTarget.querySelector('[role="status"]').textContent = 'Thanks for trying the demo. No information was sent.';
  event.currentTarget.reset();
});
