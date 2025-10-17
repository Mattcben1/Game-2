// -----------------------------
// Theme-Me: main script.js
// -----------------------------
const RULES_KEY = "themeMe_hasSeenRules_v1";
const ADMIN_PIN = "1234";

// DOM
const rulesModal = document.getElementById("rulesModal");
const closeRulesBtn = document.getElementById("closeRules");
const themeNameEl = document.getElementById("themeName");
const themeBanner = document.getElementById("themeBanner");
const hintBtn = document.getElementById("hintBtn");
const hintText = document.getElementById("hintText");
const attrInput = document.getElementById("attrInput");
const attrBtn = document.getElementById("attrBtn");
const invalidMsg = document.getElementById("invalidMsg");
const historyEl = document.getElementById("history");
const finalArea = document.getElementById("finalArea");
const finalInput = document.getElementById("finalInput");
const finalBtn = document.getElementById("finalBtn");
const feedbackEl = document.getElementById("feedback");
const attrsLeftEl = document.getElementById("attrsLeft");
const finalLeftEl = document.getElementById("finalLeft");
const progressBar = document.getElementById("progressBar");
const chipBtn = document.getElementById("chipBtn");
const chipBubble = document.getElementById("chipBubble");
const adminKey = document.getElementById("adminKey");
const adminDropdown = document.getElementById("adminDropdown");

// state
let THEMES = null;           // loaded from words.json
let currentTheme = null;     // whole theme object
let targetWord = "";         // 1 target word per theme
let attrsLeft = 5;
let finalsLeft = 2;
let guessScores = {};        // {word: score} consistent scoring
let historyList = [];        // list of {word,score}

// palette mapping (will be overridden by theme palette if present)
const PALETTES = {
  "National Parks": { accent: "#2f6b3a", accent2: "#6fb36f", bg:"#eaf0ea" },
  "Mountain Gear": { accent: "#334155", accent2: "#6b7280", bg:"#eef2f5" },
  "Coffee Drinks": { accent: "#6b3f2d", accent2:"#c79a6a", bg:"#f6efe8" },
  "Classic Rock Bands": { accent: "#6a0b0b", accent2:"#d04444", bg:"#faf4f4" }
};

// helpers
function setPaletteFor(themeName){
  const pal = PALETTES[themeName];
  if(!pal) return;
  document.documentElement.style.setProperty("--accent", pal.accent);
  document.documentElement.style.setProperty("--accent2", pal.accent2);
  document.documentElement.style.setProperty("--bg", pal.bg);
  // update visible banner colors quickly
  document.getElementById("themeBanner").style.borderColor = pal.accent2;
}

function showRulesIfNeeded(){
  const seen = localStorage.getItem(RULES_KEY);
  if(!seen){
    rulesModal.style.display = "flex";
    rulesModal.setAttribute("aria-hidden","false");
  } else {
    rulesModal.style.display = "none";
    rulesModal.setAttribute("aria-hidden","true");
  }
}

// load themes (words.json)
async function loadThemes(){
  try{
    const res = await fetch("./words.json");
    if(!res.ok) throw new Error("Failed to load words.json: "+res.status);
    const data = await res.json();
    THEMES = data.themes;
    // select default theme: either saved or first
    const saved = localStorage.getItem("themeMe_selectedTheme_v1");
    if(saved && THEMES.find(t=>t.name===saved)) {
      setTheme(saved);
    } else {
      setTheme(THEMES[0].name);
    }
    buildAdminDropdown();
  }catch(e){
    console.error(e);
    feedbackEl.textContent = "Error loading word banks.";
  }
}

// set theme by name
function setTheme(themeName){
  const t = THEMES.find(x=>x.name===themeName);
  if(!t) return;
  currentTheme = t;
  targetWord = t.targetWord;
  // set palette if provided
  if(t.palette){
    document.documentElement.style.setProperty("--accent", t.palette.accent);
    document.documentElement.style.setProperty("--accent2", t.palette.accent2);
    document.documentElement.style.setProperty("--bg", t.palette.bg);
  } else {
    setPaletteFor(t.name);
  }
  // update UI
  themeNameEl.textContent = t.name;
  hintText.textContent = "";
  hintText.style.color = "red";
  resetRound();
  localStorage.setItem("themeMe_selectedTheme_v1", t.name);
}

// reset round state
function resetRound(){
  attrsLeft = 5;
  finalsLeft = 2;
  guessScores = {};
  historyList = [];
  historyEl.innerHTML = "";
  invalidMsg.textContent = "";
  feedbackEl.textContent = "";
  attrInput.value = "";
  finalInput.value = "";
  finalArea.style.display = "none";
  attrsLeftEl.textContent = attrsLeft;
  finalLeftEl.textContent = finalsLeft;
  progressBar.style.width = "0%";
}

// generate a score for a guessed word (deterministic-ish per round)
function scoreFor(word){
  // if recorded, return it
  if(guessScores[word] !== undefined) return guessScores[word];
  // simple similarity heuristic: common letters + substring + length ratio
  const target = targetWord.toLowerCase();
  const a = word.toLowerCase();
  let matches = 0;
  for(let ch of new Set(a.split(''))){
    if(target.includes(ch)) matches++;
  }
  // letter-position bonus
  let posBonus = 0;
  for(let i=0;i<Math.min(a.length,target.length);i++){
    if(a[i] === target[i]) posBonus++;
  }
  // substring bonus
  const substrBonus = (target.includes(a) || a.includes(target)) ? 2 : 0;
  // base scale to 30..90 + bonuses, exact =100
  let base = Math.min(90, 30 + matches*8 + posBonus*4 + substrBonus*6);
  if(a === target) base = 100;
  // clamp 0..100
  base = Math.max(0, Math.min(100, Math.round(base)));
  guessScores[word] = base;
  return base;
}

// add history UI
function addHistoryItem(word,score){
  const div = document.createElement("div");
  div.className = "history-item";
  div.innerHTML = `<div class="word">${escapeHtml(word)}</div><div class="score">${score}</div>`;
  historyEl.prepend(div);
}

// escape helper
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[s]));
}

// handle attribute guess
function handleAttrGuess(){
  const val = attrInput.value.trim().toLowerCase();
  attrInput.value = "";
  if(!val) return;
  // validate
  if(!currentTheme.words.includes(val)){
    invalidMsg.textContent = "Not a listed word, try again";
    setTimeout(()=>{ invalidMsg.textContent = ""; }, 1400);
    return;
  }
  // if already guessed, show its same score (don't consume attr)
  if(guessScores[val] !== undefined){
    const s = guessScores[val];
    feedbackEl.textContent = `${val} → ${s}`;
    return;
  }
  // otherwise compute
  const s = scoreFor(val);
  addHistoryItem(val,s);
  historyList.unshift({word:val,score:s});
  attrsLeft--;
  attrsLeftEl.textContent = attrsLeft;
  // update progress (5 attr guesses total)
  const done = 5 - attrsLeft;
  progressBar.style.width = `${Math.round((done/5)*100)}%`;
  feedbackEl.textContent = `${val} → ${s}`;
  if(attrsLeft <= 0){
    finalArea.style.display = "flex";
  }
}

// final guess
function handleFinalGuess(){
  const val = finalInput.value.trim().toLowerCase();
  finalInput.value = "";
  if(!val) return;
  finalsLeft--;
  finalLeftEl.textContent = finalsLeft;
  if(val === targetWord){
    feedbackEl.textContent = `🎉 Correct! The hidden word was "${targetWord}".`;
    // keep UI locked
    finalArea.style.display = "none";
    return;
  } else {
    feedbackEl.textContent = `❌ Wrong. ${finalsLeft} final guesses left.`;
  }
  if(finalsLeft <= 0){
    feedbackEl.textContent = `💀 Out of tries — the word was "${targetWord}".`;
    finalArea.style.display = "none";
  }
}

// hint
function showHint(){
  if(currentTheme && currentTheme.hint){
    hintText.textContent = currentTheme.hint;
    hintText.style.color = "red";
  }
}

// chip bubble animation
function showChipBubble(){
  chipBubble.style.display = "block";
  chipBubble.style.animation = "bubbleIn 2s forwards";
  setTimeout(()=>{ chipBubble.style.display = "none"; chipBubble.style.animation = ""; }, 2000);
}

// admin dropdown builder
function buildAdminDropdown(){
  adminDropdown.innerHTML = "";
  THEMES.forEach(t=>{
    const b = document.createElement("button");
    b.textContent = t.name;
    b.className = "btn";
    b.style.background = "white";
    b.style.color = "var(--accent)";
    b.addEventListener("click", ()=> {
      setTheme(t.name);
      adminDropdown.style.display = "none";
    });
    adminDropdown.appendChild(b);
  });
}

// admin click
adminKey.addEventListener("click", ()=>{
  const pin = prompt("Enter admin PIN:");
  if(pin === ADMIN_PIN){
    adminDropdown.style.display = adminDropdown.style.display === "flex" ? "none" : "flex";
  } else {
    alert("Wrong PIN");
  }
});

// wire events
attrBtn.addEventListener("click", handleAttrGuess);
attrInput.addEventListener("keypress", e=>{ if(e.key === "Enter") handleAttrGuess(); });
finalBtn.addEventListener("click", handleFinalGuess);
finalInput.addEventListener("keypress", e=>{ if(e.key === "Enter") handleFinalGuess(); });
hintBtn.addEventListener("click", showHint);
chipBtn.addEventListener("click", showChipBubble);
closeRulesBtn.addEventListener("click", ()=>{
  rulesModal.style.display = "none";
  localStorage.setItem(RULES_KEY, "1");
});

// init
(async function init(){
  // show rules conditionally
  showRulesIfNeeded();
  // load theme banks
  await loadThemes();
})();


