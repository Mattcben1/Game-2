/**
 * EchoGuess revamp2 (daily)
 * - 3 clues shown (hint, sound, history/visual). Clues fade-in over time.
 * - Deterministic daily selection by UTC date (everyone sees same daily word).
 * - 3 attempts allowed. Invalid guesses do not consume attempts.
 * - Sound via WebAudio on user click.
 * - Inline SVGs used for visuals (no external images).
 */

/* ---------- curated entries (expandable) ---------- */
const ENTRIES = [
  {
    word: "denali",
    hint: "A colossal summit that dominates Alaska's horizon.",
    fact: "Restored to its indigenous name in 2015 — a cultural and geographic landmark.",
    soundSeed: [110, 140, 165],
    svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f6fbff"/><path d="M40 320 L180 120 L340 240 L480 60 L660 320" stroke="#7b8da0" stroke-width="12" fill="none"/><text x="16" y="335" font-size="16" fill="#27465a">Denali — Alaska's high peak</text></svg>`,
    didYouKnow: "Denali means 'the high one' in the Koyukon language."
  },
  {
    word: "everglades",
    hint: "A slow-moving river of grass and birdsong at dawn.",
    fact: "A subtropical mosaic of marshes and mangroves — crucial habitat for unique wildlife.",
    soundSeed: [220, 180, 140],
    svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f7fff9"/><ellipse cx="350" cy="200" rx="260" ry="80" fill="#cfeedd"/><text x="16" y="335" font-size="16" fill="#2b6b36">Everglades — river of grass</text></svg>`,
    didYouKnow: "The Everglades are called a 'river of grass' because of their slow-moving marsh flow."
  },
  {
    word: "bryce",
    hint: "An amphitheater of orange spires carved by frost.",
    fact: "Hoodoos in Bryce Canyon are sculpted by freeze-thaw cycles — micro physics, grand forms.",
    soundSeed: [196, 233, 277],
    svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#fff9f8"/><g fill="#f1a07a"><rect x="60" y="210" width="30" height="80" rx="8"/><rect x="120" y="190" width="30" height="100" rx="8"/><rect x="180" y="170" width="30" height="120" rx="8"/><rect x="240" y="180" width="30" height="110" rx="8"/></g><text x="16" y="335" font-size="16" fill="#7a3d2b">Bryce — hoodoos</text></svg>`,
    didYouKnow: "Bryce's hoodoos are formed by frost wedging — water freezes, expands, and erodes rock."
  },
  {
    word: "glacier",
    hint: "Slow rivers of ice that polish valleys smooth.",
    fact: "Glaciers leave distinctive U-shaped valleys and moraines — geological memory in stone.",
    soundSeed: [150, 180, 220],
    svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f2fbff"/><path d="M40 260 Q180 100 320 220 T620 220" fill="#d9f0ff"/><text x="16" y="335" font-size="16" fill="#1f6f8f">Glacier — ice valleys</text></svg>`,
    didYouKnow: "Glaciers both carve and deposit — they are creators and archivists of landscape."
  },
  {
    word: "arches",
    hint: "Natural stone bridges frame the desert sky.",
    fact: "Over 2,000 sandstone arches are preserved here — erosion made art from rock.",
    soundSeed: [330, 392, 440],
    svg: `<svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#fffaf4"/><path d="M120 260 Q200 160 280 260" stroke="#e07a48" stroke-width="18" fill="none"/><path d="M360 260 Q440 140 520 260" stroke="#e07a48" stroke-width="18" fill="none"/><text x="16" y="335" font-size="16" fill="#8a3a20">Arches — sandstone arches</text></svg>`,
    didYouKnow: "Wind, water and time collaborate to create arches; many are fragile and transient in geologic time."
  }
];

/* ---------- deterministic daily picker by UTC date ---------- */
function dailyIndexForDateUTC(date = new Date()){
  // Compose yyyymmdd number in UTC to get a stable seed
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth()+1).padStart(2,'0');
  const d = String(date.getUTCDate()).padStart(2,'0');
  const num = Number(`${y}${m}${d}`);
  // Simple modulus mapping to entries
  return num % ENTRIES.length;
}

/* ---------- state ---------- */
let chosen = null;
let attemptsLeft = 3;
let history = [];

/* ---------- DOM refs ---------- */
const attemptsLeftEl = document.getElementById("attemptsLeft");
const clue1El = document.getElementById("clue1");
const clue2El = document.getElementById("clue2");
const clue3El = document.getElementById("clue3");
const visualArea = document.getElementById("visualArea");
const playBtn = document.getElementById("playBtn");
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const invalidMsg = document.getElementById("invalidMsg");
const feedback = document.getElementById("feedback");
const historyEl = document.getElementById("history");
const revealBtn = document.getElementById("revealBtn");
const nextBtn = document.getElementById("nextBtn");
const welcomeModal = document.getElementById("welcomeModal");
const startBtn = document.getElementById("startBtn");

/* ---------- audio (WebAudio) ---------- */
let audioCtx = null;
function ensureAudio(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function playSeed(seed){
  if(!seed || !seed.length) return;
  ensureAudio();
  const now = audioCtx.currentTime;
  const master = audioCtx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.connect(audioCtx.destination);
  let t = now;
  seed.forEach((f,i) => {
    const o = audioCtx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(f, t);
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.02);
    g.gain.linearRampToValueAtTime(0.0001, t + 0.34);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + 0.36);
    t += 0.36;
  });
}

/* ---------- helpers ---------- */
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[ch])); }
function setChosen(entry){
  chosen = entry;
  attemptsLeft = 3;
  history = [];
  attemptsLeftEl.textContent = attemptsLeft;
  // reveal clues with gentle timed fade-ins
  clue1El.textContent = chosen.hint;
  clue1El.parentElement.classList.add("fade-in");
  setTimeout(()=> clue1El.parentElement.classList.add("show"), 80);

  // stagger reveal for 2 and 3 (slow, but present)
  clue2El.textContent = "Tap PLAY to hear the ambient hint";
  clue2El.parentElement.classList.add("fade-in");
  setTimeout(()=> clue2El.parentElement.classList.add("show"), 700);

  clue3El.textContent = chosen.fact;
  clue3El.parentElement.classList.add("fade-in");
  setTimeout(()=> clue3El.parentElement.classList.add("show"), 1400);

  // visual area fades in slightly later
  visualArea.innerHTML = chosen.svg;
  visualArea.classList.add("fade-in");
  setTimeout(()=> visualArea.classList.add("show"), 1600);

  renderHistory();
  feedback.textContent = "";
  invalidMsg.textContent = "";
  revealBtn.classList.remove("hidden");
  nextBtn.classList.add("hidden");
  guessBtn.disabled = false;
  guessInput.disabled = false;
  playBtn.disabled = false;
  guessInput.focus();
}

function renderHistory(){
  historyEl.innerHTML = "";
  for(const h of history){
    const r = document.createElement("div");
    r.className = "row";
    r.innerHTML = `<div>${escapeHtml(h.word)}</div><div>${h.correct ? '✓' : '✕'}</div>`;
    historyEl.appendChild(r);
  }
}

/* ---------- gameplay ---------- */
function startDailyRound(){
  // pick deterministic entry using today's UTC date
  const idx = dailyIndexForToday();
  setChosen(ENTRIES[idx]);
}

function dailyIndexForToday(){
  return dailyIndexForDateUTC(new Date());
}

function guessAction(){
  invalidMsg.textContent = "";
  feedback.textContent = "";
  const val = (guessInput.value || "").trim().toLowerCase();
  guessInput.value = "";
  if(!val) return;
  if(/\s/.test(val)){
    invalidMsg.textContent = "Please enter a single word (no spaces).";
    return;
  }
  const allowed = ENTRIES.map(e => e.word);
  if(!allowed.includes(val)){
    invalidMsg.textContent = "Not a listed park word — try another related park word.";
    return;
  }
  if(history.find(h => h.word === val)){
    feedback.textContent = `You've already guessed "${val}".`;
    return;
  }
  const correct = (val === chosen.word);
  history.unshift({word: val, correct});
  renderHistory();
  if(correct){
    feedback.innerHTML = `🎉 Correct — <strong>${chosen.word}</strong>! You had ${attemptsLeft} attempt(s) remaining.<br><em>${escapeHtml(chosen.didYouKnow || '')}</em>`;
    endRound(true);
    return;
  } else {
    attemptsLeft -= 1;
    attemptsLeftEl.textContent = attemptsLeft;
    if(attemptsLeft > 0) feedback.textContent = `Not it — ${attemptsLeft} attempt${attemptsLeft===1?'':'s'} left.`;
    else {
      feedback.innerHTML = `💀 Out of attempts — the word was <strong>${chosen.word}</strong>.<br><em>${escapeHtml(chosen.didYouKnow || '')}</em>`;
      endRound(false);
    }
  }
}

function endRound(won){
  // lock inputs
  guessBtn.disabled = true;
  guessInput.disabled = true;
  playBtn.disabled = true;
  // show next-button for testing/replay (in production you'd disable)
  nextBtn.classList.remove("hidden");
  revealBtn.classList.add("hidden");
  // keep clues/visual visible
}

/* ---------- events ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // show welcome once
  const seen = localStorage.getItem("echoguess_seen_v2");
  if(!seen){
    welcomeModal.style.display = "flex";
  } else {
    welcomeModal.style.display = "none";
    startDailyRound();
  }

  startBtn.addEventListener("click", () => {
    localStorage.setItem("echoguess_seen_v2","1");
    welcomeModal.style.display = "none";
    startDailyRound();
  });

  playBtn.addEventListener("click", () => {
    try{
      if(chosen && chosen.soundSeed) playSeed(chosen.soundSeed);
    } catch(e){
      console.warn(e);
    }
  });

  guessBtn.addEventListener("click", guessAction);
  guessInput.addEventListener("keydown", (e) => { if(e.key === "Enter") guessAction(); });

  revealBtn.addEventListener("click", () => {
    feedback.innerHTML = `Answer revealed — <strong>${chosen.word}</strong>.<br><em>${escapeHtml(chosen.didYouKnow || '')}</em>`;
    endRound(false);
  });

  nextBtn.addEventListener("click", () => { startDailyRound(); });

  // start if user already saw modal
  if(localStorage.getItem("echoguess_seen_v2")) startDailyRound();
});
