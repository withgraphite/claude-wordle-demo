class WordleGame {
    constructor() {
        this.targetWord = this.getRandomWord();
        this.currentGuess = '';
        this.currentRow = 0;
        this.gameOver = false;
        this.maxGuesses = 6;
        this.wordLength = 5;
        
        this.board = document.getElementById('game-board');
        this.tiles = this.board.querySelectorAll('.tile');
        
        console.log('Target word:', this.targetWord); // For debugging
    }
    
    getRandomWord() {
        const words = [
            'REACT', 'STACK', 'FRAME', 'BUILD', 'MERGE', 'CLONE', 'FETCH',
            'ARRAY', 'LOOPS', 'ASYNC', 'AWAIT', 'EVENT', 'SCOPE', 'HOOKS',
            'STATE', 'PROPS', 'CLICK', 'STYLE', 'CLASS', 'TITLE', 'HELLO',
            'WORLD', 'CODES', 'DEBUG', 'TESTS', 'GRAPH', 'NODES', 'LINKS'
        ];
        return words[Math.floor(Math.random() * words.length)];
    }
    
    getTileIndex(row, col) {
        return row * this.wordLength + col;
    }
    
    addLetter(letter) {
        if (this.currentGuess.length < this.wordLength && !this.gameOver) {
            this.currentGuess += letter;
            const tileIndex = this.getTileIndex(this.currentRow, this.currentGuess.length - 1);
            const tile = this.tiles[tileIndex];
            tile.textContent = letter;
            tile.classList.add('filled');
        }
    }
    
    deleteLetter() {
        if (this.currentGuess.length > 0 && !this.gameOver) {
            const tileIndex = this.getTileIndex(this.currentRow, this.currentGuess.length - 1);
            const tile = this.tiles[tileIndex];
            tile.textContent = '';
            tile.classList.remove('filled');
            this.currentGuess = this.currentGuess.slice(0, -1);
        }
    }
    
    submitGuess() {
        if (this.currentGuess.length === this.wordLength && !this.gameOver) {
            this.evaluateGuess();
            
            if (this.currentGuess === this.targetWord) {
                this.gameOver = true;
                setTimeout(() => alert('Congratulations! You won!'), 500);
            } else if (this.currentRow === this.maxGuesses - 1) {
                this.gameOver = true;
                setTimeout(() => alert(`Game over! The word was ${this.targetWord}`), 500);
            }
            
            this.currentGuess = '';
            this.currentRow++;
        }
    }
    
    evaluateGuess() {
        const guess = this.currentGuess;
        const target = this.targetWord;
        const result = new Array(this.wordLength).fill('absent');
        const targetLetters = target.split('');
        const guessLetters = guess.split('');
        
        // First pass: mark correct letters
        for (let i = 0; i < this.wordLength; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                result[i] = 'correct';
                targetLetters[i] = null; // Mark as used
                guessLetters[i] = null; // Mark as used
            }
        }
        
        // Second pass: mark present letters
        for (let i = 0; i < this.wordLength; i++) {
            if (guessLetters[i] !== null) {
                const letterIndex = targetLetters.indexOf(guessLetters[i]);
                if (letterIndex !== -1) {
                    result[i] = 'present';
                    targetLetters[letterIndex] = null; // Mark as used
                }
            }
        }
        
        // Apply results to tiles
        for (let i = 0; i < this.wordLength; i++) {
            const tileIndex = this.getTileIndex(this.currentRow, i);
            const tile = this.tiles[tileIndex];
            tile.classList.add(result[i]);
        }
        
        // Update keyboard colors
        this.updateKeyboardColors(guess, result);
    }
    
    updateKeyboardColors(guess, result) {
        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i];
            const status = result[i];
            const keyElement = document.querySelector(`.key:not(.key-enter):not(.key-backspace)`);
            const keys = document.querySelectorAll('.key');
            
            for (let key of keys) {
                if (key.textContent === letter) {
                    // Only update if current status is better than existing
                    if (status === 'correct' || 
                        (status === 'present' && !key.classList.contains('correct')) ||
                        (status === 'absent' && !key.classList.contains('correct') && !key.classList.contains('present'))) {
                        key.classList.remove('correct', 'present', 'absent');
                        key.classList.add(status);
                    }
                    break;
                }
            }
        }
    }
}

// Initialize game
const game = new WordleGame();