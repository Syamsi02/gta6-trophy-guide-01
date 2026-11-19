// Platinum Road: an offline GTA VI trophy guide and tracker for the 55 PS5 trophies.
// Progress lives in localStorage, exports and imports as JSON, and never leaves the browser.
// Filters cover kind, grade and text; the spoiler setting hides story trophy names and
// descriptions until they are earned; the roadmap orders the road to the platinum.
const STORAGE_KEY = 'platinum-road-progress-v1';
const THEME_KEY = 'platinum-road-theme';
const SPOILER_KEY = 'platinum-road-spoilers';

const listEl = document.getElementById('trophyList');
const detailEl = document.getElementById('detail');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kind');
const gradeEl = document.getElementById('grade');
const spoilerEl = document.getElementById('spoiler');
const earnedCountEl = document.getElementById('earnedCount');
const barFillEl = document.getElementById('barFill');
const progressPctEl = document.getElementById('progressPct');
const resultCountEl = document.getElementById('resultCount');
const emptyStateEl = document.getElementById('emptyState');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

let earned = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'));
let selectedId = null;
let currentView = 'checklist';

const ROADMAP_STAGES = [
  {
    title: 'Play the story, chapters 1 to 4',
    text: 'Follow the main story from Gone Fishing through Chapter 4 and the final mission. This earns the 12 story trophies plus the gold for the final mission.',
    ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    title: 'Do the one-off moments as they come up',
    text: 'While you are in the story, grab the missable moments: the 4-star escape with your partner, the three-shop robbery run, the VCIA departure, the quiet jewelry store, the armored truck, the showroom smash, and the choice and second-chance trophies. They are flagged Missable in the list.',
    ids: [33, 34, 37, 39, 41, 45, 48, 49, 50],
  },
  {
    title: 'Finish the stranger strands',
    text: 'Complete the mission chains for Andy, Kenton, Billy, Randy and Tyrone, plus the hunt for Bret, until 8 stranger strands are done.',
    ids: [22, 23, 24, 25, 26, 27, 29],
  },
  {
    title: 'Collectibles and exploration',
    text: 'Meditate at all 18 spots, complete 3 card sets, WAiNK It at 100 locations, discover 100 vehicles, explore all 52 areas, buy all 8 garages and register 10 vehicles in the Scooter Bros app.',
    ids: [28, 30, 31, 35, 42, 54, 55],
  },
  {
    title: 'Grinds, activities and cleanup',
    text: 'Last, the long counts: 250 stunts, gold in all 42 Shooting Range challenges, wins at all 14 drone race locations and in 20 different races, 50 challenges, 5 bank vaults, one illegal operation per gang, and the money trophies. Then 100% completion and the platinum.',
    ids: [1, 14, 15, 16, 17, 18, 19, 20, 21, 32, 36, 38, 40, 43, 44, 46, 47, 51, 52, 53],
  },
];

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function saveTheme() {
  localStorage.setItem(THEME_KEY, document.body.dataset.theme);
}

function applyTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'night' || saved === 'paper') document.body.dataset.theme = saved;
  document.getElementById('themeBtn').textContent =
    document.body.dataset.theme === 'night' ? 'Paper theme' : 'Night theme';
}

function trophyHidden(t) {
  return spoilerEl.checked && t.kind === 'story' && !earned.has(t.id);
}

function visibleTrophies() {
  const q = searchEl.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (kindEl.value === 'missable') { if (!t.missable) return false; }
    else if (kindEl.value === 'online') return false;
    else if (kindEl.value !== 'all' && t.kind !== kindEl.value) return false;
    if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
    if (q && !`${t.name} ${t.description} ${t.guide}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

function trophyRow(t) {
  const li = document.createElement('li');
  if (earned.has(t.id)) li.classList.add('earned');
  if (selectedId === t.id) li.classList.add('selected');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.id);
  box.setAttribute('aria-label', `Mark ${t.name} earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.id);
    else earned.delete(t.id);
    saveProgress();
    renderAll();
  });
  const body = document.createElement('div');
  const name = document.createElement('div');
  name.className = 'trophy-name';
  name.textContent = trophyHidden(t) ? 'Hidden story trophy' : t.name;
  const desc = document.createElement('div');
  desc.className = 'trophy-desc';
  desc.textContent = trophyHidden(t)
    ? 'Spoilers hidden — earn this trophy to reveal its name and description.'
    : t.description;
  const meta = document.createElement('div');
  meta.className = 'trophy-meta';
  const grade = document.createElement('span');
  grade.className = `pill grade-${t.grade}`;
  grade.textContent = t.grade;
  meta.append(grade);
  if (t.count != null) {
    const count = document.createElement('span');
    count.className = 'pill';
    count.textContent = `count ${t.count}`;
    meta.append(count);
  }
  if (t.missable) {
    const flag = document.createElement('span');
    flag.className = 'pill missable';
    flag.textContent = 'Missable';
    meta.append(flag);
  }
  if (t.hidden) {
    const h = document.createElement('span');
    h.className = 'pill';
    h.textContent = 'Hidden on PSN';
    meta.append(h);
  }
  body.append(name, desc, meta);
  li.append(box, body);
  li.addEventListener('click', (event) => {
    if (event.target === box) return;
    selectedId = t.id;
    renderAll();
  });
  return li;
}

function renderList() {
  const shown = visibleTrophies();
  listEl.replaceChildren(...shown.map(trophyRow));
  resultCountEl.textContent = `Showing ${shown.length} of ${trophies.length} trophies`;
  emptyStateEl.hidden = shown.length !== 0;
  const missable = trophies.filter((t) => t.missable);
  document.getElementById('missableList').replaceChildren(...missable.map(trophyRow));
}

function renderProgress() {
  const n = earned.size;
  const pct = Math.round((n / trophies.length) * 100);
  earnedCountEl.textContent = n;
  barFillEl.style.width = `${pct}%`;
  progressPctEl.textContent = `${pct}% to platinum`;
}

function renderDetail() {
  const t = trophies.find((x) => x.id === selectedId);
  if (!t) {
    detailEl.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'placeholder';
    p.textContent = 'Pick a trophy to read its guide and sources.';
    detailEl.append(p);
    return;
  }
  detailEl.innerHTML = '';
  const h = document.createElement('h2');
  h.textContent = trophyHidden(t) ? 'Hidden story trophy' : t.name;
  const meta = document.createElement('div');
  meta.className = 'trophy-meta';
  const grade = document.createElement('span');
  grade.className = `pill grade-${t.grade}`;
  grade.textContent = t.grade;
  meta.append(grade);
  if (t.missable) {
    const flag = document.createElement('span');
    flag.className = 'pill missable';
    flag.textContent = 'Missable';
    meta.append(flag);
  }
  const desc = document.createElement('p');
  desc.textContent = trophyHidden(t)
    ? 'Spoilers hidden — earn this trophy to reveal its name and description.'
    : t.description;
  const guide = document.createElement('p');
  guide.className = 'guide';
  guide.textContent = t.guide;
  const note = document.createElement('p');
  note.className = 'unverified';
  note.textContent = 'Not yet checked in the game — GTA VI released today.';
  const sources = document.createElement('p');
  sources.className = 'sources';
  sources.textContent = t.sources;
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.textContent = earned.has(t.id) ? 'Mark as not earned' : 'Mark as earned';
  toggle.addEventListener('click', () => {
    if (earned.has(t.id)) earned.delete(t.id);
    else earned.add(t.id);
    saveProgress();
    renderAll();
  });
  detailEl.append(h, meta, desc, guide, note, sources, toggle);
}

function renderRoadmap() {
  const ol = document.getElementById('roadmapStages');
  ol.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const li = document.createElement('li');
    const h = document.createElement('h3');
    h.textContent = stage.title;
    const p = document.createElement('p');
    p.textContent = stage.text;
    const names = document.createElement('p');
    names.className = 'stage-trophies';
    names.textContent = stage.ids
      .map((id) => trophies.find((t) => t.id === id).name)
      .join(' · ');
    li.append(h, p, names);
    ol.append(li);
  }
}

function showView(view) {
  currentView = view;
  document.getElementById('checklistView').hidden = view !== 'checklist';
  document.getElementById('roadmapView').hidden = view !== 'roadmap';
  document.getElementById('missablesView').hidden = view !== 'missables';
  for (const [id, v] of [['viewChecklist', 'checklist'], ['viewRoadmap', 'roadmap'], ['viewMissables', 'missables']]) {
    document.getElementById(id).classList.toggle('active', v === view);
  }
}

function renderAll() {
  renderList();
  renderProgress();
  renderDetail();
}

document.getElementById('viewChecklist').addEventListener('click', () => showView('checklist'));
document.getElementById('viewRoadmap').addEventListener('click', () => showView('roadmap'));
document.getElementById('viewMissables').addEventListener('click', () => showView('missables'));
document.getElementById('themeBtn').addEventListener('click', () => {
  document.body.dataset.theme = document.body.dataset.theme === 'night' ? 'paper' : 'night';
  saveTheme();
  applyTheme();
});
spoilerEl.addEventListener('change', () => {
  localStorage.setItem(SPOILER_KEY, spoilerEl.checked ? '1' : '0');
  renderAll();
});
searchEl.addEventListener('input', renderList);
kindEl.addEventListener('change', renderList);
gradeEl.addEventListener('change', renderList);
// Pressing / anywhere jumps to the search box, so a long list stays quick to scan.
document.addEventListener('keydown', (event) => {
  if (event.key === '/' && document.activeElement !== searchEl) {
    event.preventDefault();
    searchEl.focus();
  }
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort((a, b) => a - b) }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'platinum-road-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('importFile').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    earned = new Set(ids.filter((id) => trophies.some((t) => t.id === id)));
    saveProgress();
    renderAll();
  } catch {
    alert('That file is not valid Platinum Road progress JSON.');
  }
  event.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all earned trophies?')) return;
  earned = new Set();
  saveProgress();
  renderAll();
});

function applyDemoParams() {
  const params = new URLSearchParams(location.search);
  const demo = params.get('demo');
  if (!demo) return;
  const demoEarned = [2, 3, 8, 15, 16, 19, 20, 21, 28, 35, 42, 44, 53];
  earned = new Set(demoEarned);
  saveProgress();
  if (demo === 'roadmap') showView('roadmap');
  else if (demo === 'missables') { showView('missables'); }
  else if (demo === 'spoiler') { spoilerEl.checked = true; showView('checklist'); }
  else { showView('checklist'); selectedId = 17; }
  if (demo === 'missables' || demo === 'spoiler') selectedId = 33;
}

spoilerEl.checked = localStorage.getItem(SPOILER_KEY) === '1';
applyTheme();
applyDemoParams();
if (selectedId == null && currentView === 'checklist') selectedId = 17;
renderRoadmap();
renderAll();
