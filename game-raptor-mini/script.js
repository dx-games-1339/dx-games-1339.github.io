const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const gameContainer = document.getElementById('gameContainer');
const startBtn = document.getElementById('startBtn');
const messageEl = document.getElementById('message');

let score = 0;
let time = 30;
let timerId = null;
let spawnId = null;
let gameActive = false;

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clearDots() {
  gameContainer.querySelectorAll('.dot').forEach(dot => dot.remove());
}

function spawnDot() {
  clearDots();

  const dot = document.createElement('div');
  dot.className = 'dot';

  const containerRect = gameContainer.getBoundingClientRect();
  const maxX = containerRect.width - 28;
  const maxY = containerRect.height - 28;

  dot.style.left = random(0, maxX) + 'px';
  dot.style.top = random(0, maxY) + 'px';

  dot.addEventListener('click', () => {
    if (!gameActive) return;
    score += 1;
    scoreEl.textContent = score;
    spawnDot();
  });

  gameContainer.appendChild(dot);
}

function updateTime() {
  time -= 1;
  timeEl.textContent = time;

  if (time <= 0) {
    endGame();
  }
}

function startGame() {
  score = 0;
  time = 30;
  gameActive = true;
  messageEl.textContent = '';
  scoreEl.textContent = score;
  timeEl.textContent = time;
  startBtn.disabled = true;

  spawnDot();
  timerId = setInterval(updateTime, 1000);
  spawnId = setInterval(spawnDot, 1500);
}

function endGame() {
  gameActive = false;
  clearInterval(timerId);
  clearInterval(spawnId);
  messageEl.textContent = `Game over! Final score: ${score}. Click Start to play again.`;
  startBtn.disabled = false;
  clearDots();
}

startBtn.addEventListener('click', startGame);

window.addEventListener('load', () => {
  messageEl.textContent = 'Press Start to begin.';
});
