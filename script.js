/* EchoGuess prototype
   - 3 clue types: visual fragment, sound, historic text
   - Progressive reveal: each guess (if incorrect) reveals the next clue
   - Admin key lets you switch theme
   - All client-side; data small sample for testing
*/

// ------- Sample theme data (expandable) -------
const THEMES = [
  {
    name: "National Parks",
    palette: { accent: "#2e6b3b", accent2: "#7bbf6b", bg: "#ecf8ee" },
    // words: array of {word, clues: {visualLevel: [svg fragments], soundSeed, facts: [text clues]}}
    words: [
      {
        word: "yellowstone",
        visual: generateParkSVG("geyser"), // generate base SVG - we'll control fragment reveal
        soundSeed: [220, 330, 440],
        facts: [
          "One of the first national parks in the world.",
          "Famous for geothermal features and bison herds.",
          "Home to Old Faithful geyser."
        ]
      },
      {
        word: "yosemite",
        visual: generateParkSVG("granite"),
        soundSeed: [130, 196, 261],
        facts: [
          "Granite cliffs and giant sequoias define this park.",
          "Half Dome and El Capitan are iconic formations.",
          "Located in California's Sierra Nevada."
        ]
      }
    ]
  },
  {
    name: "Coffee Drinks",
    palette: { accent: "#6b4a2a", accent2: "#c79a6a", bg: "#fbf6f1" },
    words: [
      {
        word: "cappuccino",
        visual: generateCoffeeSVG("cup"),
        soundSeed: [440, 392, 330],
        facts: [
          "An Italian espresso-based coffee drink.",
          "Traditionally topped with dense milk foam.",
          "Often dusted with cocoa powder."
        ]
      },
      {
        word: "latte",
        visual: generateCoffeeSVG("latte"),
        soundSeed: [392, 440, 523],
        facts: [
          "Made with espresso and a larger proportion of steamed milk.",
          "Commonly served in a large cup and used for latte art.",
          "Milder and creamier than a cappuccino."
        ]
      }
    ]
  },
  {
    name: "Classic Rock Bands",
    palette: { accent: "#581717", accent2: "#d04b4b", bg: "#fff7f7" },
    words: [
      {
        word: "ledzeppelin",
        visual: generateMusicSVG("zeppelin"),
        soundSeed: [110, 220, 330],
        facts: [
          "Led Zeppelin is known for hard rock and blues influences.",
          "The song 'Stairway to Heaven' is one of their most famous tracks.",
          "Jimmy Page was the band's lead guitarist."
        ]
      },
      {
        word: "beatles",
        visual: generateMusicSVG("beatles"),
        soundSeed: [262, 330, 392],
        facts: [
          "Iconic band from Liverpool influential in the 1960s.",
          "Their album 'Abbey Road' features a famous zebra crossing photo.",
          "Members included John, Paul, George and Ringo."
        ]
      }
    ]
  }
];

// ---- UI elements ----
const introModal = document.getElementById("introModal");
const closeIntro = document.getElementById("closeIntro");
const themeTitle = document.getElementById("themeTitle");
const themeSub = document.getElementById("themeSubtitle");
const visualFragment = document.getElementById("visualFragment");
const playSoundBtn = document.getElementById("playSound");
const replaySoundBtn = document.getElementById("replaySound");
const clueStack = document.getElementById("clueStack");
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const invalidMsg = document.getElementById("invalidMsg");
const historyEl = document.getElementById("history");
const finalBlock = document.getElementById("finalBlock");
const finalInput = document.getElementById("finalInput");
const finalBtn = document.getElementById("finalBtn");
const feedback = document.getElementById("feedback");
const cluesUsedEl = document.getElementById("cluesUsed");
const finalsLeftEl = document.getElementById("finalsLeft");
const progressBar = document.getElementById("progressBar");
const chipBtn = document.getElementById("chipBtn");
const chipBubble = document.getElementById("chipBubble");
const adminKey = document.getElementById("adminKey");
const adminPanel = document.getElementById("adminPanel");
const themeSelect = document.getElementById("themeSelect");
const applyThemeBtn = document.getElementById("applyTheme");
const adminPanelCard = document.getElementById("adminPanel");

// ------- Game state -------
let currentTheme = null;
let currentEntry = null; // chosen word object
let clueStage = 0; // 0=none, 1=visual revealed, 2=sound revealed, 3=fact shown
let history = []; // guesses
let finalsLeft = 2;
let audioCtx = null;

// ------- Utilities and small helpers -------

function setPalette(pal) {
  if(!pal) return;
  document.documentElement.style.setProperty("--accent", pal.accent);
  document.documentElement.style.setProperty("--accent2", pal.accent2);
  document.documentElement.style.setProperty("--bg", pal.bg || "#f0f6f2");
}

function uid(){ return Math.random().toString(36).slice(2,9); }

// ---- SVG generators for mock visuals (no external images) ----
function generateParkSVG(kind){
  // returns a string of simple SVG with shapes; kind distinguishes small iconography
  const id = uid();
  if(kind==="geyser"){
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" preserveAspectRatio="none">
      <rect width="100%" height="100%" fill="#f6fff6"/>
      <g transform="translate(40,40)">
        <ellipse cx="100" cy="160" rx="80" ry="30" fill="#d4f0d4"/>
        <rect x="80" y="20" width="40" height="80" rx="12" fill="#ffe7d6"/>
        <g fill="#fff6f0" opacity="0.9"><ellipse cx="100" cy="40" rx="18" ry="10"/></g>
        <text x="10" y="210" font-size="18" fill="#2b6b36">Geyser field</text>
      </g>
    </svg>`;
  } else {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" preserveAspectRatio="none">
      <rect width="100%" height="100%" fill="#f6fff6"/>
      <g transform="translate(20,20)"><rect x="10" y="70" width="360" height="140" rx="12" fill="#e9f8e9"/>
        <path d="M30 180 L120 50 L210 150 L300 40 L360 160" fill="none" stroke="#6aa56a" stroke-width="10" stroke-linecap="round"/>
        <text x="14" y="230" font-size="16" fill="#2b6b36">Granite cliffs</text></g>
    </svg>`;
  }
}

function generateCoffeeSVG(kind){
  if(kind==="cup"){
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" preserveAspectRatio="none">
      <rect width="100%" height="100%" fill="#fffaf6"/>
      <g transform="translate(40,20)">
        <ellipse cx="160" cy="180" rx="110" ry="22" fill="#efe0d0"/>
        <rect x="60" y="70" width="200" height="110" rx="54" fill="#f6e7d8"/>
        <ellipse cx="160" cy="82" rx="56" ry="18" fill="#fff6f0"/>
        <text x="10" y="220" font-size="16" fill="#6b4a2a">Served warm</text>
      </g>
    </svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" preserveAspectRatio="none">
    <rect width="100%" height="100%" fill="#fffaf6"/>
    <g transform="translate(20,30)"><circle cx="120" cy="120" r="80" fill="#f3e6d8"/><text x="6" y="230" font-size="16" fill="#6b4a2a">Cafe scene</text></g>
  </svg>`;
}

function generateMusicSVG(kind){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" preserveAspectRatio="none">
    <rect width="100%" height="100%" fill="#fff9f9"/>
    <g transform="translate(40,30)"><rect x="30" y="40" width="300" height="160" rx="12" fill="#fff0f2"/>
      <circle cx="90" cy="120" r="24" fill="#ffe7e7"/><text x="12" y="220" font-size="16" fill="#5a1717">Vintage stage</text></g>
  </svg>`;
}

// ------ Sound generator (WebAudio simple melody) ------
function ensureAudio(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playSeed(seed){
  // seed: array of frequencies
  ensureAudio();
  const now = audioCtx.currentTime;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.connect(audioCtx.destination);
  let t = now;
  seed.forEach((f, i) => {
    const o = audioCtx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(f, t);
    o.connect(gain);
    o.start(t);
    // ramp up and stop
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
    o.stop(t + 0.28 + i * 0.02);
    t += 0.28;
  });
}

// ------- Game flow functions -------
function pickThemeRandom(){
  return THEMES[Math.floor(Math.random()*THEMES.length)];
}

function pickWordFromTheme(theme){
  return theme.words[Math.floor(Math.random()*theme.words.length)];
}

function applyTheme(theme){
  currentTheme = theme;
  setPalette(theme.palette);
  themeTitle.textContent = theme.name;
  // pick word
  currentEntry = pickWordFromTheme(theme);
  // reset round
  clueStage = 0;
  history = [];
  finalsLeft = 2;
  updateUI();
  renderVisualFragment(0); // initial very vague visual
  clearClues();
}

function updateUI(){
  cluesUsedEl.textContent = `${clueStage} / 3`;
  finalsLeftEl.textContent = finalsLeft;
  progressBar.style.width = `${Math.round((clueStage/3)*100)}%`;
  document.getElementById("themeSubtitle").textContent = "Daily challenge";
  historyEl.innerHTML = "";
  feedback.textContent = "";
  invalidMsg.textContent = "";
  clueStack.innerHTML = "";
  // populate history if any
  history.forEach(h => addHistoryItem(h.word, h.correct));
}

function clearClues(){ clueStack.innerHTML = ""; }

function revealNextClue(){
  // increments clueStage and reveals appropriate clue piece
  if(clueStage >= 3) return;
  clueStage++;
  cluesUsedEl.textContent = `${clueStage} / 3`;
  progressBar.style.width = `${Math.round((clueStage/3)*100)}%`;

  if(clueStage === 1){
    // refine visual a bit
    renderVisualFragment(1);
    addClue("Image fragment becomes clearer.");
  } else if(clueStage === 2){
    // play sound and show small note
    renderVisualFragment(2);
    addClue("Listen to this sound for a hint.");
    // also auto-play sound once
    if(currentEntry && currentEntry.soundSeed) playSeed(currentEntry.soundSeed);
  } else if(clueStage === 3){
    // show textual fact (first one)
    renderVisualFragment(3);
    if(currentEntry && currentEntry.facts && currentEntry.facts[0]){
      addClue(currentEntry.facts[0]);
    } else {
      addClue("Historical hint appears.");
    }
    // show final guess UI
    document.getElementById("finalBlock").style.display = "flex";
  }
}

function addClue(text){
  const d = document.createElement("div");
  d.className = "clue-item";
  d.innerHTML = `<div class="clue-meta">${escapeHtml(text)}</div>`;
  clueStack.appendChild(d);
}

function addHistoryItem(word, correct){
  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `<div>${escapeHtml(word)}</div><div>${correct ? '✓' : '✕'}</div>`;
  historyEl.prepend(div);
}

// escape
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[ch])); }

// render visual fragment variants (0..3)
function renderVisualFragment(level){
  // level 0: very vague (blur + low opacity)
  // level 1: clearer shapes
  // level 2: colored shapes
  // level 3: full clarity + label hidden (still no word)
  const svg = currentEntry.visual || `<svg><rect></rect></svg>`;
  // technique: wrap the svg and apply CSS filters based on level
  visualFragment.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.innerHTML = svg;
  const svgel = wrapper.firstElementChild;
  if(!svgel) return;
  // apply filter styles
  let filter = "";
  if(level === 0) filter = "blur(6px) saturate(0.6) brightness(0.95)";
  if(level === 1) filter = "blur(3px) saturate(0.8)";
  if(level === 2) filter = "blur(1px) saturate(1.0)";
  if(level === 3) filter = "none";
  svgel.style.width = "100%";
  svgel.style.height = "100%";
  svgel.style.filter = filter;
  visualFragment.appendChild(svgel);
}

// evaluate guess
function handleGuess(){
  const val = guessInput.value.trim().toLowerCase();
  guessInput.value = "";
  if(!val) return;
  if(!currentEntry) return;
  // validate against seed words in theme (we'll consider all words of theme valid guesses)
  const validWords = currentTheme.words.map(w=>w.word);
  if(!validWords.includes(val)){
    invalidMsg.textContent = "Not a listed word for this theme — try another related word";
    setTimeout(()=> invalidMsg.textContent = "", 1300);
    return;
  }
  // if guess matches target
  if(val === currentEntry.word){
    // award points based on clueStage (earlier -> more points)
    const points = 100 - (clueStage * 20);
    feedback.textContent = `🎉 Correct! "${currentEntry.word}" — you scored ${points} points.`;
    addHistoryItem(val, true);
    // reveal all facts
    if(currentEntry.facts){
      currentEntry.facts.forEach(f => addClue(f));
      clueStage = 3;
      cluesUsedEl.textContent = `${clueStage} / 3`;
      progressBar.style.width = `100%`;
    }
    // lock inputs
    disableGameplay();
    return;
  } else {
    // wrong guess — reveal next clue and record history
    addHistoryItem(val, false);
    revealNextClue();
    if(clueStage >= 3){
      feedback.textContent = `Clues nearly exhausted — try final guesses!`;
      finalBlock.style.display = "flex";
    } else {
      feedback.textContent = `Not it — here's another hint.`;
    }
  }
}

// final guess handler
function handleFinal(){
  const val = finalInput.value.trim().toLowerCase();
  finalInput.value = "";
  if(!val) return;
  finalsLeft--;
  finalsLeftEl.textContent = finalsLeft;
  if(val === currentEntry.word){
    feedback.textContent = `🎉 Final correct! The word was "${currentEntry.word}".`;
    addHistoryItem(val, true);
    disableGameplay();
    return;
  } else {
    addHistoryItem(val, false);
    feedback.textContent = `❌ Wrong final guess. ${finalsLeft} left.`;
    if(finalsLeft <= 0){
      feedback.textContent = `Game over — the word was "${currentEntry.word}".`;
      revealAllFacts();
      disableGameplay();
    }
  }
}

function revealAllFacts(){
  if(currentEntry.facts){
    currentEntry.facts.forEach(f => addClue(f));
  }
}

// disable further input after win/loss
function disableGameplay(){
  guessBtn.disabled = true;
  guessInput.disabled = true;
  finalBtn.disabled = true;
  finalInput.disabled = true;
}

// --- chip bubble ---
function showChipBubble(){
  chipBubble.classList.add("show");
  setTimeout(()=> chipBubble.classList.remove("show"), 1800);
}

// --- admin behavior ---
function setupAdmin(){
  // populate select
  themeSelect.innerHTML = "";
  THEMES.forEach((t, i) => {
    const opt = document.createElement("option");
    opt.value = i; opt.textContent = t.name;
    themeSelect.appendChild(opt);
  });
  adminKey.addEventListener("click", () => {
    const pin = prompt("Enter admin PIN:");
    if(pin === "1234") {
      adminPanel.classList.toggle("hidden");
      adminPanelCard.classList.toggle("hidden");
    } else alert("Wrong PIN");
  });
  applyThemeBtn.addEventListener("click", () => {
    const idx = parseInt(themeSelect.value, 10);
    if(!Number.isNaN(idx)) applyTheme(THEMES[idx]);
  });
}

// apply theme index
function applyTheme(theme){
  applyTheme(theme);
}

// initial setup & wiring
function wireEvents(){
  closeIntro.addEventListener("click", ()=> {
    introModal.style.display = "none";
    localStorage.setItem("echoguess_seen_intro_v1", "1");
  });

  guessBtn.addEventListener("click", handleGuess);
  guessInput.addEventListener("keydown", e => { if(e.key === "Enter") handleGuess(); });
  finalBtn.addEventListener("click", handleFinal);
  finalInput.addEventListener("keydown", e => { if(e.key === "Enter") handleFinal(); });
  chipBtn.addEventListener("click", showChipBubble);
  playSoundBtn.addEventListener("click", () => { if(currentEntry) playSeed(currentEntry.soundSeed); });
  replaySoundBtn.addEventListener("click", () => { if(currentEntry) playSeed(currentEntry.soundSeed); });

  setupAdmin();
}

// show intro if needed
function showIntroIfNeeded(){
  const seen = localStorage.getItem("echoguess_seen_intro_v1");
  if(!seen) {
    introModal.style.display = "flex";
  } else {
    introModal.style.display = "none";
  }
}

// --- bootstrap ---
(function init(){
  showIntroIfNeeded();
  // default pick
  const pick = THEMES[Math.floor(Math.random()*THEMES.length)];
  applyTheme(pick);
  wireEvents();
  setupAdmin();
})();




