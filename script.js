const THEMES = [
  {
    name: "National Parks",
    targetWord: "yosemite",
    hint: "A famous U.S. park known for granite cliffs and waterfalls",
    words: ["grandcanyon","zion","everglades","sequoia","glacier","yellowstone","arches","bryce","denali","rocky","smoky","acadia","yosemite","olympic","canyon","trail","wildlife","camp","forest","ranger"]
  },
  {
    name: "Mountain Gear",
    targetWord: "crampons",
    hint: "Metal spikes for climbing icy slopes",
    words: ["rope","axe","boot","gloves","jacket","helmet","carabiner","crampons","chalk","harness","tent","backpack","ropebag","headlamp","parka"]
  },
  {
    name: "Coffee Drinks",
    targetWord: "latte",
    hint: "Espresso mixed with steamed milk",
    words: ["espresso","americano","cappuccino","macchiato","mocha","coldbrew","latte","ristretto","affogato","flatwhite"]
  },
  {
    name: "Classic Rock Bands",
    targetWord: "queen",
    hint: "British band known for 'Bohemian Rhapsody'",
    words: ["queen","zeppelin","beatles","rollingstones","pinkfloyd","eagles","aerosmith","journey","kiss","acdc","rush","genesis","fleetwoodmac"]
  }
];

let dailyTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
let dailyWord = dailyTheme.targetWord;
let attrsLeft = 5;
let finalLeft = 2;

const themeName = document.getElementById("themeName");
const attrInput = document.getElementById("attrInput");
const finalInput = document.getElementById("finalInput");
const feedbackEl = document.getElementById("feedback");
const hintTextEl = document.getElementById("hintText");
const historyEl = document.getElementById("history");
const finalArea = document.getElementById("finalArea");
const chipSpeech = document.getElementById("chipSpeech");
const popup = document.getElementById("rulesPopup");

function initGame() {
  themeName.textContent = dailyTheme.name;
  historyEl.innerHTML = "";
  feedbackEl.textContent = "";
  hintTextEl.textContent = "";
  finalArea.style.display = "none";
  attrInput.value = "";
  finalInput.value = "";
  attrsLeft = 5;
  finalLeft = 2;
}

function guessAttribute() {
  const val = attrInput.value.trim().toLowerCase();
  attrInput.value = "";
  if (!val) return;
  if (!dailyTheme.words.includes(val)) {
    feedbackEl.textContent = "❌ Not a related word.";
    return;
  }

  attrsLeft--;
  const score = val === dailyWord ? 100 : Math.floor(Math.random() * 70) + 30;
  addHistory(val, score);

  if (attrsLeft <= 0) finalArea.style.display = "flex";
}

function addHistory(word, score) {
  const item = document.createElement("div");
  item.className = "history-item";
  item.innerHTML = `<span>${word}</span><span>${score}</span>`;
  historyEl.prepend(item);
}

function finalGuess() {
  const val = finalInput.value.trim().toLowerCase();
  finalInput.value = "";
  if (!val) return;
  finalLeft--;

  if (val === dailyWord) {
    feedbackEl.textContent = "✅ Correct! You got it!";
  } else {
    feedbackEl.textContent = finalLeft > 0 ? `❌ Try again (${finalLeft} left)` : `Game Over! The word was "${dailyWord}".`;
  }
}

document.getElementById("attrBtn").addEventListener("click", guessAttribute);
document.getElementById("finalBtn").addEventListener("click", finalGuess);
document.getElementById("hintBtn").addEventListener("click", () => {
  hintTextEl.textContent = dailyTheme.hint;
});
document.getElementById("chipBtn").addEventListener("click", () => {
  chipSpeech.classList.remove("hidden");
  setTimeout(() => chipSpeech.classList.add("hidden"), 2000);
});
document.getElementById("startBtn").addEventListener("click", () => {
  popup.style.display = "none";
  initGame();
});

window.onload = () => {
  themeName.textContent = "Loading...";
};



