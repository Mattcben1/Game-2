/* EchoGuess — National Parks mock (revamp2)
   - single theme: US National Parks mock run
   - each round: 3 clues (hint, history/fact+visual, sound), user gets 3 attempts
   - invalid guesses (not in allowed list) show red message and do NOT consume attempts
   - audio is generated via WebAudio (evocative short snippet)
*/

/* ----------------- DATA: curated entries (sample set) -----------------
   Each entry includes:
    - word: the target (single-word, lowercase)
    - hint: short thematic hint (distinct style)
    - fact: a short historical/contextual fact
    - soundSeed: small array of frequencies for WebAudio synthesis (evocative)
    - svg: an inline SVG string to show as "picture"
   (This mock contains a curated set of parks/terms — can be extended)
------------------------------------------------------------------------ */
const ENTRIES = [
  {
    word: "yellowstone",
    hint: "Geothermal wonders & roaming megafauna.",
    fact: "Designated in 1872 as the world's first national park — famous for geysers and hot springs.",
    soundSeed: [220, 330, 440],
    svg: (`
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <rect width="100%" height="100%" fill="#f6fff6"/>
        <g transform="translate(40,20)">
          <ellipse cx="220" cy="280" rx="200" ry="28" fill="#dff0d9"/>
          <path d="M180 200 Q220 120 260 200 Q300 260 340 200" fill="#fff7e7" stroke="#ffd2a6" stroke-width="6" />
          <text x="10" y="340" font-size="18" fill="#2b6b36">Yellowstone — geyser basins</text>
        </g>
      </svg>
    `)
  },
  {
    word: "yosemite",
    hint: "Granite monoliths & ancient sequoias.",
    fact: "Yosemite's Half Dome and El Capitan are iconic granite formations that draw climbers worldwide.",
    soundSeed: [130, 196, 261],
    svg: (`
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f6fff6"/>
        <path d="M40 300 L140 120 L260 240 L380 80 L520 300" fill="none" stroke="#6aa56a" stroke-width="12" stroke-linecap="round"/>
        <text x="12" y="340" font-size="18" fill="#2b6b36">Yosemite — granite cliffs</text>
      </svg>
    `)
  },
  {
    word: "grandcanyon",
    hint: "A vast chasm carved by time and a river.",
    fact: "The Colorado River cut through layers of rock to form the Grand Canyon over millions of years.",
    soundSeed: [98, 130, 164],
    svg: (`
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fff7f2"/>
        <path d="M0 260 L80 160 L160 220 L240 140 L320 240 L400 130 L480 220 L600 150" stroke="#c65b3b" stroke-width="18" fill="none"/>
        <text x="10" y="340" font-size="16" fill="#7a3d2b">Grand Canyon — layered strata</text>
      </svg>
    `)
  },
  {
    word: "zion",
    hint: "Steep red cliffs and narrow slot hikes.",
    fact: "Zion's canyon walls rise dramatically and are cut by the Virgin River; Angels Landing is a famed viewpoint.",
    soundSeed: [196, 246, 294],
    svg: (`
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fff7f7"/>
        <rect x="40" y="80" width="140" height="220" fill="#f2b8a0" rx="8"/>
        <rect x="220" y="30" width="120" height="270" fill="#e68a6a" rx="8"/>
        <rect x="380" y="100" width="160" height="180" fill="#d86a46" rx="8"/>
        <text x="12" y="340" font-size="16" fill="#7a3d2b">Zion — red cliffs</text>
      </svg>
    `)
  },
  {
    word: "glacier",
    hint: "Ice-carved valleys and cold, slow rivers of ice.",
    fact: "Glacier National Park preserves nearly one million acres of rugged mountains and advancing/retreating glaciers.",
    soundSeed: [150, 180, 220],
    svg: (`
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f2fbff"/>
        <path d="M40 260 Q160 120 280 220 T520 220" fill="#d9f0ff"/>
        <text x="12" y="340" font-size="16" fill="#1f6f8f">Glacier — ice valleys</text>
      </svg>
    `)
  },
  {
    word: "everglades",
    hint: "A watery subtropical mosaic full of life.",
    fact: "The Everglades are a unique wetland ecosystem home to alligators, wading birds, and mangroves.",
    soundSeed: [220, 170, 140],
    svg: (`
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f6fff8"/>
        <ellipse cx="300" cy="200" rx="220" ry="80" fill="#cfeedd"/>
        <text x="12" y="340" font-size="16" fill="#2b6b36">Everglades — wetlands & mangroves</text>
      </svg>
    `)
  },
  {
    word: "denali",
    hint: "Tallest peak in North America.",
    fact: "Denali (formerly Mount McKinley) rises over 20,000 feet and dominates Alaska's interior.",
    soundSeed: [120, 160, 200],
    svg: (`
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f6fbff"/>
        <path d="M40 300 L180 120 L300 220 L420 80 L560 300" stroke="#7b8da0" stroke-width="12" fill="#f4f7fb"/>
        <text x="12" y="340" font-size="16" fill="#27465a">Denali — high peak</text>
      </svg>
    `)
  },
  {
    word: "acadia",
    hint: "Coastal cliffs and rocky shorelines.",
    fact: "Located on Maine's rugged coast, Acadia combines ocean vistas with forested hills.",
    soundSeed: [262, 196, 164],
    svg: (`
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fffefb"/>
        <path d="M0 260 L80 220 L160 240 L240 200 L320 250 L400 210 L480 240 L600 200" fill="#cfe7ff"/>
        <text x="12" y="340" font-size="16" fill="#2b6b36">Acadia — coastal cliffs</text>
      </svg>
    `)
  },
  {
    word: "arches",
    hint: "Iconic sandstone arches & fins.",
    fact: "Arches National Park preserves more than 2,000 natural sandstone arches formed by erosion.",
    soundSeed: [330, 392, 440],
    svg: (`
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fffaf4"/>
        <path d="M80 250 Q160 160 240 250" stroke="#e07a48" stroke-width="18" fill="none"/>
        <path d="M300 250 Q380 140 460 250" stroke="#e07a48" stroke-width="18" fill="none"/>
        <text x="12" y="340" font-size="16" fill="#8a3a20">Arches — sandstone arches</text>
      </svg>
    `)
  },
  {
    word: "bryce",
    hint: "Hoodoos—tall, thin rock spires in amphitheaters.",
    fact: "Bryce Canyon's amphitheaters display colorful hoodoos formed by ice and frost weathering.",
    soundSeed: [196, 233, 277],
    svg: (`
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fff9f8"/>
        <g fill="#f1a07a">
          <rect x="40" y="200" width="30" height="80" rx="8"/>
          <rect x="90" y="180" width="30" height="100" rx="8"/>
          <rect x="140" y="160" width="30" height="120" rx="8"/>
          <rect x="190" y="170" width="30" height="110" rx="8"/>
        </g>
        <text x="12" y="340" font-size="14" fill="#7a3d2b">Bryce — hoodoos</text>
      </svg>
    `)
  },
  {
    word: "sequoia",
    hint: "Some of the planet's largest trees.",
    fact: "Giant sequoias tower to immense heights; the General Sherman tree is among the largest by volume.",
    soundSeed: [196, 164, 130],
    svg: (`
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f6fff6"/>
        <rect x="120" y="40" width="40" height="260" fill="#6b4a2a" rx="8"/>
        <ellipse cx="140" cy="60" rx="80" ry="30" fill="#7fb974"/>
        <text x="12" y="340" font-size="14" fill="#2b6b36">Sequoia — giant trees</text>
      </svg>
    `)
  },
  {
    word: "badlands",
    hint: "Eroded clay buttes and rugged badland terrain.",
    fact: "Badlands National Park features sharply eroded buttes and fossil-rich deposits.",
    soundSeed: [150, 180, 210],
    svg: (`
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fffaf4"/>
        <path d="M20 250 L100 180 L180 230 L260 150 L340 220 L420 160 L500 240" stroke="#c9b098" stroke-width="14" fill="none"/>
        <text x="12" y="340" font-size="14" fill="#7a5a3b">Badlands — eroded buttes</text>
      </svg>
    `)
  },
  {
    word: "everglades",
    hint: "A slow-moving 'river of grass'.",
    fact: "Called the 'river of grass', Everglades are a vast network of wetlands and mangrove ecosystems.",
    soundSeed: [220, 180, 160],
    svg: (`
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f7fff9"/>
        <ellipse cx="300" cy="200" rx="220" ry="80" fill="#cfeedd"/>
        <text x="12" y="340" font-size="16" fill="#2b6b36">Everglades — wetlands</text>
      </svg>
    `)
  },
  {
    word: "rocky",
    hint: "Alpine peaks, tundra and long trails.",
    fact: "Rocky Mountain National Park spans high alpine terrain and supports diverse wildlife from elk to pikas.",
    soundSeed: [164, 196, 220],
    svg: (`
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f6fbff"/>
        <path d="M40 280 L120 160 L220 240 L340 120 L540 300" stroke="#6b8da1" stroke-width="12" fill="none"/>
        <text x="12" y="340" font-size="16" fill="#27465a">Rocky — alpine peaks</text>
      </svg>
    `)
  },
  {
    word: "olympic",
    hint: "Rainforests, mountains and a wild coastline.",
    fact: "Olympic National Park protects diverse ecosystems from temperate rainforest to glaciated mountains and Pacific beaches.",
    soundSeed: [180, 210, 240],
    svg: (`
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f6fff9"/>
        <path d="M20 250 Q120 120 220 220 T520 200" fill="#d9f0ff"/>
        <text x="12" y="340" font-size="16" fill="#2b6b36">Olympic — rainforest & coast</text>
      </svg>
    `)
  }
  // (You can add many more entries. This prototype has a representative set.)
];

/* ----------------- state ----------------- */
let chosen = null;         // chosen entry for the round
let attemptsLeft = 3;
let history = [];          // guessed words with correct boolean
let audioCtx = null;

/* ----------------- DOM refs ----------------- */
const themeNameEl = document.getElementById("themeName");
const attemptsLeftEl = document.getElementById("attemptsLeft");
const clueHintEl = document.getElementById("clueHint");
const clueFactEl = document.getElementById("clueFact");
const visualEl = document.getElementById("visualSVG") || document.getElementById("visualSVG");
const playSoundBtn = document.getElementById("playSound");
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const invalidMsgEl = document.getElementById("invalidMsg");
const resultEl = document.getElementById("result");
const historyEl = document.getElementById("history");
const revealBtn = document.getElementById("revealBtn");

/* ----------------- helpers ----------------- */
function pickEntryRandom(){
  return ENTRIES[Math.floor(Math.random() * ENTRIES.length)];
}

function setChosen(e){
  chosen = e;
  attemptsLeft = 3;
  history = [];
  attemptsLeftEl.textContent = attemptsLeft;
  themeNameEl.textContent = "U.S. National Parks";
  renderClues();
  renderVisual();
  renderHistory();
  resultEl.textContent = "";
  invalidMsgEl.textContent = "";
  guessInput.value = "";
}

function renderClues(){
  // show the three kinds of clues (they are unrelated to each other but all point to chosen.word)
  clueHintEl.textContent = chosen.hint;
  clueFactEl.textContent = chosen.fact;
  // sound hint is triggered with play button (no auto-play)
}

function renderVisual(){
  if(!visualEl) return;
  visualEl.innerHTML = chosen.svg || "";
}

/* ----------------- audio ----------------- */
function ensureAudio(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function playSeed(seed){
  if(!seed || !seed.length) return;
  ensureAudio();
  const now = audioCtx.currentTime;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.connect(audioCtx.destination);
  let t = now;
  seed.forEach((freq, i) => {
    const o = audioCtx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(freq, t);
    const env = audioCtx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.12, t + 0.02);
    env.gain.linearRampToValueAtTime(0.0001, t + 0.28);
    o.connect(env);
    env.connect(gain);
    o.start(t);
    o.stop(t + 0.32);
    t += 0.32;
  });
}

/* ----------------- gameplay ----------------- */
function guessWord(){
  invalidMsgEl.textContent = "";
  resultEl.textContent = "";
  const val = (guessInput.value || "").trim().toLowerCase();
  guessInput.value = "";
  if(!val){
    return;
  }
  // only accept single-word guesses (no spaces)
  if(/\s/.test(val)){
    invalidMsgEl.textContent = "Please enter a single word (no spaces).";
    return;
  }
  // validate the guess: check if guess is in allowed list of candidate words (words in ENTRIES)
  const allowed = ENTRIES.map(e => e.word.toLowerCase());
  if(!allowed.includes(val)){
    invalidMsgEl.textContent = "Not a listed park-word — try another related word.";
    return;
  }
  // if already guessed, show same result without consuming attempt
  if(history.find(h => h.word === val)){
    resultEl.textContent = `You've already guessed "${val}".`;
    return;
  }
  // check
  const correct = (val === chosen.word.toLowerCase());
  history.unshift({word: val, correct});
  renderHistory();
  if(correct){
    resultEl.innerHTML = `🎉 Correct — <strong>${chosen.word}</strong>! You solved it with ${attemptsLeft} attempts remaining.`;
    endRound(true);
    return;
  } else {
    attemptsLeft -= 1;
    attemptsLeftEl.textContent = attemptsLeft;
    if(attemptsLeft > 0){
      resultEl.textContent = `Not quite — ${attemptsLeft} attempt${attemptsLeft===1 ? "" : "s"} left.`;
    } else {
      resultEl.innerHTML = `💀 Out of attempts — the word was <strong>${chosen.word}</strong>.`;
      endRound(false);
    }
  }
}

function renderHistory(){
  historyEl.innerHTML = "";
  history.forEach(h => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<div>${escapeHtml(h.word)}</div><div>${h.correct ? '✓' : '✕'}</div>`;
    historyEl.appendChild(row);
  });
}

function endRound(won){
  // reveal extra facts and lock inputs
  revealBtn.textContent = "New round";
  guessBtn.disabled = true;
  guessInput.disabled = true;
  playSoundBtn.disabled = true;
  revealBtn.onclick = () => {
    // start a fresh round
    guessBtn.disabled = false;
    guessInput.disabled = false;
    playSoundBtn.disabled = false;
    revealBtn.textContent = "Reveal answer (end round)";
    setChosen(pickEntryRandom());
  };
}

/* ----------------- utilities ----------------- */
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[ch])); }

/* ----------------- wire events ----------------- */
document.addEventListener("DOMContentLoaded", () => {
  // pick entry and initialize
  setChosen(pickEntryRandom());

  // play sound button
  playSoundBtn.addEventListener("click", () => {
    try{
      playSeed(chosen.soundSeed);
    }catch(e){
      console.warn(e);
    }
  });

  // guess actions
  guessBtn.addEventListener("click", guessWord);
  guessInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter") guessWord();
  });

  // reveal button
  revealBtn.addEventListener("click", () => {
    // immediate reveal (end round)
    resultEl.innerHTML = `Answer revealed — <strong>${chosen.word}</strong>.`;
    revealAll();
    guessBtn.disabled = true;
    guessInput.disabled = true;
  });

  // click-to-focus convenience
  document.body.addEventListener("click", (e) => {
    // small UX: if clicking background, focus input
    if(e.target === document.body) guessInput.focus();
  });
});

/* reveal all facts (used on reveal) */
function revealAll(){
  if(chosen && chosen.fact){
    clueFactEl.textContent = chosen.fact + " (extra detail revealed)";
  }
}




