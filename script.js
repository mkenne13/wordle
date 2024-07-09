document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('board');
    const guessInput = document.getElementById('guess-input');
    const submitButton = document.getElementById('submit-guess');
    const errorMessage = document.getElementById('error-message');

    let guessCount = 0;
    let targetWord = '';

    const gameSettings = {
        wordList: [
            'apple', 'berry', 'cloud', 'delta', 'earth',
            'fairy', 'ghost', 'hotel', 'igloo', 'joker',
            'happy', 'lemon', 'mango', 'night', 'ocean',
            'pizza', 'queen', 'river', 'storm', 'tiger',
            'crush', 'viola', 'water', 'xenon', 'yogur',
            'zebra', 'yacht', 'whale', 'virus', 'union',
            'tango', 'snake', 'quick', 'panda', 'ozone',
            'mummy', 'limbo', 'kicks', 'jokes', 'happy',
            'games', 'fever', 'crazy', 'bingo', 'alert',
            'bonus', 'coach', 'death', 'eagle', 'fudge',
            'glowy', 'humor', 'infer', 'jewel', 'knife',
            'lyric', 'magic', 'noble', 'opera', 'phase',
            'quart', 'reign', 'squad', 'trick', 'unity',
            'value', 'worth', 'xenon', 'yearn', 'zodia',
            'yield', 'world', 'vixen', 'ultra', 'token',
            'story', 'spark', 'quest', 'radar', 'pixel',
            'oasis', 'north', 'metal', 'loved', 'kings',
            'jazzy', 'hawks', 'glory', 'freak', 'devil',
            'chips', 'brain', 'alias', 'bloom', 'crisp'
        ],

        fetchRandomWord: function() {
            const randomIndex = Math.floor(Math.random() * this.wordList.length);
            return this.wordList[randomIndex].toUpperCase();
        }
    };

    function initializeGame() {
        targetWord = gameSettings.fetchRandomWord();
        console.log('The target word is:', targetWord);
        createBoard();
        displayAverageGuesses();
    }

    function createRow(rowIndex) {
        for (let i = 0; i < 5; i++) {
            let cell = document.createElement('div');
            cell.className = `cell position-${i} row-${rowIndex}`;
            board.appendChild(cell);
        }
    }

    function createBoard() {
        for (let i = 0; i < 6; i++) {
            createRow(i);
        }
    }

    function displayAverageGuesses() {
        const averageGuessesElement = document.getElementById('average-guesses-value');
        const averageGuesses = calculateAverageGuesses();
        averageGuessesElement.textContent = averageGuesses.toFixed(2);
    }

    function calculateAverageGuesses() {
        const guesses = JSON.parse(localStorage.getItem('guesses')) || [];
        const totalGuesses = guesses.reduce((total, guess) => total + guess, 0);
        return guesses.length ? totalGuesses / guesses.length : 0;
    }

    function updateAverageGuesses(newGuesses) {
        const guesses = JSON.parse(localStorage.getItem('guesses')) || [];
        guesses.push(newGuesses);
        localStorage.setItem('guesses', JSON.stringify(guesses));
    }

    function checkGuess(guess) {
        if (guess.length !== 5) {
            showErrorMessage('Guess must be a 5-letter word.');
            return;
        }

        if (!gameSettings.wordList.includes(guess.toLowerCase())) {
            showErrorMessage('Invalid word.');
            return;
        }

        updateBoard(guess);
    }

    function updateBoard(guess) {
        const rowCells = document.querySelectorAll(`.row-${guessCount}`);
        guess.split('').forEach((letter, index) => {
            const cell = rowCells[index];
            cell.textContent = letter;

            if (letter === targetWord[index]) {
                cell.classList.add('correct');
            } else if (targetWord.includes(letter)) {
                cell.classList.add('wrong-place');
            } else {
                cell.classList.add('not-in-word');
            }
        });

        guessCount++;
        if (guess === targetWord) {
            showErrorMessage('Congratulations! You guessed the word!', false);
            updateAverageGuesses(guessCount);
            displayAverageGuesses();
            return;
        }

        if (guessCount === 6) {
            showErrorMessage(`Game over! The word was ${targetWord}.`);
            return;
        }

        guessInput.value = '';
        guessInput.focus();
    }

    function showErrorMessage(message, show = true) {
        errorMessage.textContent = message;
        errorMessage.style.visibility = show ? 'visible' : 'hidden';
    }

    submitButton.addEventListener('click', () => {
        const guess = guessInput.value.toUpperCase();
        checkGuess(guess);
    });

    initializeGame();
});
