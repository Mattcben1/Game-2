// ======= DOM =======
const themeNameEl = document.getElementById("theme-name");
const guessInput = document.getElementById("guess-input");
const submitBtn = document.getElementById("submit-guess");
const invalidWord = document.getElementById("invalid-word");
const feedbackEl = document.getElementById("feedback");
const attemptsEl = document.getElementById("attempt-count");
const hintDisplay = document.getElementById("hint-display");
const hintBtn = document.getElementById("hint-button");
const mascotBtn = document.getElementById("chipBtn");
const rulesModal = document.getElementById("rules-modal");
const closeRules = document.getElementById("close-rules");

// ======= GAME DATA =======
const THEMES = [
  {
    name:"Volcano",
    targetWord:"caldera",
    hint:"It's the crater at the top",
    words:["lava","magma","ash","eruption","mountain","rock","crater","vent","cone","ridge","plate","lavaflow","pyroclastic","igneous","volcanic","tectonic","basalt","scoria","andesite","pumice","bomb","lava tube","lava dome","shield","stratovolcano","composite","tuff","lava plateau","volcanism","fumarole","lava lake","lava vent","lava deposit","lava field","pyroclastic flow","lava fountain","lava bomb","cinder cone","caldera rim"]
  },
  {
    name:"Mountains",
    targetWord:"ridge",
    hint:"Part of the mountain range",
    words:["peak","valley","summit","slope","ridge","hill","cliff","plateau","mountain","range","crag","outcrop","foothill","alpine","elevation","terrain","mount","mountainpass","upland","highland"]
  }
];

let dailyTheme = THEMES[0];
let dailyWord = dailyTheme.targetWord;
let attemptsLeft = 5;

// ======= STATE =======
let guessedWords = {};

// ======= INIT =======
function initGame(){
  themeNameEl.textContent = dailyTheme.name;
  attemptsEl.textContent = attemptsLeft;
  hintDisplay.textContent = "";
  feedbackEl.textContent = "";
  guessInput.value = "";
  guessedWords = {};
}

// ======= GUESS LOGIC =======
function guessWord(){
  let val = guessInput.value.trim().toLowerCase();
  guessInput.value = "";
  if(!val) return;

  if(!dailyTheme.words.includes(val)){
    invalidWord.textContent="Not a listed word, try again";
    setTimeout(()=>{invalidWord.textContent="";},1600);
    return;
  }

  // Same word guess returns same score
  let score;
  if(guessedWords[val] !== undefined){
    score = guessedWords[val];
  } else {
    score = (val === dailyWord)?100:Math.floor(Math.random()*70)+30;
    guessedWords[val] = score;
    attemptsLeft--;
    attemptsEl.textContent = attemptsLeft;
  }

  feedbackEl.textContent = `${val} scored ${score}`;
}

// ======= HINT =======
hintBtn.addEventListener("click",()=>{hintDisplay.textContent=dailyTheme.hint});

// ======= SUBMIT EVENTS =======
submitBtn.addEventListener("click",guessWord);
guessInput.addEventListener("keypress",e=>{if(e.key==="Enter") guessWord()});

// ======= MASCOT =======
mascotBtn.addEventListener("click",()=>{alert("Hi! I'm Chip 🐶");});

// ======= RULES MODAL =======
closeRules.addEventListener("click",()=>{
  rulesModal.style.display="none";
});

// ======= START GAME =======
initGame();


