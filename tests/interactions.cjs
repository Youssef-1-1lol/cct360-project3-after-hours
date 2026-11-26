/* DOM integration checks. Run with linkedom installed as a development dependency.
   These exercise the real app script, but do not replace visual/mobile browser QA. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { parseHTML } = require(process.env.AFTER_HOURS_TEST_DOM || 'linkedom');
const root = path.resolve(__dirname, '..');
const { document, window: dom } = parseHTML(fs.readFileSync(path.join(root, 'index.html'), 'utf8'));
let focus = null;
dom.HTMLElement.prototype.focus = function () { focus = this; };
dom.HTMLElement.prototype.setPointerCapture = function () {};
dom.HTMLElement.prototype.getBoundingClientRect = function () {
  if (this.dataset.bucket === 'keep') return {left:0,top:200,right:200,bottom:400,width:200,height:200};
  if (this.dataset.bucket === 'later') return {left:220,top:200,right:420,bottom:400,width:200,height:200};
  return {left:0,top:0,right:160,bottom:160,width:160,height:160};
};
let timerId = 0; const timers = new Map();
const window = {
  setTimeout(fn) { timers.set(++timerId, fn); return timerId; },
  clearTimeout(id) { timers.delete(id); },
  matchMedia() { return {matches:false}; },
  scrollTo() {}
};
const context = vm.createContext({document,window,console});
vm.runInContext(fs.readFileSync(path.join(root,'script.js'),'utf8'), context);
const $ = s => document.querySelector(s);
const all = s => [...document.querySelectorAll(s)];
const click = s => $(s).click();
function event(el,type,props={}) { const e=new dom.Event(type,{bubbles:true,cancelable:true}); for(const [k,v] of Object.entries(props)) Object.defineProperty(e,k,{value:v}); el.dispatchEvent(e); }
function flush(){for(const [id,fn] of [...timers]){timers.delete(id);fn();}}
function active(i){assert.equal($('#scene-'+i).hidden,false);assert.equal(all('.scene').filter(s=>!s.hidden).length,1);}
function go(i){all('#journey button')[i].click();active(i);}
let checks=0;function test(name,fn){fn();checks++;console.log('PASS '+name);}
test('Five scenes initialize with one visible and disabled sequential gates',()=>{active(0);assert.equal(all('#journey button').length,5);assert.equal(all('.notification').length,5);assert.equal($('#noise-next').disabled,true);assert.equal($('#sort-next').disabled,true);});
test('Dial keyboard input reaches the next scene with focus on its heading',()=>{for(let i=0;i<10;i++)event($('.dial-wrap'),'keydown',{key:'ArrowRight'});active(1);assert.equal(focus.id,'title-1');});
test('Duplicate dismissals count once and never skip remaining notifications',()=>{const b=$('.dismiss');b.click();b.click();assert.equal($('#noise-progress').textContent,'1 of 5 interruptions cleared');flush();assert.equal(all('.notification').length,4);assert.equal($('#noise-next').disabled,true);});
test('Dismissal finishes and enables the next scene',()=>{all('.dismiss').forEach(b=>b.click());flush();assert.equal(all('.notification').length,0);assert.equal($('#noise-next').disabled,false);assert.equal(all('.cleared-message').length,1);click('#noise-next');active(2);});
test('Empty zone selection does not consume a thought',()=>{click('[data-bucket="keep"]');assert.equal(all('.thought').length,3);assert.match($('#live-status').textContent,/Select a thought/);});
test('Button alternatives sort thoughts, retain names and unlock progression',()=>{click('[data-thought="0"]');assert.equal($('[data-thought="0"]').getAttribute('aria-pressed'),'true');click('[data-bucket="keep"]');click('[data-thought="1"]');click('[data-bucket="later"]');click('[data-thought="2"]');click('[data-bucket="later"]');assert.equal(all('.thought').length,0);assert.match($('#kept-items').textContent,/A conversation/);assert.match($('#later-items').textContent,/An unfinished task/);assert.equal($('#sort-next').disabled,false);click('#sort-next');active(3);});
test('Threshold endpoints update words, CSS variables and percentage',()=>{const s=$('#threshold');s.value='100';event(s,'input');assert.equal($('#threshold-value').textContent,'100%');assert.equal($('#boundary-word').textContent,'Only the quiet');assert.equal($('#boundary-world').style.getPropertyValue('--signal-opacity'),'0');s.value='0';event(s,'input');assert.equal($('#boundary-word').textContent,'Still connected');assert.equal($('#boundary-world').style.getPropertyValue('--signal-opacity'),'1');});
test('Ending reflects actual choices',()=>{click('#boundary-next');active(4);assert.match($('#quiet-summary').textContent,/5 interruptions/);assert.match($('#quiet-summary').textContent,/a conversation/);assert.doesNotMatch($('#quiet-summary').textContent,/unfinished task/);});
test('Restart clears progress and returns all controls to their initial state',()=>{click('#restart');active(0);assert.equal(all('.notification').length,5);assert.equal(all('.thought').length,3);assert.equal($('#threshold').value,'50');assert.equal($('.dial-wrap').getAttribute('aria-valuenow'),'0');assert.equal($('#noise-next').disabled,true);assert.equal($('#sort-next').disabled,true);});
test('Direct navigation ending does not claim fictional completed actions',()=>{go(4);assert.doesNotMatch($('#quiet-summary').textContent,/set aside|made room/);click('#restart');});
test('Horizontal swipe dismisses, while short/vertical/cancelled gestures do not',()=>{go(1);const c=$('.notification');event(c,'pointerdown',{button:0,pointerId:1,clientX:0,clientY:0});event(c,'pointerup',{clientX:30,clientY:0});assert.equal($('#noise-progress').textContent,'0 of 5 interruptions cleared');event(c,'pointerdown',{button:0,pointerId:2,clientX:0,clientY:0});event(c,'pointerup',{clientX:80,clientY:130});assert.equal($('#noise-progress').textContent,'0 of 5 interruptions cleared');event(c,'pointerdown',{button:0,pointerId:3,clientX:0,clientY:0});event(c,'pointercancel');event(c,'pointerup',{clientX:120,clientY:0});assert.equal($('#noise-progress').textContent,'0 of 5 interruptions cleared');event(c,'pointerdown',{button:0,pointerId:4,clientX:0,clientY:0});event(c,'pointermove',{clientX:120,clientY:0});event(c,'pointerup',{clientX:120,clientY:0});flush();assert.equal(all('.notification').length,4);});
test('Restart cancels pending exit timers before rebuilding notifications',()=>{click('.dismiss');assert.ok(timers.size);go(4);click('#restart');flush();assert.equal(all('.notification').length,5);assert.equal($('#noise-next').disabled,true);});
test('Pointer dragging places a thought in the correct zone',()=>{go(2);const t=$('[data-thought="0"]');event(t,'pointerdown',{button:0,pointerId:5,clientX:30,clientY:30});event(t,'pointermove',{clientX:250,clientY:250});event(t,'pointerup',{clientX:250,clientY:250});assert.match($('#later-items').textContent,/A conversation/);assert.equal(all('.thought').length,2);});
test('Dropped outside a zone leaves the thought available',()=>{const t=$('[data-thought="1"]');event(t,'pointerdown',{button:0,pointerId:6,clientX:30,clientY:30});event(t,'pointermove',{clientX:500,clientY:500});event(t,'pointerup',{clientX:500,clientY:500});assert.equal(all('.thought').length,2);assert.equal(all('.drop-ready').length,0);});
test('Returning between scenes preserves choices',()=>{go(3);click('#back');active(2);assert.equal(all('.thought').length,2);});
test('Motion control and paused scene changes remain usable',()=>{click('#motion');assert.equal($('#motion').getAttribute('aria-pressed'),'true');assert.ok(document.body.classList.contains('motion-paused'));go(3);active(3);const css=fs.readFileSync(path.join(root,'style.css'),'utf8');assert.match(css,/\.motion-paused[^}]+animation:none!important/);click('#motion');assert.equal($('#motion').textContent,'Pause motion');});
test('All scene headings and labels reference existing elements',()=>{for(const e of all('[aria-labelledby]'))assert.ok($('#'+e.getAttribute('aria-labelledby')));for(const e of all('label[for]'))assert.ok($('#'+e.getAttribute('for')));});
console.log(`${checks} DOM integration checks passed. Visual layout and native pointer behaviour still require a real browser.`);
