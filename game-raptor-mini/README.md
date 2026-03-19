# DX Strategy Saga

A simple browser-hosted turn-based strategy simulation game designed for GitHub Pages.

## 📦 Project structure

- `index.html`: Single-page application entry.
- `style.css`: All styling including board, units, sidebar, and UI.
- `script.js`: Game logic:
  - Turn phases (`Player`/`Enemy`)
  - Unit movement and attack
  - World simulation (reinforcements, power scaling)
  - Victory/defeat conditions

## ▶️ Running locally

1. Open `index.html` in your browser.
2. Optionally start local static server:
   - `python -m http.server 8000`
   - Open `http://localhost:8000`

## 🌐 Deployment on GitHub Pages

1. Initialize repo (or use existing):
   - `git init`
   - `git add .`
   - `git commit -m "Initial strategy game"`
2. Push to GitHub repository.
3. Enable Pages in repo settings and set source to `main` branch (root).
4. Access at: `https://<your-user>.github.io/<repo-name>/`

## 🕹️ Controls

- Click a blue unit to select it.
- Click a board cell to move or attack an enemy.
- Tap `End Turn` to let enemies act.
- Tap `Run World Tick` as a simulation shortcut.

## 🎯 Gameplay mechanics

- Grid: 10 x 10.
- Friendly units move/attack each turn.
- Enemies move and attack automatically.
- World state: `worldPower` increments each turn.
- Events:
  - + reinforcements every 3 turns.
  - + enemy attack power every 4 turns.

## ✨ Customization ideas

- Additional unit classes, stats, and special abilities.
- Tile terrain effects (forest/swamp/mountains).
- Save/load progress with `localStorage`.
- Audio cues and visual animations.
- Multiplayer via WebSocket/FireStore.

## 🧪 Testing

- Open browser console and confirm no errors.
- Play a few full game cycles and check log messages for turn updates.

---

Released under MIT-style usage for personal/hobby projects.