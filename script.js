let THEMES = {};
let currentTheme = null;
let correctWord = "";
let attemptsLeft = 5;
let usedHint = false;

const guessInput = document.getElementById("guess-input");
const feedback = document.getElementById("feedback");
const invalidWord = document.getElementById("invalid-word");
const themeName = document.getElementById("theme-name");
const hintDisplay = document.getElementById("hint-display");
const attemptCount = document.getElementById("attempt-count");
const hintButton = document.getElementById("hint-button");

fetch('./words.json')
    .then(response => response.json())
    .then(data => {
        // do stuff
    });

function startRandomTheme() {
  const themeKeys = Object.keys(THEMES);
  currentTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
  const words = THEMES[currentTheme].words;
  correctWord = words[Math.floor(Math.random() * words.length)];

  themeName.textContent = currentTheme;
  hintDisplay.textContent = "";
  feedback.textContent = "";
  invalidWord.textContent = "";
  attemptCount.textContent = attemptsLeft;
  guessInput.value = "";
}

document.getElementById("submit-guess").addEventListener("click", makeGuess);
document.getElementById("hint-button").addEventListener("click", giveHint);
guessInput.addEventListener("keydown", e => {
  if (e.key === "Enter") makeGuess();
});

function makeGuess() {
  const guess = guessInput.value.trim().toLowerCase();
  invalidWord.textContent = "";

  if (!THEMES[currentTheme].words.includes(guess)) {
    invalidWord.textContent = "Not a listed word, try again.";
    return;
  }

  const score = getSimilarityScore(guess, correctWord);
  feedback.textContent = `Similarity: ${score}`;

  if (guess === correctWord) {
    feedback.textContent = `🎉 Correct! The word was "${correctWord}".`;
    setTimeout(startRandomTheme, 2000);
  } else {
    attemptsLeft--;
    attemptCount.textContent = attemptsLeft;
    if (attemptsLeft <= 0) {
      feedback.textContent = `💀 Out of tries! The word was "${correctWord}".`;
      setTimeout(startRandomTheme, 2500);
    }
  }

  guessInput.value = "";
}

function giveHint() {
  if (usedHint) return;
  usedHint = true;
  hintDisplay.textContent = `💡 Hint: ${THEMES[currentTheme].hint}`;
  hintButton.disabled = true;
}

function getSimilarityScore(a, b) {
  const len = Math.max(a.length, b.length);
  let matches = 0;
  for (let i = 0; i < len; i++) {
    if (a[i] && b.includes(a[i])) matches++;
  }
  return Math.round((matches / len) * 100);
}

const adminButton = document.getElementById("admin-key");
const adminPanel = document.getElementById("admin-panel");
const themeSelector = document.getElementById("theme-selector");
const setThemeButton = document.getElementById("set-theme");

adminButton.addEventListener("click", () => {
  const code = prompt("Enter admin key:");
  if (code === "1234") {
    adminPanel.classList.remove("hidden"); // Show the panel
  } else {
    alert("Incorrect key!");
  }
});

setThemeButton.addEventListener("click", () => {
  const selectedTheme = themeSelector.value;
  if (selectedTheme) {
    // Save selected theme to local storage so all devices see it later
    localStorage.setItem("currentTheme", selectedTheme);
    alert(`Theme set to: ${selectedTheme}`);
    location.reload(); // Reload page with new theme
  }
});

// When the page loads, load the selected theme (if any)
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("currentTheme");
  if (savedTheme) {
    // Apply saved theme logic here, e.g. setTheme(savedTheme);
    console.log("Loaded theme:", savedTheme);
  }

  // Hide the panel by default
  adminPanel.classList.add("hidden");
});
