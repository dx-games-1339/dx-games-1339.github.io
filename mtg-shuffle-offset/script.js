// mtg-shuffle-offset
// Deck state: array of 'land' / 'nonland'
const board = document.getElementById('board');
const nonlandCountInput = document.getElementById('nonlandCount');
const landCountInput = document.getElementById('landCount');
const pileCountInput = document.getElementById('pileCount');
const bgSlider = document.getElementById('bgSlider');
const btnShuffle = document.getElementById('btnShuffle');
const btnReset = document.getElementById('btnReset');
const stats = document.getElementById('stats');

let deck = [];

function makeDeck() {
  const nonland = parseInt(nonlandCountInput.value, 10) || 0;
  const land = parseInt(landCountInput.value, 10) || 0;
  deck = [];
  for (let i = 0; i < nonland; i++) deck.push('nonland');
  for (let i = 0; i < land; i++) deck.push('land');
}

function renderDeck() {
  const grid = document.createElement('div');
  grid.className = 'card-grid';

  deck.forEach((cardType, index) => {
    const dot = document.createElement('div');
    dot.className = `card-dot ${cardType}`;
    dot.title = `${index + 1}: ${cardType}`;
    grid.appendChild(dot);
  });

  board.innerHTML = '';
  board.appendChild(grid);

  const counts = {
    nonland: deck.filter(c => c === 'nonland').length,
    land: deck.filter(c => c === 'land').length,
  };
  stats.innerHTML = `Total ${deck.length} cards. Non-land: ${counts.nonland}. Land: ${counts.land}.`;
}

function pileShuffle(piles) {
  if (piles < 2 || piles > 99) return;

  const stack = Array.from({ length: piles }, () => []);
  deck.forEach((card, idx) => {
    stack[idx % piles].push(card);
  });

  deck = stack.flat();
}

btnShuffle.addEventListener('click', () => {
  const piles = parseInt(pileCountInput.value, 10);
  if (Number.isNaN(piles) || piles < 2 || piles > 99) {
    alert('Please enter a value from 2 to 99.');
    return;
  }

  pileShuffle(piles);
  renderDeck();
});

btnReset.addEventListener('click', () => {
  makeDeck();
  renderDeck();
});

nonlandCountInput.addEventListener('input', () => {
  makeDeck();
  renderDeck();
});

landCountInput.addEventListener('input', () => {
  makeDeck();
  renderDeck();
});

bgSlider.addEventListener('input', () => {
  const value = bgSlider.value;
  const gray = Math.floor((value / 100) * 255);
  document.body.style.background = `radial-gradient(circle at 25% 15%, rgb(${gray}, ${gray}, ${gray}) 0%, rgb(${Math.floor(gray * 0.6)}, ${Math.floor(gray * 0.6)}, ${Math.floor(gray * 0.6)}) 60%)`;
});

window.addEventListener('DOMContentLoaded', () => {
  makeDeck();
  renderDeck();
  bgSlider.dispatchEvent(new Event('input')); // Set initial background
});
