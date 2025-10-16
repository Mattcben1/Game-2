// DOM elements
const themeName = document.getElementById("themeName");
const attrsLeftEl = document.getElementById("attrsLeft");
const finalLeftEl = document.getElementById("finalLeft");
const historyEl = document.getElementById("history");
const invalidMsg = document.getElementById("invalidMsg");
const wordHintEl = document.getElementById("wordHint");
const hintTextEl = document.getElementById("hintText");
const finalArea = document.getElementById("finalArea");
const attrInput = document.getElementById("attrInput");
const finalInput = document.getElementById("finalInput");
const feedbackEl = document.getElementById("feedback");
const chipText = document.getElementById("chip-text");
const adminKey=document.getElementById("adminKey");
const adminDropdown=document.getElementById("adminDropdown");

// GAME CONFIG
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

// STATE
let dailyTheme = THEMES[0];
let dailyWord = dailyTheme.targetWord;
let attrsLeft = 5;
let finalLeft = 2;

// HISTORY CACHE
let guessHistory = {};

// INIT
function initGame(){
  themeName.textContent = dailyTheme.name;
  attrsLeft = 5; finalLeft = 2;
  historyEl.innerHTML = ""; 
  invalidMsg.style.display="none"; 
  hintTextEl.textContent="";
  finalArea.style.display="flex";
  feedbackEl.textContent="";
  attrInput.value=""; finalInput.value="";
  guessHistory = {};
}

// ATTRIBUTE GUESS
function guessAttribute(){
  let val = attrInput.value.trim().toLowerCase();
  attrInput.value="";
  if(!val) return;

  if(!dailyTheme.words.includes(val)){
    invalidMsg.textContent="Not a listed word, try again";
    invalidMsg.style.display="block";
    setTimeout(()=>{invalidMsg.style.display="none"},1600);
    return;
  }

  if(guessHistory[val]) return; // prevent double counting
  guessHistory[val]=true;

  attrsLeft--;
  let score = (val === dailyWord) ? 100 : Math.floor(Math.random()*70)+30;

  addHistory(val,score);

  if(attrsLeft<=0) finalArea.style.display="flex";
}

// FINAL GUESS
function finalGuess(){
  let val = finalInput.value.trim().toLowerCase();
  finalInput.value="";
  if(!val) return;
  finalLeft--;
  if(val === dailyWord){
    feedbackEl.textContent="✅ Correct! You got the hidden word!";
    return;
  } else feedbackEl.textContent=`❌ Wrong! ${finalLeft} final guesses left`;
  if(finalLeft<=0) feedbackEl.textContent=`Game Over! The word was "${dailyWord}"`;
}

// ADD HISTORY
function addHistory(word,score){
  let item = document.createElement("div");
  item.className="history-item";
  item.innerHTML=`<span>${word}</span><span>${score}</span>`;
  historyEl.prepend(item);
}

// EVENTS
document.getElementById("hintBtn").addEventListener("click",()=>{hintTextEl.textContent=dailyTheme.hint; hintTextEl.style.color="red";});
document.getElementById("attrBtn").addEventListener("click",guessAttribute);
document.getElementById("finalBtn").addEventListener("click",finalGuess);
attrInput.addEventListener("keypress",(e)=>{if(e.key==="Enter") guessAttribute();});
finalInput.addEventListener("keypress",(e)=>{if(e.key==="Enter") finalGuess();});

// CHIP ANIMATION
document.getElementById("chipBtn").addEventListener("click",()=>{
  chipText.style.display="block";
  chipText.style.animation="fadeBubble 2s forwards";
  setTimeout(()=>{chipText.style.display="none"},2000);
});

// ADMIN
adminKey.addEventListener("click",()=>{
  let pin=prompt("Enter admin PIN:");
  if(pin==="1234"){
    adminDropdown.innerHTML="";
    THEMES.forEach((t,i)=>{
      let btn=document.createElement("button");
      btn.textContent=t.name;
      btn.onclick=()=>{
        dailyTheme=THEMES[i];
        dailyWord=dailyTheme.targetWord;
        initGame();
        adminDropdown.style.display="none";
      };
      adminDropdown.appendChild(btn);
    });
    adminDropdown.style.display="flex";
  } else alert("Wrong PIN");
});

initGame();

