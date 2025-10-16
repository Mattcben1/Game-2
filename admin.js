// Mascot
document.getElementById("chipBtn").addEventListener("click", () => {
  alert("Hi! I'm Chip 🐶");
});

// Admin Control
const adminKey = document.getElementById("adminKey");
const adminDropdown = document.getElementById("adminDropdown");

adminKey.addEventListener("click", () => {
  const pin = prompt("Enter admin PIN:");
  if (pin === "1234") {
    adminDropdown.innerHTML = "";
    THEMES.forEach((t, i) => {
      const btn = document.createElement("button");
      btn.textContent = t.name;
      btn.onclick = () => {
        dailyTheme = THEMES[i];
        dailyWord = dailyTheme.targetWord;
        attrsLeft = 5;
        finalLeft = 2;
        initGame();
        adminDropdown.style.display = "none";
      };
      adminDropdown.appendChild(btn);
    });
    adminDropdown.style.display = "flex";
  } else {
    alert("Wrong PIN");
  }
});
