const BG_COLOUR = '#FFFAFA'; //couleurs du fond
const SNAKE_COLOUR = '#7CFC00'; //couleurs du serpent
const FOOD_COLOUR = '#FF0000'; //couleurs de la nourriture

const socket = io('https://sleepy-island-33889.herokuapp.com/'); //projet hébérger sur heroku fonctionnel aussi en local host si serveur down

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);    //  synchronisation activée pour chaque fonctionnalités

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay'); // récupération de données 

newGameBtn.addEventListener('click', newGame); //récupération d'événements
joinGameBtn.addEventListener('click', joinGame); //récupération d'événements


function newGame() {
  socket.emit('newGame');
  init();
} //nouvelle partie avec le socket

function joinGame() {
  const code = gameCodeInput.value;
  socket.emit('joinGame', code);
  init();
} //rejoindre une partie avec le socket

let canvas, ctx; //avoir acces partout
let playerNumber; //avoir acces partout
let gameActive = false; //avoir acces partout

function init() { //parametrage du canvas  
  initialScreen.style.display = "none";
  gameScreen.style.display = "block";

  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  canvas.width = canvas.height = 600;

  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  document.addEventListener('keydown', keydown);
  gameActive = true;
}

function keydown(e) { // enregistrement d'evenement de clavier  
  socket.emit('keydown', e.keyCode);
}

function paintGame(state) { //alignement du jeu sur le site avec les parametres du snake joueur 2
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const food = state.food;
  const gridsize = state.gridsize;
  const size = canvas.width / gridsize;

  ctx.fillStyle = FOOD_COLOUR;
  ctx.fillRect(food.x * size, food.y * size, size, size);

  paintPlayer(state.players[0], size, SNAKE_COLOUR);
  paintPlayer(state.players[1], size, 'blue');
}

function paintPlayer(playerState, size, colour) { //alignement du snake 
  const snake = playerState.snake;

  ctx.fillStyle = colour;
  for (let cell of snake) {
    ctx.fillRect(cell.x * size, cell.y * size, size, size);
  }
}

function handleInit(number) { //definition du playerNumber
  playerNumber = number;
}

function handleGameState(gameState) { //maintien du jeu sans inactivité
  if (!gameActive) {
    return;
  }
  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => paintGame(gameState));
}

function handleGameOver(data) { //fin de partie si victoire ou défaite
  if (!gameActive) {
    return;
  }
  data = JSON.parse(data);

  gameActive = false;

  if (data.winner === playerNumber) {
    alert('Vous avez gagner !');
  } else {
    alert('Vous avez perdu!');
  }
}

function handleGameCode(gameCode) { //affichage du gamecode
  gameCodeDisplay.innerText = gameCode;
}

function handleUnknownCode() { //si il n'est pas reconnu
  reset();
  alert("Votre code n'est pas reconnu")
}

function handleTooManyPlayers() { // si il y'a + de 2 joueurs
  reset();
  alert('Cette partie de jeu contient le maximum de joueurs entrez un autre code!');
}

function reset() { //renitialisation
  playerNumber = null;
  gameCodeInput.value = '';
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}
