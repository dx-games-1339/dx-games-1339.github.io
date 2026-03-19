// mtg-shuffle-offset
// Deck state: array of 'land' / 'nonland'
const board = document.getElementById('board');
const pileCountInput = document.getElementById('pileCount');
const btnShuffle = document.getElementById('btnShuffle');
const btnReset = document.getElementById('btnReset');
const stats = document.getElementById('stats');

const INITIAL_NONLAND = 60;
const INITIAL_LAND = 39;
let deck = [];

function makeDeck() {
  deck = [];
  for (let i = 0; i < INITIAL_NONLAND; i++) deck.push('nonland');
  for (let i = 0; i < INITIAL_LAND; i++) deck.push('land');
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

window.addEventListener('DOMContentLoaded', () => {
  makeDeck();
  renderDeck();
});
