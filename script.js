// ------------- Theme-Me main script -------------
const ADMIN_PIN = "1234";
const RULES_KEY = "themeMe_seenRules_v1";

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

// STATE
let THEMES = [
  // ------------- National Parks (≈160 words) -------------
  {
    name: "National Parks",
    hint: "Think iconic U.S. parks, features, trails and wildlife",
    targetWord: "yellowstone",
    palette: { accent: "#2e6b3b", accent2: "#7bbf6b", bg: "#ecf8ee" },
    words: [
      "yellowstone","yosemite","zion","grandcanyon","sequoia","glacier","rocky","everglades","acadia","denali","joshua","arches",
      "bryce","badlands","mesa","hiking","trail","summit","campground","ranger","geyser","hotpot","geyserbasin","mammoth",
      "obsidian","meadow","waterfall","valley","halfdome","elcapitan","redwood","timberline","wildflower","grove","oldfaithful",
      "caldera","canyon","cliff","overlook","vista","river","creek","lake","island","coast","sandstone","butte","plateau","buttearch",
      "bison","bear","elk","moose","wolf","mountain","cabin","camp","trailhead","switchback","snowcap","glacierlake","ridge","plateau",
      "petrified","dunes","sandhill","estuary","saltmarsh","fen","springs","mudpots","sulfur","hikingboot","backpack","scenicdrive",
      "visitorcenter","lookout","trailmarker","canoe","kayak","delta","cairn","granite","basalt","limestone","karst","cave","stalactite",
      "stalagmite","fossil","prairie","grassland","slope","pine","fir","spruce","juniper","sagebrush","prairiedog","pronghorn","antelope",
      "rapids","whitewater","raft","campsite","picnic","heritage","monument","preserve","sanctuary","wilderness","concession","trailmap",
      "rangerstation","entrance","parkway","lookoutpoint","rockfall","avalanche","birdwatch","eagle","falcon","owlet","sunrise","sunset",
      "stargaze","darksky","dayhike","overnight","permit","backcountry","snowshoe","iceaxe","bridge","boardwalk","coquina","seagrass",
      "sandbar","cliffside","lagoon","estuaries","marsh","saltflat","lavafield","lavaflow","lava tube","lava dome","basaltcolumn","geyserite",
      "hydrothermal","sinter","geyserpool","thermal","hot spring","fumarole","mud volcano","boiling","mammothhot"
    ]
  },

  // ------------- Mountain Gear (≈160 words) -------------
  {
    name: "Mountain Gear",
    hint: "Tools, clothing and equipment for alpine travel and climbing",
    targetWord: "crampon",
    palette: { accent: "#2b3a49", accent2: "#748199", bg: "#f3f6f8" },
    words: [
      "crampon","iceaxe","harness","carabiner","quickdraw","rope","belay","prusik","helmet","chalkbag","piton","bolt","anchor","slab",
      "overhang","trad","sport","boulder","bouldering","cam","nut","hex","sling","webbing","ascender","descender","figureeight","prusikloop",
      "icehammer","icepiton","gaiters","mountaineeringboot","approachshoe","hardshell","softshell","insulation","puffy","downjacket","fleece",
      "baseLayer","midlayer","merino","gloves","mittens","balaclava","beanie","sunglasses","goggles","headlamp","stove","canister","fuel",
      "cookpot","spork","thermos","hydration","pack","backpack","packframe","hipbelt","compressionstrap","trekkingpole","ropebag","haulbag",
      "portaledge","pitonhammer","tape","route","pitch","anchorstation","belaystation","rappel","abseil","scramble","ridge","summit","basecamp",
      "glacier","crevasse","snowbridge","serac","arete","col","cairn","approach","viaferrata","bivy","bivouac","sleepingbag","inflatablepad",
      "foamPad","drybag","map","compass","gps","altimeter","waterproof","breathable","seams","reinforced","toe rand","lace","sole","vibram",
      "heelhook","toehook","slinganchor","nuttool","bolthanger","toprope","lead","screamer","cordalette","dyneema","spectra","oxford","nylon",
      "carryingharness","haul","anchorbend","bowline","figure8","prusikminding","gri-gri","ascenderdevice","ice-screw","snowshoes","ski",
      "skins","avalanche","transceiver","probe","shovel","ski-touring","skintrack","sled","sledpack","guidebook","routebook"
    ]
  },

  // ------------- Coffee Drinks (≈160 words) -------------
  {
    name: "Coffee Drinks",
    hint: "Beverages, brewing, beans, roasts and café terms",
    targetWord: "cappuccino",
    palette: { accent: "#6b4a2a", accent2: "#c79a6a", bg: "#fbf6f1" },
    words: [
      "espresso","americano","latte","cappuccino","macchiato","mocha","flatwhite","cortado","ristretto","longshot","breve","affogato",
      "pour-over","frenchpress","aeropress","coldbrew","nitro","drip","chemex","v60","siphon","roast","lightroast","mediumroast","darkroast",
      "blonde","singleorigin","blend","arabica","robusta","bean","greenbean","roaster","barista","steamwand","froth","microfoam","crema",
      "tamping","tamper","portafilter","grouphead","grinder","burr","grindsize","coarse","medium","fine","dose","extraction","preinfusion",
      "brewratio","watertemp","brewtime","channeling","tampingpressure","milk","steamedmilk","latteart","syrup","vanilla","caramel","hazelnut",
      "shot","double","single","milksteamed","skim","oatmilk","almondmilk","soymilk","fullcream","cup","mug","demitasse","porcelain","papercup",
      "takeaway","brightness","body","finish","aftertaste","notes","floral","chocolate","nutty","fruity","citrus","berry","caramelized",
      "toasty","smoky","fermentation","washed","natural","honey","processing","mill","farm","altitude","shadegrown","blendhouse","brewbar",
      "steam","pressure","9bar","pump","cupsize","tampingmat","knockbox","shotglass","portafilterbasket","filter","paperfilter","siphonfilter",
      "espresso machine","steamsteam","pouroverstand","gooseneck","scale","timer","cupwarmer","baristahat","roastery","cupping","cuppingform"
    ]
  },

  // ------------- Classic Rock Bands (≈150 words) -------------
  {
    name: "Classic Rock Bands",
    hint: "Legendary bands, guitar heroes, amps, classics and album lore",
    targetWord: "ledzeppelin",
    palette: { accent: "#581717", accent2: "#d04b4b", bg: "#fff7f7" },
    words: [
      "ledzeppelin","rollingstones","thewho","pinkfloyd","fleetwoodmac","thebeatles","aerosmith","acdc","queen","eagles","creedence",
      "tompetty","u2","vanhalen","deep purple","black sabbath","jimi hendrix","jimihendrix","gilmour","waters","plant","page","bonham",
      "guitar","bass","drums","leadguitar","rhythm","solo","riff","powerchord","amp","marshall","fender","gibson","stratocaster","lespaul",
      "humbucker","overdrive","wah","phaser","chorus","delay","reverb","album","vinyl","LP","single","bside","track","setlist","encore",
      "tour","arena","stadium","roadie","soundcheck","mixing","mastering","producer","engineer","drumkit","cymbal","hi-hat","snare",
      "bassdrum","pedalboard","amphead","cabinet","microphone","vocal","harmonica","slideguitar","bottleneck","sitar","organ","keyboard",
      "piano","synth","moog","rhodes","verse","chorus","bridge","hook","anthem","ballad","bluesrock","psych","prog","hardrock","softrock",
      "punk","hairmetal","stadiumrock","tribute","cover","remaster","boxset","bootleg","demo","session","soundtrack","biopic","liner",
      "notes","albumart","poster","roadcase","tourbus","merch","t-shirt","backline","soundman","monitor","mix"
    ]
  }
];

let currentTheme = null;
let targetWord = "";
let attrsLeft = 5;
let finalsLeft = 2;
let guessScores = {};   // store computed scores for consistency
let historyList = [];   // {word,score}

// Several helper utilities
function applyPalette(p){
  if(!p) return;
  document.documentElement.style.setProperty("--accent", p.accent);
  document.documentElement.style.setProperty("--accent2", p.accent2);
  document.documentElement.style.setProperty("--bg", p.bg);
  // update banner quickly
  const banner = document.getElementById("themeBanner");
  if(banner) banner.style.background = "transparent";
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

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[ch])); }

// choose initial theme (persisted or random)
function pickInitialTheme(){
  const saved = localStorage.getItem("themeMe_selectedTheme_v1");
  if(saved){
    const t = THEMES.find(x=>x.name===saved);
    if(t) return t;
  }
  // pick random theme
  return THEMES[Math.floor(Math.random()*THEMES.length)];
}

// set theme object
function setTheme(theme){
  currentTheme = (typeof theme === "string") ? THEMES.find(t=>t.name===theme) : theme;
  if(!currentTheme) currentTheme = THEMES[0];
  targetWord = currentTheme.targetWord.toLowerCase();
  themeNameEl.textContent = currentTheme.name;
  applyPalette(currentTheme.palette);
  resetRound();
  localStorage.setItem("themeMe_selectedTheme_v1", currentTheme.name);
  buildAdminDropdown();
}

// reset round state
function resetRound(){
  attrsLeft = 5; finalsLeft = 2;
  guessScores = {}; historyList = [];
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

// scoring heuristic (deterministic per round for a word)
function scoreFor(word){
  const w = word.toLowerCase();
  if(guessScores[w] !== undefined) return guessScores[w];
  const t = targetWord;
  // letter set match
  const aSet = new Set(w.split(''));
  let matches = 0;
  aSet.forEach(ch => { if(t.includes(ch)) matches++; });
  // position match bonus
  let pos = 0;
  for(let i=0;i<Math.min(w.length,t.length);i++) if(w[i]===t[i]) pos++;
  // substring bonus
  const substr = (t.includes(w) || w.includes(t)) ? 2 : 0;
  let base = Math.min(90, 30 + matches*8 + pos*4 + substr*6);
  if(w === t) base = 100;
  base = Math.max(0, Math.min(100, Math.round(base)));
  guessScores[w] = base;
  return base;
}

// add history item UI
function addHistory(word,score){
  const div = document.createElement("div");
  div.className = "history-item";
  div.innerHTML = `<div class="word">${escapeHtml(word)}</div><div class="score">${score}</div>`;
  historyEl.prepend(div);
}

// handle attribute guess
function handleAttrGuess(){
  const val = attrInput.value.trim().toLowerCase();
  attrInput.value = "";
  if(!val) return;
  if(!currentTheme.words.includes(val)){
    invalidMsg.textContent = "Not a listed word, try again";
    setTimeout(()=> invalidMsg.textContent = "", 1400);
    return;
  }
  // if already guessed, show same score and don't consume a guess
  if(guessScores[val] !== undefined){
    const s = guessScores[val];
    feedbackEl.textContent = `${val} → ${s}`;
    return;
  }
  const s = scoreFor(val);
  addHistory(val,s);
  historyList.unshift({word:val,score:s});
  attrsLeft--;
  attrsLeftEl.textContent = attrsLeft;
  const done = 5 - attrsLeft;
  progressBar.style.width = `${Math.round((done/5)*100)}%`;
  feedbackEl.textContent = `${val} → ${s}`;
  if(attrsLeft <= 0) finalArea.style.display = "flex";
}

// handle final guess
function handleFinalGuess(){
  const val = finalInput.value.trim().toLowerCase();
  finalInput.value = "";
  if(!val) return;
  finalsLeft--;
  finalLeftEl.textContent = finalsLeft;
  if(val === targetWord){
    feedbackEl.textContent = `🎉 Correct! The hidden word was "${targetWord}".`;
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

// show hint in red
function showHint(){
  if(currentTheme && currentTheme.hint){
    hintText.textContent = currentTheme.hint;
    hintText.style.color = "red";
  }
}

// chip bubble animation
function showChip(){
  chipBubble.classList.add("show");
  setTimeout(()=> chipBubble.classList.remove("show"), 2000);
}

// admin dropdown builder
function buildAdminDropdown(){
  adminDropdown.innerHTML = "";
  THEMES.forEach(t=>{
    const b = document.createElement("button");
    b.textContent = t.name;
    b.className = "btn";
    b.style.background = "#fff";
    b.style.color = "var(--accent)";
    b.addEventListener("click", ()=> {
      setTheme(t.name);
      adminDropdown.style.display = "none";
    });
    adminDropdown.appendChild(b);
  });
}

// admin key handler
adminKey.addEventListener("click", ()=>{
  const pin = prompt("Enter admin PIN:");
  if(pin === ADMIN_PIN){
    adminDropdown.style.display = adminDropdown.style.display === "flex" ? "none" : "flex";
  } else {
    alert("Wrong PIN");
  }
});

// wire UI events
attrBtn.addEventListener("click", handleAttrGuess);
attrInput.addEventListener("keypress", e => { if(e.key === "Enter") handleAttrGuess(); });
finalBtn.addEventListener("click", handleFinalGuess);
finalInput.addEventListener("keypress", e => { if(e.key === "Enter") handleFinalGuess(); });
hintBtn.addEventListener("click", showHint);
chipBtn.addEventListener("click", showChip);
closeRulesBtn.addEventListener("click", ()=>{ rulesModal.style.display = "none"; localStorage.setItem(RULES_KEY,"1"); });

// initialize app
(function init(){
  showRulesIfNeeded();
  const t = pickInitialTheme();
  setTheme(t);
  buildAdminDropdown();
})();



