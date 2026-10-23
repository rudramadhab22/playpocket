<div align="center">
  <h1>🎮 PlayPocket</h1>
  <p><em>Your next favorite game is one click away.</em></p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
</div>

---

## 🌌 Overview

**PlayPocket** is a modern, lightweight collection of browser-based mini-games wrapped in a sleek, dark arcade theme. Built entirely on the frontend with React and Vite, it utilizes `localStorage` to save your personal bests, track your game history, and deliver a lightning-fast gaming experience without the need for an external backend or database.

Whether you have 30 seconds to test your reaction time or 5 minutes for a Sudoku puzzle, PlayPocket is designed for quick breaks.

---

## ✨ Features

- 🏆 **Local Leaderboards:** All high scores and historical data are saved securely on your device.
- 📅 **Daily Challenges:** A deterministically rotating "Game of the Day" keeps things fresh and encourages daily play.
- 🎨 **Arcade Aesthetic:** A polished dark mode UI with vibrant purple and teal neon accents.
- 📱 **Fully Responsive:** Play on your desktop, tablet, or smartphone seamlessly.
- ⚡ **Zero Latency:** No backend means instant load times and offline-ready capabilities.

---

## 🕹️ Game Library

1. **🧠 Memory Match** - Test your memory by finding all matching emoji pairs in the fewest moves possible.
2. **⚡ Reaction Test** - Wait for the green screen and click as fast as humanly possible.
3. **🔤 Word Guess** - A Wordle-inspired word deduction game. Guess the 5-letter word in 6 attempts.
4. **🔢 Number Puzzle** - The classic sliding 15-puzzle. Arrange the numbers in order using the empty space.
5. **🧩 Sudoku** - The timeless 9x9 logic puzzle, complete with an on-screen numpad for mobile players and a built-in timer.

---

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Styling:** Pure CSS3 (Custom Properties, Flexbox, CSS Grid)
- **Data Persistence:** Browser `localStorage` API

---

## 🚀 Getting Started

Want to run PlayPocket locally or contribute? It's incredibly easy to set up.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rudramadhab22/playpocket.git
   cd playpocket
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Play!**
   Open your browser and navigate to `http://localhost:5173` (or the port Vite provides).

---

## 📁 Project Structure

```text
playpocket/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI (Navbar, Footer, GameCard)
│   ├── games/            # Individual game logic & styling components
│   ├── pages/            # Main views (Home, GamePage, Leaderboard)
│   ├── utils/            # Helper functions (storage, daily rotation logic)
│   ├── App.jsx           # Main router & layout wrapper
│   ├── index.css         # Global variables & arcade theme styles
│   └── main.jsx          # React entry point
└── package.json          # Dependencies & scripts
```

---

<div align="center">
  <p>Built with 💜 for quick breaks and high scores.</p>
</div>
