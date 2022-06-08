const palavras = ['TOMATE', 'LARANJA', 'CARRO', 'BARCO', 'INTERNET'];
const letters = [];
// let novasPalavras = [];

const newGameBtn = document.querySelector('#btn-new-game');
const startScreen = document.querySelector('#start-screen');
const newWordBtn = document.querySelector('#btn-new-word');
const screenAddWords = document.querySelector('#screen-add-words');
const cancelBtn = document.querySelector('#btn-cancel');
const saveWord = document.querySelector('#btn-save-word');
const gameScreen = document.querySelector('#game-screen');
let secretWord = '';
let correctWord = '';
let errors = 9;

const board = document.getElementById('board').getContext('2d');

const newWordInput = document.querySelector('#new-word');

const startScreenClass = startScreen.className;
const wordScreenClass = screenAddWords.className;
// const gameScreenClass = gameScreen.className;

newGameBtn.addEventListener('click', () => {
  if (startScreenClass.indexOf('hidden') === -1) {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    drawLine(randomWord());
  }
});

newWordBtn.addEventListener('click', () => {
  if (wordScreenClass.indexOf('hidden') !== -1) {
    startScreen.classList.add('hidden');
    screenAddWords.classList.remove('hidden');
  }
});

cancelBtn.addEventListener('click', () => {
  startScreen.classList.remove('hidden');
  screenAddWords.classList.add('hidden');
  newWordInput.value = '';
});

/* função para inserir novas palavras no array */
saveWord.addEventListener('click', () => {
  const newWordValue = newWordInput.value;
  if (newWordValue !== '') {
    const novasPalavras = newWordValue.split(', ');
    console.log(novasPalavras);
    for (let i = 0; i < novasPalavras.length; i += 1) {
      novasPalavras[i] = novasPalavras[i].toUpperCase();
      novasPalavras[i] = novasPalavras[i].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    } /* adicionar popup sobre as letras maiusculas e não usar caracteres com acento e ç */

    let startGame = false;

    for (let index = 0; index < novasPalavras.length; index += 1) {
      if (palavras.includes(novasPalavras[index])) {
        alert(`A palavra ${novasPalavras[index]} já está incluída no jogo`);
      } else {
        palavras.push(novasPalavras[index]);
        startGame = true;
      }
    }
    if (startGame === true) {
      screenAddWords.classList.add('hidden');
      gameScreen.classList.remove('hidden');
      drawLine(randomWord());
    }
    console.log(palavras);
  } else {
    /* criar popup informando que o campo não pode estar em branco */
    alert('Favor inserir uma palavra, ou pressione cancelar, para retornar para tela principal');
  }
});

/* função desenhar jogo */

function randomWord() {
  const chosenWord = palavras[Math.floor(Math.random() * palavras.length)];
  // console.log(chosenWord);
  secretWord = chosenWord;
  return chosenWord;
}

// console.log(secretWord);

function drawLine() {
  board.lineWidth = 6;
  board.lineCap = 'round';
  board.lineJoin = 'round';
  board.strokeStyle = '#0A3871';
  board.beginPath();

  const axis = 600 / secretWord.length;
  console.log(secretWord.length);
  for (let i = 0; i < secretWord.length; i += 1) {
    board.moveTo(300 + (axis * i), 640);
    board.lineTo(350 + (axis * i), 640);
  }
  board.stroke();
  board.closePath();
  console.log(secretWord);
}

function writeCorrectLetter(index) {
  board.font = 'bold 52px Inter';
  board.lineWidth = 6;
  board.lineCap = 'round';
  board.lineJoin = 'round';
  board.strokeStyle = '#0A3871';
  const axis = 600 / secretWord.length;
  board.fillText(secretWord[index], 305 + (axis * index), 620);
  board.stroke();
}

function writeWrongLetter(wrongLetter, errorsLeft) {
  board.font = 'bold 40px Inter';
  board.lineWidth = 6;
  board.lineCap = 'round';
  board.lineJoin = 'round';
  board.strokeStyle = '#0A3871';
  board.fillText(wrongLetter, 335 + (40 * (10 - errorsLeft)), 650, 40);
  board.stroke();
}

function checkCorrectLetter(key) {
  if (letters.length < 1 || letters.indexOf(key) < 0) {
    console.log(key);
    letters.push(key);
    return false;
  }
  letters.push(key.toUpperCase());
  return true;
}

function addCorrectLetter(i) {
  correctWord += secretWord[i].toUpperCase();
}

function addWrongLetter(letter) {
  if (secretWord.indexOf(letter) <= 0) {
    errors -= 1;
  }
}

document.onkeydown = (event) => {
  const letra = event.key.toUpperCase();
  if (!checkCorrectLetter(event.key)) {
    if (secretWord.includes(letra)) {
      addCorrectLetter(secretWord.indexOf(letra));
      for (let i = 0; i < secretWord.length; i += 1) {
        if (secretWord[i] === letra) {
          writeCorrectLetter(i);
        }
      }
    }
  } else {
    if (!checkCorrectLetter(event.key)) {
      return;
    }

    addWrongLetter(letra);
    writeWrongLetter(letra, errors);
  }
};
