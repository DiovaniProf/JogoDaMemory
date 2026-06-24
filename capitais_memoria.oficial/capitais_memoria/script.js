const pairs = [
  { id: 1, items: ["Paraná", "Curitiba"] },
  { id: 2, items: ["São Paulo", "São Paulo"] },
  { id: 3, items: ["Bahia", "Salvador"] },
  { id: 4, items: ["Amazonas", "Manaus"] },
  { id: 5, items: ["Ceará", "Fortaleza"] },
  { id: 6, items: ["Goiás", "Goiânia"] },
  { id: 7, items: ["Pernambuco", "Recife"] },
  { id: 8, items: ["Rio Grande do Sul", "Porto Alegre"] }
];

const gameBoard = document.getElementById("gameBoard");
const attemptsElement = document.getElementById("attempts");
const matchesElement = document.getElementById("matches");
const totalPairsElement = document.getElementById("totalPairs");
const messageElement = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 0;
let matches = 0;

totalPairsElement.textContent = pairs.length;

function createDeck() {
  const deck = [];

  pairs.forEach((pair) => {
    pair.items.forEach((text) => {
      deck.push({
        pairId: pair.id,
        text
      });
    });
  });

  return shuffle(deck);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function renderBoard() {
  gameBoard.innerHTML = "";
  const deck = createDeck();

  deck.forEach((item, index) => {
    const card = document.createElement("button");
    card.className = "card";
    card.type = "button";
    card.dataset.pairId = item.pairId;
    card.dataset.index = index;
    card.setAttribute("aria-label", "Carta virada");

    card.innerHTML = `
      <span class="card-inner">
        <span class="card-face card-front">🧠</span>
        <span class="card-face card-back">${item.text}</span>
      </span>
    `;

    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains("matched")) {
    return;
  }

  card.classList.add("flipped");
  card.setAttribute("aria-label", `Carta: ${card.innerText}`);

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  attempts++;
  attemptsElement.textContent = attempts;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.pairId === secondCard.dataset.pairId;

  if (isMatch) {
    markAsMatched();
  } else {
    unflipCards();
  }
}

function markAsMatched() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  firstCard.disabled = true;
  secondCard.disabled = true;

  matches++;
  matchesElement.textContent = matches;
  messageElement.textContent = "Muito bem! Você encontrou um par.";

  resetTurn();

  if (matches === pairs.length) {
    messageElement.textContent = `Parabéns! Você venceu em ${attempts} tentativa(s).`;
  }
}

function unflipCards() {
  lockBoard = true;
  messageElement.textContent = "Não foi dessa vez. Tente novamente!";

  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetTurn();
  }, 900);
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function restartGame() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  attempts = 0;
  matches = 0;

  attemptsElement.textContent = attempts;
  matchesElement.textContent = matches;
  messageElement.textContent = "Clique em duas cartas para formar os pares.";

  renderBoard();
}

restartBtn.addEventListener("click", restartGame);

restartGame();
