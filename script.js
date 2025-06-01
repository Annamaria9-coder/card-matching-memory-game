const gameBoard = document.getElementById("game-board");
const message = document.getElementById("message");

let level = 1;
let emojisBase = ['🐶','🐱','🐭','🦊','🐻','🐼','🐨','🐸','🐵','🐯','🦁','🐮','🦄','🐷','🐔','🐙','🦉','🦓','🦒','🐢'];
let emojis = [];
let cards = [];
let flippedCards = [];
let lockBoard = false;

startLevel(level);

function startLevel(lvl) {
  message.textContent = `Level ${lvl}`;
  const pairs = Math.min(lvl + 1, emojisBase.length); // level 1 = 2 pairs, level 2 = 3, ..., up to max
  emojis = emojisBase.slice(0, pairs);
  cards = [...emojis, ...emojis];
  shuffle(cards);
  resetBoard();
  createBoard();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function resetBoard() {
  gameBoard.innerHTML = '';
  flippedCards = [];
  lockBoard = false;
}

function createBoard() {
  cards.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.innerText = "";
    card.addEventListener("click", handleCardClick);
    gameBoard.appendChild(card);
  });
}

function handleCardClick(e) {
  const card = e.target;
  if (lockBoard || card.classList.contains("flipped")) return;

  card.innerText = card.dataset.emoji;
  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    lockBoard = true;
    checkForMatch();
  }
}

function checkForMatch() {
  const [first, second] = flippedCards;

  if (first.dataset.emoji === second.dataset.emoji) {
    flippedCards = [];
    lockBoard = false;

    const allFlipped = document.querySelectorAll(".card.flipped").length;
    if (allFlipped === cards.length) {
      setTimeout(() => {
        level++;
        if (level > 10) {
          message.textContent = "🎉 You finished all 10 levels! Refresh to play again.";
        } else {
          startLevel(level);
        }
      }, 800);
    }

  } else {
    setTimeout(() => {
      first.innerText = "";
      second.innerText = "";
      first.classList.remove("flipped");
      second.classList.remove("flipped");
      flippedCards = [];
      lockBoard = false;
    }, 1000);
  }
}
