const docsHref = document.querySelector('[data-docs-link]').getAttribute('href');

const menuLinks = {
  Framework: [['Overview', '#framework'], ['Documentation', docsHref], ['Code examples', '#examples'], ['Frontend integrations', '#frontend']],
  Products: [['Cloud concept', '#cloud'], ['Preview environments', '#previews'], ['Observability', '#observability']],
  Resources: [['Code examples', '#examples'], ['Design principles', '#principles'], ['Frontend integrations', '#frontend']],
};

const menuColumns = {
  Framework: [
    ['Explore LaravelJS', ['Overview', 'Framework conventions', '#framework'], ['Documentation', 'Read the framework guides', docsHref], ['Code examples', 'Explore the proposed API', '#examples']],
    ['Features', ['Auth', 'Authentication example', '#examples', 'Auth'], ['ORM', 'Database model example', '#examples', 'ORM'], ['Queues', 'Background jobs example', '#examples', 'Queues']],
    ['Examples', ['Migrations', '', '#examples', 'Migrations'], ['Validation', '', '#examples', 'Validation'], ['Storage', '', '#examples', 'Storage'], ['Testing', '', '#examples', 'Testing']],
    ['Frontend integrations', ['React, Vue and Svelte', 'Explore the frontend concept', '#frontend']],
  ],
  Products: [
    ['Cloud concept', ['Deployment', 'From local development to the cloud', '#cloud']],
    ['Preview environments', ['Review changes', 'Preview pull requests before merging', '#previews']],
    ['Observability', ['Monitor applications', 'Explore the tooling concept', '#observability']],
  ],
  Resources: [
    ['Learn', ['Framework overview', '', '#framework'], ['Code examples', '', '#examples'], ['Design principles', '', '#principles']],
    ['Explore', ['Frontend integrations', '', '#frontend'], ['Cloud concept', '', '#cloud']],
    ['Code examples', ['Authentication', 'See the proposed API', '#examples', 'Auth'], ['Database ORM', 'Explore models and queries', '#examples', 'ORM'], ['Testing', 'Explore application tests', '#examples', 'Testing']],
  ],
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
mobileMenu.setAttribute('role', 'dialog');
mobileMenu.setAttribute('aria-modal', 'true');
mobileMenu.setAttribute('aria-label', 'Navigation');
const mobileHeader = document.createElement('div');
mobileHeader.className = 'ljs-mobile-header';
const mobileTitle = document.createElement('div');
mobileTitle.className = 'ljs-mobile-title';
const mobileIcons = document.getElementById('mobile-menu-icons').content;
const mobileClose = document.createElement('button');
mobileClose.type = 'button';
mobileClose.className = 'ljs-mobile-close';
mobileClose.setAttribute('aria-label', 'Close navigation menu');
mobileClose.append(mobileIcons.querySelector('[data-close]').cloneNode(true));
mobileHeader.append(mobileTitle, mobileClose);
const mobileList = document.createElement('div');
mobileList.className = 'ljs-mobile-list';
const mobileScreen = document.createElement('div');
mobileScreen.append(mobileHeader, mobileList);
mobileMenu.append(mobileScreen);
const mobileViewport = document.createElement('div');
mobileViewport.className = 'ljs-mobile-viewport';
mobileViewport.append(mobileMenu);
navigation.append(mobileViewport);

const mobileTrigger = navigation.querySelector('[data-mobile]');
mobileTrigger.setAttribute('aria-controls', mobileMenu.id);
mobileTrigger.setAttribute('aria-expanded', 'false');
let mobileOpen = false;
let mobileOverlayAnimation;
let mobileSection = null;
let mobileLastTrigger = null;
let previousOverflow = '';
let mobileBackground = [];
let mobileTransition;
function renderMobile(section = null) {
  mobileTransition?.();
  if (section !== mobileSection && !mobileMenu.hidden && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const outgoing = mobileScreen.cloneNode(true);
    outgoing.className = 'ljs-mobile-outgoing';
    outgoing.inert = true;
    outgoing.setAttribute('aria-hidden', 'true');
    mobileMenu.prepend(outgoing);
    const direction = section ? 1 : -1;
    const timing = { duration: 250, easing: 'ease-out' };
    const leaving = outgoing.animate([{ translate: '0' }, { translate: `${-100 * direction}%` }], timing);
    const entering = mobileScreen.animate([{ translate: `${100 * direction}%` }, { translate: '0' }], timing);
    const cleanup = () => {
      leaving.cancel();
      entering.cancel();
      outgoing.remove();
      mobileTransition = undefined;
    };
    mobileTransition = cleanup;
    entering.addEventListener('finish', cleanup, { once: true });
  }
  mobileSection = section;
  mobileScreen.toggleAttribute('data-submenu', Boolean(section));
  mobileTitle.replaceChildren();
  mobileList.replaceChildren();
  if (section) {
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'ljs-mobile-back';
    back.setAttribute('aria-label', 'Back to main menu');
    back.addEventListener('click', () => {
      renderMobile();
      [...mobileList.querySelectorAll('button')].find(button => button.textContent === mobileLastTrigger)?.focus({ preventScroll: true });
    });
    const heading = document.createElement('span');
    heading.textContent = section;
    back.append(mobileIcons.querySelector('[data-back]').cloneNode(true), heading);
    mobileTitle.append(back);
    for (const [label, href] of menuLinks[section]) {
      mobileList.append(createLink(label, href));
    }
    back.focus({ preventScroll: true });
    return;
  }
  const logo = createLink('LaravelJS', '#top');
  logo.className = 'ljs-logo';
  logo.setAttribute('aria-label', 'LaravelJS home');
  mobileTitle.append(logo);
  for (const label of ['Framework', 'Products', 'Resources']) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ljs-mobile-section';
    button.textContent = label;
    button.append(mobileIcons.querySelector('[data-chevron]').cloneNode(true));
    button.addEventListener('click', () => {
      mobileLastTrigger = label;
      renderMobile(label);
    });
    mobileList.append(button);
  }
  mobileList.append(createLink('Docs', docsHref));
  const search = document.createElement('button');
  search.type = 'button';
  search.dataset.search = '';
  search.textContent = 'Search docs';
  mobileList.append(search);
}
function showMobile(open, restoreFocus = true, animate = true) {
  if (mobileOpen === open) {
    if (!open && !animate) {
      mobileOverlayAnimation?.cancel();
      mobileMenu.hidden = true;
    }
    return;
  }
  const currentOffset = mobileMenu.hidden ? '100%' : getComputedStyle(mobileMenu).translate;
  mobileOverlayAnimation?.cancel();
  const shouldAnimate = animate && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  mobileOpen = open;
  if (open) {
    previousOverflow = document.body.style.overflow;
    renderMobile();
    mobileBackground = [...navigation.parentElement.children, ...navigation.children]
      .filter(element => element !== navigation && element !== mobileViewport)
      .map(element => [element, element.inert]);
    for (const [element] of mobileBackground) {
      element.inert = true;
    }
    mobileMenu.hidden = false;
    mobileMenu.inert = false;
    document.body.style.overflow = 'hidden';
    mobileClose.focus({ preventScroll: true });
  } else {
    mobileTransition?.();
    mobileMenu.inert = true;
    document.body.style.overflow = previousOverflow;
    for (const [element, inert] of mobileBackground) {
      element.inert = inert;
    }
    mobileBackground = [];
    mobileSection = null;
    if (restoreFocus) {
      mobileTrigger.focus({ preventScroll: true });
    }
  }
  if (shouldAnimate) {
    mobileOverlayAnimation = mobileMenu.animate(
      [{ translate: currentOffset }, { translate: open ? '0' : '100%' }],
      { duration: 300, easing: 'ease-out' },
    );
    if (!open) {
      mobileOverlayAnimation.addEventListener('finish', () => { mobileMenu.hidden = true; }, { once: true });
    }
  } else if (!open) {
    mobileMenu.hidden = true;
  }
  mobileTrigger.setAttribute('aria-expanded', String(open));
  mobileTrigger.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
}
mobileTrigger.addEventListener('click', () => showMobile(!mobileOpen));
mobileClose.addEventListener('click', () => showMobile(false));
mobileMenu.addEventListener('click', (event) => {
  if (event.target.closest('a,[data-search]')) {
    const search = event.target.closest('[data-search]');
    showMobile(false, Boolean(search));
    if (search) {
      openSearch();
    }
  }
});
mobileMenu.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const focusable = [...mobileScreen.querySelectorAll('a,button')]
    .filter(element => element.getClientRects().length > 0);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

let closeCurrentMenu = null;
let finishMenuExit;
let menuHoverTimer;
const menuTriggers = [...navigation.querySelectorAll('[data-menu][aria-expanded]')];
const megaTriggers = menuTriggers.filter(trigger => trigger.dataset.menu !== 'Project');
for (const trigger of menuTriggers) {
  const panel = document.createElement('div');
  const name = trigger.dataset.menu;
  panel.className = name === 'Project' ? 'ljs-menu ljs-signin' : 'ljs-menu ljs-mega';
  panel.hidden = true;
  panel.id = 'menu-' + name.toLowerCase().replaceAll(' ', '-');
  panel.setAttribute('aria-label', name);
  if (name === 'Project') {
    panel.setAttribute('role', 'dialog');
    panel.tabIndex = -1;
    panel.append(document.getElementById('project-links').content.cloneNode(true));
    const githubIcon = navigation.querySelector('a[href$="/laraveljs-landing"] svg').cloneNode(true);
    githubIcon.setAttribute('aria-hidden', 'true');
    panel.querySelector('[data-project-repository]').prepend(githubIcon);
    trigger.parentElement.append(panel);
  } else {
    panel.dataset.columns = String(menuColumns[name].length);
    for (const [heading, ...items] of menuColumns[name]) {
      const column = document.createElement('section');
      const title = document.createElement('h3');
      title.textContent = heading;
      column.append(title);
      for (const [label, description, href, example] of items) {
        const link = createLink(label, href);
        if (description) {
          const detail = document.createElement('small');
          detail.textContent = description;
          link.append(detail);
        }
        if (example) {
          link.dataset.selectExample = example;
        }
        column.append(link);
      }
      panel.append(column);
    }
    if (name === 'Products') {
      const previews = document.getElementById('product-previews').content.children;
      for (const [index, column] of [...panel.children].entries()) {
        column.append(previews[index].cloneNode(true));
      }
    }
    navigation.append(panel);
    const links = [...panel.querySelectorAll('a')];
    const firstLink = links[0];
    const nextControl = trigger.parentElement.nextElementSibling.querySelector('button, a');
    for (const link of links) {
      link.tabIndex = -1;
    }
    const triggerIndex = megaTriggers.indexOf(trigger);
    const arrowTargets = {
      ArrowLeft: megaTriggers[triggerIndex - 1],
      ArrowRight: megaTriggers[triggerIndex + 1],
      Home: megaTriggers[0],
      End: megaTriggers.at(-1),
    };
    trigger.addEventListener('keydown', event => {
      const entersPanel = event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey);
      if (entersPanel && trigger.getAttribute('aria-expanded') === 'true') {
        event.preventDefault();
        firstLink.focus();
      }
      const lateralControl = arrowTargets[event.key];
      if (lateralControl) {
        event.preventDefault();
        lateralControl.focus();
      }
    });
    panel.addEventListener('keydown', event => {
      if (event.key !== 'Tab') {
        return;
      }
      const index = links.indexOf(document.activeElement);
      const target = event.shiftKey ? links[index - 1] ?? trigger : links[index + 1] ?? nextControl;
      event.preventDefault();
      target.focus();
    });
  }
  trigger.setAttribute('aria-controls', panel.id);
  const close = ({ animate = true } = {}) => {
    clearTimeout(menuHoverTimer);
    for (const animation of panel.getAnimations({ subtree: true })) {
      animation.cancel();
    }
    if (animate && name !== 'Project' && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      panel.dataset.closing = '';
      panel.inert = true;
      const exit = panel.animate(
        [{ opacity: 1, scale: '1', rotate: 'x 0deg' }, { opacity: 0, scale: '.96', rotate: 'x -8deg' }],
        { duration: 250, easing: 'ease-out' },
      );
      finishMenuExit = () => {
        exit.cancel();
        panel.hidden = true;
        delete panel.dataset.closing;
        panel.inert = false;
        finishMenuExit = undefined;
      };
      exit.addEventListener('finish', finishMenuExit, { once: true });
    } else {
      panel.hidden = true;
    }
    closeCurrentMenu = null;
    trigger.dataset.state = 'closed';
    trigger.setAttribute('aria-expanded', 'false');
  };
  const open = () => {
    clearTimeout(menuHoverTimer);
    finishMenuExit?.();
    const previousPanel = navigation.querySelector('.ljs-mega:not([hidden])');
    const previousHeight = previousPanel?.offsetHeight;
    closeCurrentMenu?.({ animate: false });
    panel.hidden = false;
    trigger.dataset.state = 'open';
    trigger.setAttribute('aria-expanded', 'true');
    closeCurrentMenu = close;
    if (name === 'Project') {
      panel.focus({ preventScroll: true });
      return;
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const timing = { duration: 250, easing: 'ease-out' };
    if (!previousPanel) {
      panel.animate([{ opacity: 0, scale: '.96' }, { opacity: 1, scale: '1' }], timing);
      return;
    }
    panel.animate([{ height: previousHeight + 'px' }, { height: panel.offsetHeight + 'px' }], timing);
    const movesRight = previousPanel.compareDocumentPosition(panel) & Node.DOCUMENT_POSITION_FOLLOWING;
    const offset = movesRight ? '24px' : '-24px';
    for (const column of panel.children) {
      column.animate([{ translate: offset, opacity: .4 }, { translate: '0', opacity: 1 }], timing);
    }
  };
  trigger.addEventListener('click', () => {
    if (trigger.getAttribute('aria-expanded') === 'false') {
      open();
    } else {
      close();
    }
  });
  if (name === 'Project') {
    matchMedia('(min-width: 405px)').addEventListener('change', event => {
      if (event.matches || panel.hidden) {
        return;
      }
      const restoreFocus = panel.contains(document.activeElement);
      close({ animate: false });
      if (restoreFocus) {
        mobileTrigger.focus({ preventScroll: true });
      }
    });
  }
  if (name !== 'Project') {
    let hoverStarted = false;
    const scheduleClose = event => {
      if (event.pointerType !== 'mouse') {
        return;
      }
      hoverStarted = false;
      clearTimeout(menuHoverTimer);
      if (trigger.getAttribute('aria-expanded') === 'true') {
        menuHoverTimer = setTimeout(close, 150);
      }
    };
    trigger.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || hoverStarted) {
        return;
      }
      hoverStarted = true;
      clearTimeout(menuHoverTimer);
      if (trigger.getAttribute('aria-expanded') === 'false') {
        const anotherMenuOpen = navigation.querySelector('.ljs-mega:not([hidden], [data-closing])');
        menuHoverTimer = setTimeout(open, anotherMenuOpen ? 0 : 200);
      }
    });
    trigger.addEventListener('pointerleave', scheduleClose);
    panel.addEventListener('pointerenter', () => clearTimeout(menuHoverTimer));
    panel.addEventListener('pointerleave', scheduleClose);
  }
  panel.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    if (link.dataset.selectExample) {
      document.querySelector('[data-example="' + link.dataset.selectExample + '"]').click();
    }
    close();
  });
}
const desktopNavigation = matchMedia('(min-width: 1024px)');
desktopNavigation.addEventListener('change', event => {
  const active = document.activeElement;
  const mobileSectionTrigger = mobileOpen && event.matches
    ? megaTriggers.find(trigger => trigger.dataset.menu === mobileSection) ?? megaTriggers[0]
    : null;
  const moveFocusToMobile = !event.matches
    && (megaTriggers.includes(active) || active.closest('.ljs-mega'));
  clearTimeout(menuHoverTimer);
  finishMenuExit?.();
  closeCurrentMenu?.({ animate: false });
  showMobile(false, false, false);
  mobileSectionTrigger?.focus({ preventScroll: true });
  if (moveFocusToMobile) {
    mobileTrigger.focus({ preventScroll: true });
  }
});
navigation.addEventListener('focusout', event => {
  if (event.relatedTarget && !navigation.contains(event.relatedTarget)) {
    closeCurrentMenu?.();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('[data-menu],.ljs-menu')) {
    closeCurrentMenu?.();
  }
  if (!event.composedPath().includes(navigation)) showMobile(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    clearTimeout(menuHoverTimer);
    const trigger = navigation.querySelector('[data-menu][aria-expanded="true"]');
    closeCurrentMenu?.();
    trigger?.focus();
    if (mobileOpen) {
      if (mobileSection) {
        renderMobile();
        [...mobileList.querySelectorAll('button')].find(button => button.textContent === mobileLastTrigger)?.focus({ preventScroll: true });
      } else {
        showMobile(false);
      }
    }
  }
});

const examples = Object.fromEntries(
  [...document.querySelectorAll('template[data-example-category]')].map(template => [
    template.dataset.exampleCategory,
    [...template.content.children],
  ]),
);
const exampleButtons = [...document.querySelectorAll('[data-example]')];
const fileTabs = [...document.querySelectorAll('[data-file]')];
const exampleIndicator = document.querySelector('.ljs-example-indicator');
let activeExample = 'Auth';
let activeFile = 0;

function renderExamples() {
  const selectedExample = exampleButtons.find(button => button.dataset.example === activeExample);
  const selectedItem = selectedExample.parentElement;
  if (exampleIndicator.parentElement !== selectedItem) {
    const before = exampleIndicator.getBoundingClientRect();
    for (const animation of exampleIndicator.getAnimations()) {
      animation.cancel();
    }
    selectedItem.prepend(exampleIndicator);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const after = exampleIndicator.getBoundingClientRect();
      exampleIndicator.animate([
        { transform: `translateX(${before.left - after.left}px) scaleX(${before.width / after.width})` },
        { transform: 'none' },
      ], { duration: 230, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
  }
  for (const button of exampleButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.example === activeExample));
  }
  for (const [i, tab] of fileTabs.entries()) {
    const file = examples[activeExample][i];
    tab.hidden = !file;
    tab.parentElement.hidden = !file;
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (!file) {
      tab.setAttribute('aria-selected', 'false');
      tab.tabIndex = -1;
      panel.hidden = true;
      continue;
    }
    const filename = file.dataset.filename;
    const selected = i === activeFile;
    tab.querySelector('.ljs-filename').textContent = filename;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    panel.hidden = !selected;
    if (selected && panel.dataset.exampleCategory !== activeExample) {
      panel.querySelector('.ljs-code').replaceChildren(file.firstElementChild.cloneNode(true));
      panel.dataset.exampleCategory = activeExample;
      panel.scrollTo({ left: 0, behavior: 'instant' });
    }
  }
}
for (const button of exampleButtons) {
  button.addEventListener('click', () => {
    const rail = button.closest('ul');
    const bounds = rail.getBoundingClientRect();
    const item = button.getBoundingClientRect();
    const hiddenLeft = item.left - bounds.left - rail.clientLeft;
    const hiddenRight = item.right - bounds.left - rail.clientLeft - rail.clientWidth;
    const offset = Math.min(0, hiddenLeft) || Math.max(0, hiddenRight);
    if (offset) {
      const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      rail.scrollBy({ left: offset, behavior: reduceMotion ? 'instant' : 'smooth' });
    }
    if (activeExample === button.dataset.example) {
      return;
    }
    activeExample = button.dataset.example;
    activeFile = 0;
    for (const tab of fileTabs) {
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      delete panel.dataset.exampleCategory;
    }
    renderExamples();
  });
}
for (const [index, tab] of fileTabs.entries()) {
  tab.addEventListener('click', () => {
    activeFile = index;
    renderExamples();
  });
  tab.addEventListener('keydown', (event) => {
    const visibleTabs = fileTabs.filter(file => !file.hidden);
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      return;
    }
    event.preventDefault();
    let target;
    if (event.key === 'Home') {
      target = visibleTabs[0];
    } else if (event.key === 'End') {
      target = visibleTabs.at(-1);
    } else {
      const direction = event.key === 'ArrowLeft' ? -1 : 1;
      target = visibleTabs[(index + direction + visibleTabs.length) % visibleTabs.length];
    }
    target.click();
    target.focus();
  });
}

const dialog = document.getElementById('search-dialog');
const searchInput = dialog.querySelector('input');
const clearSearch = dialog.querySelector('[data-search-clear]');
const searchResults = dialog.querySelector('.ljs-search-results');
let searchOpenedOnDesktop;
const docEntries = [...document.getElementById('landing-doc-search').content.querySelectorAll('a')]
  .map(link => [link.textContent, link.dataset.description, link.getAttribute('href')]);
const searchEntries = [
  ...docEntries,
  ['Framework overview', 'LaravelJS conventions and framework features', '#framework'],
  ...Object.keys(examples).map(name => [name, 'TypeScript code example', '#examples']),
  ['Cloud', 'Deployment workflow', '#cloud'],
  ['Preview environments', 'Pull request previews', '#previews'],
  ['Observability', 'Application monitoring', '#observability'],
  ['Frontend starter kits', 'React, Vue and Svelte', '#frontend'],
];
function renderSearch() {
  const query = searchInput.value.trim().toLowerCase();
  clearSearch.hidden = !searchInput.value;
  searchResults.replaceChildren();
  searchResults.hidden = !query;
  if (!query) return;
  const terms = query.split(/\s+/);
  for (const [label, description, href] of searchEntries) {
    const source = href === '#examples' ? examples[label]?.map(file => file.dataset.filename + ' ' + file.textContent).join(' ') : '';
    const text = (label + ' ' + description + ' ' + (source ?? '')).toLowerCase();
    if (!terms.every(term => text.includes(term))) {
      continue;
    }
    const link = createLink(label, href);
    const sub = document.createElement('small');
    sub.textContent = description;
    link.append(sub);
    link.addEventListener('click', () => {
      if (href === '#examples') {
        exampleButtons.find(button => button.dataset.example === label)?.click();
      }
      dialog.close();
    });
    searchResults.append(link);
  }
  if (!searchResults.childElementCount) {
    const empty = document.createElement('p');
    empty.textContent = 'No matching results.';
    searchResults.append(empty);
  }
}
function openSearch() {
  if (dialog.open) return;
  searchOpenedOnDesktop = desktopNavigation.matches;
  searchInput.value = '';
  renderSearch();
  dialog.showModal();
  searchInput.focus();
}
for (const button of document.querySelectorAll('[data-search]')) button.addEventListener('click', openSearch);
searchInput.addEventListener('input', renderSearch);
clearSearch.addEventListener('click', () => {
  searchInput.value = '';
  renderSearch();
  searchInput.focus();
});
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
searchResults.addEventListener('keydown', event => {
  if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return;
  const links = [...searchResults.querySelectorAll('a')];
  const index = links.indexOf(document.activeElement);
  if (index < 0) return;
  event.preventDefault();
  if (event.key === 'ArrowUp' && index === 0) {
    searchInput.focus();
  } else {
    const next = event.key === 'ArrowDown' ? Math.min(index + 1, links.length - 1) : index - 1;
    links[next].focus();
  }
});
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  const active = document.activeElement;
  if (searchOpenedOnDesktop === desktopNavigation.matches
    || (active !== document.body && active.getClientRects().length)) {
    return;
  }
  const target = desktopNavigation.matches ? navigation.querySelector('[data-search]') : mobileTrigger;
  target.focus({ preventScroll: true });
});
dialog.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    dialog.close();
  }
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
  const title = aiToggle.closest('h2');
  const word = title.querySelector('span span span');
  const wordFrame = word.parentElement;
  const previousWidth = wordFrame.getBoundingClientRect().width;
  for (const animation of wordFrame.getAnimations()) {
    animation.cancel();
  }
  aiToggle.setAttribute('aria-pressed', String(!enabled));
  document.getElementById('framework').classList.toggle('ljs-ai-off', enabled);
  title.nextElementSibling.setAttribute('aria-hidden', String(!enabled));
  word.textContent = enabled ? 'ready' : 'enabled';
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    wordFrame.animate(
      [{ width: previousWidth + 'px' }, { width: word.getBoundingClientRect().width + 'px' }],
      { duration: 200, easing: 'ease-out' },
    );
  }
});

const cubePalettes = {
  tool: ['#222', '#1a73e8', '#D97757'],
  front: ['#4E243D', '#B2EDD3', '#087EA4', '#FE640B'],
};

function showCube(side, index) {
  for (const face of document.querySelectorAll('[data-cube-face="' + side + '"]')) {
    face.setAttribute('fill', cubePalettes[side][index]);
  }
  for (const group of document.querySelectorAll('[data-' + side + '-cube]')) {
    const active = Number(group.getAttribute('data-' + side + '-cube')) === index;
    group.classList.toggle('opacity-0', !active);
    group.classList.toggle('blur-sm', !active);
  }
}
let cubeIndex = 0;
let cubeInterval;
let cubeArtworkVisible = false;
let cubeManuallySelected = false;
const cubeMotionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const toolCubeCount = document.querySelectorAll('[data-tool-cube]').length;
const frontCubeCount = document.querySelectorAll('[data-front-cube]').length;
const cubeArtwork = document.querySelector('[data-hero-tool]').ownerSVGElement;

function updateCubeRotation() {
  clearInterval(cubeInterval);
  if (!cubeArtworkVisible || document.hidden || cubeMotionPreference.matches || cubeManuallySelected) {
    return;
  }
  cubeInterval = setInterval(() => {
    cubeIndex++;
    showCube('tool', cubeIndex % toolCubeCount);
    showCube('front', cubeIndex % frontCubeCount);
  }, 2500);
}

const cubeVisibility = new IntersectionObserver(([entry]) => {
  cubeArtworkVisible = entry.isIntersecting && entry.intersectionRatio > 0;
  updateCubeRotation();
});
cubeVisibility.observe(cubeArtwork);
document.addEventListener('visibilitychange', updateCubeRotation);
cubeMotionPreference.addEventListener('change', updateCubeRotation);

for (const [side, attribute] of [['tool', 'data-hero-tool'], ['front', 'data-hero-front']]) {
  for (const tile of document.querySelectorAll('[' + attribute + ']')) {
    tile.addEventListener('click', () => {
      cubeManuallySelected = true;
      updateCubeRotation();
      showCube(side, Number(tile.getAttribute(attribute)));
    });
  }
}

document.querySelector('#updates form').addEventListener('submit', (event) => {
  event.preventDefault();
});
