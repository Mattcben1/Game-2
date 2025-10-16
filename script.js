
// ==== CACHE DOM ====
const themeName = document.getElementById("themeName");
const attrsLeftEl = document.getElementById("attrsLeft");
const finalLeftEl = document.getElementById("finalLeft");
const progressBar = document.getElementById("progressBar");
const historyEl = document.getElementById("history");
const invalidMsg = document.getElementById("invalidMsg");
const wordHintEl = document.getElementById("wordHint");
const hintTextEl = document.getElementById("hintText");
const finalArea = document.getElementById("finalArea");
const attrInput = document.getElementById("attrInput");
const finalInput = document.getElementById("finalInput");

// ==== GAME CONFIG ====
const THEMES = [
  {
    name: "Volcano",
    targetWord: "caldera",
    hint: "It's the crater at the top",
    words: [
      "lava","magma","ash","eruption","mountain","rock","crater","vent",
      "cone","ridge","plate","lavaflow","pyroclastic","igneous","volcanic",
      "tectonic","basalt","scoria","andesite","pumice","bomb","lava tube",
      "lava dome","shield","stratovolcano","composite","tuff","lava plateau",
      "volcanism","fumarole","lava lake","lava vent","lava deposit",
      "lava field","pyroclastic flow","lava fountain","lava bomb",
      "cinder cone","caldera rim"
    ]
  },
  {
    name: "Mountains",
    targetWord: "ridge",
    hint: "Part of the mountain range",
    words: [
      "peak","valley","summit","slope","ridge","hill","cliff","plateau",
      "mountain","range","crag","outcrop","foothill","alpine","elevation",
      "terrain","mount","mountainpass","upland","highland"
    ]
  }
];

// ==== STATE ====
let dailyTheme = THEMES[0];
let dailyWord = dailyTheme.targetWord;
let attrsLeft = 5;
let finalLeft = 2;

// ==== INIT FUNCTION ====
function initGame() {
  attrsLeftEl.textContent = attrsLeft;
  finalLeftEl.textContent = finalLeft;
  progressBar.style.width = "0%";
  historyEl.innerHTML = "";
  invalidMsg.style.opacity = 0;
  wordHintEl.textContent = "Make your attribute guesses!";
  hintTextEl.textContent = "";
  finalArea.style.display = "none";
  themeName.textContent = dailyTheme.name;
  attrInput.value = "";
  finalInput.value = "";
}

// ==== ATTRIBUTE GUESS ====
function guessAttribute() {
  let val = attrInput.value.trim().toLowerCase();
  attrInput.value = "";
  if (!val) return;
  if (!dailyTheme.words.includes(val)) {
    invalidMsg.textContent = "Not a listed word, try again";
    invalidMsg.style.opacity = 1;
    setTimeout(() => { invalidMsg.style.opacity = 0 }, 1600);
    return;
  }
  attrsLeft--;
  attrsLeftEl.textContent = attrsLeft;
  let score = (val === dailyWord) ? 100 : Math.floor(Math.random() * 70) + 30;
  addHistory(val, score);
  progressBar.style.width = ((5 - attrsLeft) / 5 * 100) + "%";
  if (attrsLeft <= 0) finalArea.style.display = "flex";
}

// ==== FINAL GUESS ====
function finalGuess() {
  let val = finalInput.value.trim().toLowerCase();
  finalInput.value = "";
  if (!val) return;
  finalLeft--;
  finalLeftEl.textContent = finalLeft;
  if (val === dailyWord) {
    feedback("✅ Correct! You got the hidden word!");
    return;
  } else feedback(`❌ Wrong! ${finalLeft} final guesses left`);
  if (finalLeft <= 0) feedback(`Game Over! The word was "${dailyWord}"`);
}

// ==== HISTORY UI ====
function addHistory(word, score) {
  let item = document.createElement("div");
  item.className = "history-item";
  item.innerHTML = `
    <div class="guessText">${word}</div>
    <div class="scoreCell">
      <div class="scoreBar">
        <div class="scoreFill" style="width:${score}%;"></div>
      </div>
      <div class="scoreLabel">${score}</div>
    </div>`;
  historyEl.prepend(item);
}

// ==== FEEDBACK ====
function feedback(txt) {
  document.getElementById("feedback").textContent = txt;
}

// ==== EVENTS ====
document.getElementById("hintBtn").addEventListener("click", () => {
  hintTextEl.textContent = dailyTheme.hint;
});
document.getElementById("attrBtn").addEventListener("click", guessAttribute);
document.getElementById("finalBtn").addEventListener("click", finalGuess);
attrInput.addEventListener("keypress", (e) => { if (e.key === "Enter") guessAttribute(); });
finalInput.addEventListener("keypress", (e) => { if (e.key === "Enter") finalGuess(); });

initGame();

