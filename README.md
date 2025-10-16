# Theme Me — A Strategic Word Guessing Game

**Theme Me** is an interactive word-guessing game that challenges players to deduce a hidden word based on a daily **theme**.  
Each player gets limited guesses and numeric feedback that tells them *how close* they are to the secret word (0–100).  
Think *Wordle* meets *Categories* — but with a strategic, thematic twist.

---

## How to Play

1. **You’re given a theme** (e.g., *Mountains*, *Oceans*, *Space*).
2. **Guess words** related to that theme.
3. After each guess, you'll get a **numeric score (0–100)** showing how close your word is.
4. You have **5 total guesses** to find the hidden word.
5. If you’re stuck, click the **Hint** button for a subtle clue.
6. If your word isn’t recognized, you’ll see a red “Not a listed word, try again” message — and it won’t count against your total guesses.

---

##  Game Features

-  **Themes with Depth:** Each theme has 150–200 related words of varying similarity.
-  **Numeric Feedback:** No vague hints — just raw 0–100 proximity scores.
-  **Admin Access:** Enter the secret key (`1234`) to access the theme selector dropdown.
-  **Smart Word Validation:** Invalid words don’t count toward your guesses.
-  **Earthy, Minimal Design:** A clean interface that emphasizes simplicity and focus.
-  **Daily Play:** Each day brings a fresh word and theme.

---

## Technologies Used

- **HTML5**
- **CSS3**
- **JavaScript (ES6)**
- **JSON Word Dataset**

---

## Developer Mode

To change the current theme or word list:
1. Click the **key icon** in the top-right corner.
2. Enter the access code: `1234`.
3. Use the dropdown menu to select a new theme.
4. The page will refresh and update globally for all players.

---

## Setup Instructions

If you’d like to run the game locally:

1. Clone this repository  
   ```bash
   git clone https://github.com/Mattcben1/Theme-Me.git
