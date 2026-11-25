'use strict';

// One state object connects the five scenes. No framework or external data is needed.
const state = { scene: 0, dismissed: new Set(), thoughts: {}, selectedThought: null, threshold: 50, paused: false };
const sceneNames = ['Arrival', 'The noise', 'The untangling', 'The boundary', 'After hours'];
const notifications = [
  { id: 'message', icon: '✉', app: 'GROUP CHAT', text: 'Just checking… did you see my last message?' },
  { id: 'deadline', icon: '◷', app: 'REMINDER', text: 'Tomorrow is already asking for your attention.' },
  { id: 'feed', icon: '♡', app: 'YOUR FEED', text: 'There are 27 things you haven’t caught up on.' },
  { id: 'sale', icon: '%', app: 'ONE LAST OFFER', text: 'Something you didn’t need. Before midnight.' },
  { id: 'mind', icon: '⋯', app: 'YOUR OWN MIND', text: 'Maybe just check everything one more time.' }
];
const thoughtLabels = ['A conversation', 'An unfinished task', 'A moment for myself'];
const $ = (selector) => document.querySelector(selector);
const scenes = [...document.querySelectorAll('.scene')];
const liveStatus = $('#live-status');
let notificationTimers = new Map();

function announce(text) { liveStatus.textContent = text; }

function showScene(index, focus = true) {
  if (!Number.isInteger(index) || index < 0 || index >= scenes.length) return;
  state.scene = index;
  scenes.forEach((scene, i) => {
    scene.hidden = i !== index;
    scene.classList.toggle('active', i === index);
  });
  document.body.dataset.scene = String(index);
  $('#back').hidden = index === 0;
  document.querySelectorAll('#journey button').forEach((button, i) => {
    if (i === index) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  $('#footer-caption').textContent = sceneNames[index].toUpperCase();
  if (index === 4) renderEnding();
  if (focus) {
    const heading = scenes[index].querySelector('h1, h2');
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  announce(`Moment ${index + 1} of 5. ${sceneNames[index]}.`);
}

// Every experimental gesture has a direct button/keyboard alternative.
sceneNames.forEach((name, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', `Go to ${name}`);
  button.addEventListener('click', () => showScene(index));
  $('#journey').append(button);
});
$('#back').addEventListener('click', () => showScene(state.scene - 1));
$('#enter').addEventListener('click', () => showScene(1));
$('.wordmark').addEventListener('click', (event) => { event.preventDefault(); showScene(0); });
$('#noise-next').addEventListener('click', () => showScene(2));
$('#sort-next').addEventListener('click', () => showScene(3));
$('#boundary-next').addEventListener('click', () => showScene(4));

// Rotate the dial by dragging. Arrow keys and the begin button also work.
const dial = document.createElement('div');
dial.className = 'dial-wrap';
dial.setAttribute('role', 'slider');
dial.tabIndex = 0;
dial.setAttribute('aria-label', 'Turn the night dial to begin');
dial.setAttribute('aria-valuemin', '0');
dial.setAttribute('aria-valuemax', '100');
dial.setAttribute('aria-valuenow', '0');
dial.setAttribute('aria-valuetext', '0 percent. Drag clockwise or press the right arrow.');
dial.innerHTML = '<span class="dial-knob" aria-hidden="true"></span><span class="dial-value" aria-hidden="true">0%</span><span class="dial-label" aria-hidden="true">TURN DOWN THE DAY</span>';
$('#scene-0').append(dial);
let dialValue = 0;
let dialLastAngle = null;
function setDial(value) {
  dialValue = Math.max(0, Math.min(100, value));
  dial.style.setProperty('--dial-angle', `${dialValue * 2.7}deg`);
  dial.setAttribute('aria-valuenow', String(Math.round(dialValue)));
  dial.setAttribute('aria-valuetext', `${Math.round(dialValue)} percent. Turn to 100 to begin.`);
  dial.querySelector('.dial-value').textContent = `${Math.round(dialValue)}%`;
  if (dialValue >= 100 && state.scene === 0) showScene(1);
}
function pointerAngle(event) {
  const rect = dial.getBoundingClientRect();
  return Math.atan2(event.clientY - rect.top - rect.height / 2, event.clientX - rect.left - rect.width / 2) * 180 / Math.PI;
}
dial.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;
  dialLastAngle = pointerAngle(event);
  dial.setPointerCapture(event.pointerId);
});
dial.addEventListener('pointermove', (event) => {
  if (dialLastAngle === null || state.scene !== 0) return;
  const angle = pointerAngle(event);
  let difference = angle - dialLastAngle;
  if (difference > 180) difference -= 360;
  if (difference < -180) difference += 360;
  setDial(dialValue + difference / 2.7);
  dialLastAngle = angle;
});
function releaseDial() { dialLastAngle = null; }
dial.addEventListener('pointerup', releaseDial);
dial.addEventListener('pointercancel', releaseDial);
dial.addEventListener('lostpointercapture', releaseDial);
dial.addEventListener('keydown', (event) => {
  if (['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 100 : dialValue + (['ArrowRight', 'ArrowUp'].includes(event.key) ? 10 : -10);
    setDial(next);
  }
});

function renderNotifications() {
  const field = $('#notification-field');
  field.replaceChildren();
  notifications.forEach((item) => {
    if (state.dismissed.has(item.id)) return;
    const card = document.createElement('article');
    card.className = 'notification';
    card.dataset.id = item.id;
    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = item.icon;
    const copy = document.createElement('div');
    copy.className = 'notification-copy';
    const app = document.createElement('small');
    app.textContent = item.app;
    const message = document.createElement('p');
    message.textContent = item.text;
    copy.append(app, message);
    const dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.className = 'dismiss';
    dismiss.textContent = '×';
    dismiss.setAttribute('aria-label', `Dismiss ${item.app.toLowerCase()} notification`);
    dismiss.addEventListener('click', () => dismissNotification(item.id, card, true));
    card.append(icon, copy, dismiss);
    attachSwipe(card, item.id);
    field.append(card);
  });
  updateNoise();
}

function updateNoise() {
  const count = state.dismissed.size;
  $('#noise-progress').textContent = `${count} of ${notifications.length} interruptions cleared`;
  $('#noise-next').disabled = count !== notifications.length;
  if (count === notifications.length && !$('#notification-field .cleared-message')) {
    const message = document.createElement('p');
    message.className = 'cleared-message';
    message.textContent = 'A little room to think.';
    $('#notification-field').append(message);
  }
}

function dismissNotification(id, card, moveFocus = false) {
  if (state.dismissed.has(id)) return;
  state.dismissed.add(id);
  card.classList.add('leaving');
  // Remove after a short CSS exit; the timer also works when animations are paused.
  const timer = window.setTimeout(() => {
    card.remove();
    notificationTimers.delete(id);
    updateNoise();
    if (moveFocus && state.scene === 1) {
      const next = $('#notification-field .notification:not(.leaving) .dismiss') || $('#noise-next');
      next.focus({ preventScroll: true });
    }
  }, state.paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300);
  notificationTimers.set(id, timer);
  $('#noise-progress').textContent = `${state.dismissed.size} of ${notifications.length} interruptions cleared`;
  announce(`Interruption dismissed. ${notifications.length - state.dismissed.size} remaining.`);
}

function attachSwipe(card, id) {
  let start = null;
  card.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || event.target.closest('button')) return;
    start = { x: event.clientX, y: event.clientY };
    card.setPointerCapture(event.pointerId);
    card.classList.add('dragging');
  });
  card.addEventListener('pointermove', (event) => {
    if (!start) return;
    const distance = event.clientX - start.x;
    card.style.transform = `translateX(${distance}px) rotate(${distance / 35}deg)`;
    card.style.opacity = String(Math.max(.2, 1 - Math.abs(distance) / 350));
  });
  card.addEventListener('pointerup', (event) => {
    if (!start) return;
    const distance = event.clientX - start.x;
    const vertical = event.clientY - start.y;
    start = null;
    card.classList.remove('dragging');
    card.style.transform = '';
    card.style.opacity = '';
    if (Math.abs(distance) >= 75 && Math.abs(distance) > Math.abs(vertical)) dismissNotification(id, card);
  });
  const cancel = () => { start = null; card.classList.remove('dragging'); card.style.transform = ''; card.style.opacity = ''; };
  card.addEventListener('pointercancel', cancel);
  card.addEventListener('lostpointercapture', cancel);
}

function renderThoughts(focusNext = false) {
  const thoughtList = $('#thoughts');
  thoughtList.replaceChildren();
  thoughtLabels.forEach((label, index) => {
    if (state.thoughts[index]) return;
    const thought = document.createElement('button');
    thought.type = 'button';
    thought.className = 'thought';
    thought.dataset.thought = String(index);
    thought.textContent = label;
    thought.setAttribute('aria-pressed', String(state.selectedThought === index));
    thought.addEventListener('click', () => selectThought(index));
    attachThoughtDrag(thought, index);
    thoughtList.append(thought);
  });
  for (const bucket of ['keep', 'later']) {
    const list = $(bucket === 'keep' ? '#kept-items' : '#later-items');
    list.replaceChildren();
    thoughtLabels.forEach((label, index) => {
      if (state.thoughts[index] === bucket) {
        const item = document.createElement('span');
        item.textContent = label;
        list.append(item);
      }
    });
  }
  const count = Object.keys(state.thoughts).length;
  $('#sort-next').disabled = count !== thoughtLabels.length;
  $('#sort-progress').textContent = count === thoughtLabels.length ? 'Everything has a place. You can change your choices by starting another night.' : `${count} of ${thoughtLabels.length} thoughts placed. Select a thought, then a place.`;
  if (focusNext) (thoughtList.querySelector('button') || $('#sort-next')).focus({ preventScroll: true });
}

function selectThought(index) {
  if (state.thoughts[index]) return;
  state.selectedThought = index;
  document.querySelectorAll('.thought').forEach((button) => button.setAttribute('aria-pressed', String(Number(button.dataset.thought) === index)));
  announce(`${thoughtLabels[index]} selected. Choose Keep close or Let it wait.`);
  $('#sort-progress').textContent = `${thoughtLabels[index]} selected. Choose its place below.`;
}

function placeThought(bucket) {
  if (state.selectedThought === null) { announce('Select a thought first, then choose a place.'); return; }
  const index = state.selectedThought;
  state.thoughts[index] = bucket;
  state.selectedThought = null;
  renderThoughts(true);
  announce(`${thoughtLabels[index]} ${bucket === 'keep' ? 'kept close' : 'left for later'}.`);
}
document.querySelectorAll('.sort-zone').forEach((zone) => zone.addEventListener('click', () => placeThought(zone.dataset.bucket)));

function attachThoughtDrag(thought, index) {
  let origin = null;
  let moved = false;
  thought.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    origin = { x: event.clientX, y: event.clientY };
    moved = false;
    thought.setPointerCapture(event.pointerId);
  });
  thought.addEventListener('pointermove', (event) => {
    if (!origin) return;
    const x = event.clientX - origin.x;
    const y = event.clientY - origin.y;
    if (Math.hypot(x, y) > 8) moved = true;
    if (!moved) return;
    thought.classList.add('dragging');
    thought.style.transform = `translate(${x}px,${y}px)`;
    highlightZone(event.clientX, event.clientY);
  });
  thought.addEventListener('pointerup', (event) => {
    if (!origin) return;
    const zone = zoneAt(event.clientX, event.clientY);
    const wasMoved = moved;
    origin = null;
    clearDrag();
    if (wasMoved && zone) { state.selectedThought = index; placeThought(zone.dataset.bucket); }
  });
  function clearDrag() {
    thought.classList.remove('dragging');
    thought.style.transform = '';
    document.querySelectorAll('.sort-zone').forEach((zone) => zone.classList.remove('drop-ready'));
  }
  thought.addEventListener('pointercancel', () => { origin = null; clearDrag(); });
  thought.addEventListener('lostpointercapture', () => { origin = null; clearDrag(); });
}
function zoneAt(x, y) {
  return [...document.querySelectorAll('.sort-zone')].find((zone) => {
    const rect = zone.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  });
}
function highlightZone(x, y) {
  const target = zoneAt(x, y);
  document.querySelectorAll('.sort-zone').forEach((zone) => zone.classList.toggle('drop-ready', zone === target));
}

const signalWords = ['one more email', 'reply now', 'almost midnight', 'keep scrolling', 'what if', 'new message', 'don’t forget', 'refresh', 'still there?', 'check again', 'tomorrow', 'last chance'];
signalWords.forEach((text) => { const word = document.createElement('span'); word.textContent = text; $('.signal-wall').append(word); });
function updateThreshold(value) {
  state.threshold = Math.max(0, Math.min(100, Number(value) || 0));
  $('#threshold').value = String(state.threshold);
  $('#threshold-value').textContent = `${state.threshold}%`;
  $('#boundary-world').style.setProperty('--threshold', `${state.threshold}%`);
  $('#boundary-world').style.setProperty('--signal-opacity', String(1 - state.threshold / 100));
  $('#boundary-word').textContent = state.threshold >= 80 ? 'Only the quiet' : state.threshold >= 40 ? 'A little less' : 'Still connected';
  $('#boundary-description').textContent = state.threshold >= 80 ? 'The outside can wait.' : state.threshold >= 40 ? 'Some things can wait.' : 'There is room for the world.';
}
$('#threshold').addEventListener('input', (event) => updateThreshold(event.target.value));

function renderEnding() {
  const kept = thoughtLabels.filter((_, index) => state.thoughts[index] === 'keep');
  const later = thoughtLabels.filter((_, index) => state.thoughts[index] === 'later');
  const counts = state.dismissed.size > 0 ? `You set aside ${state.dismissed.size} interruption${state.dismissed.size === 1 ? '' : 's'}. ` : '';
  const thoughtText = kept.length ? `You made room for ${kept.map((text) => text.toLowerCase()).join(', ')}.` : later.length ? 'You left your thoughts here for another time.' : 'You can leave the rest for another time.';
  $('#quiet-summary').textContent = counts + thoughtText;
}

function restart() {
  notificationTimers.forEach((timer) => window.clearTimeout(timer));
  notificationTimers = new Map();
  state.dismissed.clear();
  state.thoughts = {};
  state.selectedThought = null;
  dialValue = 0;
  setDial(0);
  updateThreshold(50);
  renderNotifications();
  renderThoughts();
  showScene(0);
}
$('#restart').addEventListener('click', restart);
$('#motion').addEventListener('click', () => {
  state.paused = !state.paused;
  document.body.classList.toggle('motion-paused', state.paused);
  $('#motion').setAttribute('aria-pressed', String(state.paused));
  $('#motion').textContent = state.paused ? 'Resume motion' : 'Pause motion';
});
$('#about-open').addEventListener('click', () => $('#about').showModal());
$('#about-close').addEventListener('click', () => $('#about').close());
$('#about').addEventListener('click', (event) => { if (event.target === $('#about')) { const rect = $('#about').getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) $('#about').close(); } });
renderNotifications();
renderThoughts();
updateThreshold(50);
showScene(0, false);
