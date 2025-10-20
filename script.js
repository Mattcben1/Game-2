/* EchoGuess revamp2
   - 3 clues (hint, sound, history/visual)
   - clues unlock progressively: immediate / 30s or wrong guess / 30s or second wrong
   - 3 attempts; invalid guesses don't consume attempts
   - inline SVGs & WebAudio seeds; no external images
*/

/* ---------- CURATED ENTRIES (sample) ---------- 
   Make entries more niche: sensory + cultural + specific facts.
   You can expand this array with more parks and more "niche" clues.
*/
const ENTRIES = [
  {
    word: "denali",
    hint: "A colossal summit that dominates Alaska's horizon.",
    fact: "Once officially named for a U.S. president, the mountain reclaimed its indigenous name (Denali) in 2015.",
    soundSeed: [110, 140, 165], // evocative wind-tones
    svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f6fbff"/>
      <path d="M40 320 L180 120 L340 240 L480 60 L660 320" stroke="#7b8da0" stroke-width="12" fill="none"/>
      <text x="16" y="335" font-size="16" fill="#27465a">Denali — Alaska's high peak</text>
    </svg>`
  },
  {
    word: "everglades",
    hint: "A slow-moving 'river of grass' with a chorus at dawn.",
    fact: "A subtropical wetland, home to mangroves, wading birds, and the American alligator.",
    soundSeed: [220, 180, 140], // a watery/low chord vibe
    svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f7fff9"/>
      <ellipse cx="350" cy="200" rx="260" ry="80" fill="#cfeedd"/>
      <text x="16" y="335" font-size="16" fill="#2b6b36">Everglades — river of grass</text>
    </svg>`
  },
  {
    word: "bryce",
    hint: "An amphitheater of towering orange hoodoos sculpted by frost.",
    fact: "Bryce Canyon's hoodoos formed through freeze-thaw cycles — tiny elements create huge forms over time.",
    soundSeed: [196, 233, 277],
    svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#fff9f8"/>
      <g fill="#f1a07a">
        <rect x="60" y="210" width="30" height="80" rx="8"/>
        <rect x="120" y="190" width="30" height="100" rx="8"/>
        <rect x="180" y="170" width="30" height="120" rx="8"/>
        <rect x="240" y="180" width="30" height="110" rx="8"/>
      </g>
      <text x="16" y="335" font-size="16" fill="#7a3d2b">Bryce — hoodoos</text>
    </svg>`
  },
  {
    word: "glacier",
    hint: "Slow rivers of ice carve stone over ages.",
    fact: "Glaciers leave behind U-shaped valleys, moraines and polished bedrock — a history written in ice.",
    soundSeed: [150, 180, 220],
    svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f2fbff"/>
      <path d="M40 260 Q180 100 320 220 T620 220" fill="#d9f0ff"/>
      <text x="16" y="335" font-size="16" fill="#1f6f8f">Glacier — ice valleys</text>
    </svg>`
  },
  {
    word: "arches",
    hint: "Natural sandstone bridges frame the desert sky.",
    fact: "Millions of years of weathering created over 2,000 arches — delicate forms carved on a grand scale.",
    soundSeed: [330, 392, 440],
    svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#fffaf4"/>
      <path d="M120 260 Q200 160 280 260" stroke="#e07a48" stroke-width="18" fill="none"/>
      <path d="M360 260 Q440 140 520 260" stroke="#e07a48" stroke-width="18" fill="none"/>
      <text x="16" y="335" font-size="16" fill="#8a3a20">Arches — sandstone arches</text>
    </svg>`
  }
];

/* ---------- state ---------- */
let chosen = null;
let attemptsLeft = 3;
let history = []; // {word, correct}
let clueUnlocked = [true, false, false]; // clue 1 available at start
let timers = { t1: null, t2: null };
let audioCtx = null;

/* ---------- DOM ---------- */
const attemptsLeftEl = document.getElementById("attemptsLeft");
const clue1El = document.getElementById("clue1");
const clue2El = document.getElementById("clue2");
const clue3El = document.getElementById("clue3");
const visualArea = document.getElementById("visualArea");
const playSoundBtn = document.getElementById("playSound");
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const invalidMsg = document.getElementById("invalidMsg");
const resultEl = document.getElementById("result");
const historyEl = document.getElementById("history");
const revealBtn = document.getElementById("reveal");
const newRoundBtn = document.getElementById("newRound");
const startModal = document.getElementById("startModal");
const startBtn = document.getElementById("startBtn");

/* ---------- helpers ---------- */
function pickRandomEntry(){
  return ENTRIES[Math.floor(Math.random() * ENTRIES.length)];
}

function ensureAudio(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

/* tiny audio melody using simple oscillators */
function playSeed(seed){
  if(!seed || !seed.length) return;
  ensureAudio();
  const now = audioCtx.currentTime;
  const master = audioCtx.createGain();
  master.gain.setValueAtTime(0.001, now);
  master.connect(audioCtx.destination);
  let t = now;
  seed.forEach((f,i) => {
    const o = audioCtx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(f, t);
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.0005, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.02);
    g.gain.linearRampToValueAtTime(0.0001, t + 0.28);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + 0.32);
    t += 0.32;
  });
}

/* render chosen entry */
function renderChosen(){
  clue1El.textContent = chosen.hint;
  clue2El.textContent = clueUnlocked[1] ? "🔊 Sound clue available — press Play" : "Locked — wait or guess to unlock";
  clue3El.textContent = clueUnlocked[2] ? chosen.fact : "Locked — wait or guess to unlock";
  visualArea.innerHTML = clueUnlocked[2] ? chosen.svg : `<div class="visual muted">Visual locked</div>`;
  attemptsLeftEl.textContent = attemptsLeft;
  renderHistory();
}

/* start timed unlocks */
function startTimers(){
  // clear previous
  clearTimers();
  // unlock clue2 after 30s
  timers.t1 = setTimeout(()=> {
    clueUnlocked[1] = true;
    clue2El.textContent = "🔊 Sound clue available — press Play";
  }, 30000);
  // unlock clue3 after 60s total
  timers.t2 = setTimeout(()=> {
    clueUnlocked[2] = true;
    clue3El.textContent = chosen.fact;
    visualArea.innerHTML = chosen.svg;
  }, 60000);
}

function clearTimers(){
  if(timers.t1) { clearTimeout(timers.t1); timers.t1 = null; }
  if(timers.t2) { clearTimeout(timers.t2); timers.t2 = null; }
}

function renderHistory(){
  historyEl.innerHTML = "";
  history.forEach(h => {
    const r = document.createElement("div");
    r.className = "row";
    r.innerHTML = `<div>${escapeHtml(h.word)}</div><div>${h.correct ? '✓' : '✕'}</div>`;
    historyEl.appendChild(r);
  });
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[ch])); }

/* ---------- gameplay actions ---------- */
function startRound(){
  chosen = pickRandomEntry();
  attemptsLeft = 3;
  history = [];
  clueUnlocked = [true, false, false];
  clearTimers();
  renderChosen();
  startTimers();
  guessBtn.disabled = false;
  guessInput.disabled = false;
  playSoundBtn.disabled = false;
  resultEl.textContent = "";
  invalidMsg.textContent = "";
  revealBtn.classList.remove("hidden");
  newRoundBtn.classList.add("hidden");
  attemptsLeftEl.textContent = attemptsLeft;
}

function onWrongGuessReveal(){
  // if clue2 locked, unlock; else if clue3 locked, unlock
  if(!clueUnlocked[1]) {
    clueUnlocked[1] = true;
    clue2El.textContent = "🔊 Sound clue available — press Play";
    // shorten timer for clue3 so player isn't punished
    if(timers.t2) { clearTimeout(timers.t2); timers.t2 = setTimeout(()=> {
      clueUnlocked[2] = true;
      clue3El.textContent = chosen.fact;
      visualArea.innerHTML = chosen.svg;
    }, 15000); } // 15s to next
    return;
  }
  if(!clueUnlocked[2]){
    clueUnlocked[2] = true;
    clue3El.textContent = chosen.fact;
    visualArea.innerHTML = chosen.svg;
    return;
  }
}

function guessAction(){
  invalidMsg.textContent = "";
  resultEl.textContent = "";
  const val = (guessInput.value || "").trim().toLowerCase();
  guessInput.value = "";
  if(!val) return;
  if(/\s/.test(val)){
    invalidMsg.textContent = "Please enter a single word (no spaces).";
    return;
  }
  const allowed = ENTRIES.map(e=>e.word);
  if(!allowed.includes(val)){
    invalidMsg.textContent = "Not a listed park-word — try a related park word.";
    return;
  }
  if(history.find(h => h.word === val)){
    resultEl.textContent = `You've already guessed "${val}".`;
    return;
  }
  const correct = (val === chosen.word);
  history.unshift({word: val, correct});
  renderHistory();
  if(correct){
    resultEl.innerHTML = `🎉 Correct — <strong>${chosen.word}</strong>! You solved it with ${attemptsLeft} attempts remaining.`;
    endRound(true);
    return;
  } else {
    attemptsLeft--;
    attemptsLeftEl.textContent = attemptsLeft;
    resultEl.textContent = attemptsLeft > 0 ? `Not it — ${attemptsLeft} attempts left.` : `No attempts left — the word was "${chosen.word}".`;
    // unlock next clue (on wrong guess)
    onWrongGuessReveal();
    if(attemptsLeft <= 0) endRound(false);
  }
}

function endRound(won){
  clearTimers();
  // reveal fact + visual
  clueUnlocked[1] = true;
  clueUnlocked[2] = true;
  clue2El.textContent = "🔊 Sound clue available — press Play";
  clue3El.textContent = chosen.fact;
  visualArea.innerHTML = chosen.svg;
  // lock inputs
  guessBtn.disabled = true;
  guessInput.disabled = true;
  playSoundBtn.disabled = true;
  revealBtn.classList.add("hidden");
  newRoundBtn.classList.remove("hidden");
}

/* ---------- events ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // show start modal once
  const seen = localStorage.getItem("echoguess_seen_v2");
  if(!seen){
    startModal.style.display = "flex";
  } else {
    startModal.style.display = "none";
  }

  startBtn.addEventListener("click", () => {
    localStorage.setItem("echoguess_seen_v2","1");
    startModal.style.display = "none";
    startRound();
    guessInput.focus();
  });

  // play sound (user gesture required by browsers)
  playSoundBtn.addEventListener("click", () => {
    try {
      if(chosen && chosen.soundSeed) playSeed(chosen.soundSeed);
    } catch (e) { console.warn(e); }
  });

  // guess actions
  guessBtn.addEventListener("click", guessAction);
  guessInput.addEventListener("keydown", e => {
    if(e.key === "Enter") guessAction();
  });

  // reveal (end round)
  revealBtn.addEventListener("click", () => {
    resultEl.innerHTML = `Answer: <strong>${chosen.word}</strong>`;
    endRound(false);
  });

  // new round
  newRoundBtn.addEventListener("click", () => {
    startRound();
  });

  // start a round if user has already seen modal
  if(localStorage.getItem("echoguess_seen_v2")) {
    startRound();
  }
});






