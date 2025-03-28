export type LetterState = 'correct' | 'incorrect' | 'wrong-spot';

/**
 * The Wordle game.
 *
 * Create a game
 * ```
 * const word = 'magic' // must be exactly 5 letters
 * const wordle = new Wordle(word)
 * ```
 *
 * Add guesses:
 * ```
 * wordle.guess('guess')
 * ```
 *
 * Check if the user won, lost, or if it's still in progress:
 * ```
 * const gameState = wordle.getGameState()
 * ```
 */
export class Wordle {
  /**
   * A list of guesses that the user has made.
   */
  guessResults: WordGuess[] = [];

  /**
   * The correct word that the user is trying to guess.
   */
  word: string;

  constructor(word: string) {
    this.word = word;
  }

  /**
   * Creates a WordGuess and adds it to the list of guesses.
   */
  guess(guess: string) {
    // If the guess isn't 5 letters, don't allow it.
    if (guess.length !== 5) {
      return;
    }

    // Get each letter character in the word
    // the || just means "if the letter doesn't exist, default to an empty string"
    const letter1 = guess[0] || '';
    const letter2 = guess[1] || '';
    const letter3 = guess[2] || '';
    const letter4 = guess[3] || '';
    const letter5 = guess[4] || '';

    // Creates a new word guess, and
    const wordGuess = new WordGuess(
      new LetterPosition(letter1, 0, this.word, guess),
      new LetterPosition(letter2, 1, this.word, guess),
      new LetterPosition(letter3, 2, this.word, guess),
      new LetterPosition(letter4, 3, this.word, guess),
      new LetterPosition(letter5, 4, this.word, guess)
    );

    // Adds the guess to the list!
    this.guessResults.push(wordGuess);
  }

  /**
   * Returns the state of the game.
   * - If a guess is correct, returns 'win'
   * - If 5 guesses have been made, returns 'lose'
   * - Otherwise returns 'in progress'
   */
  getGameState(): 'in progress' | 'win' | 'lose' {
    for (let guess of this.guessResults) {
      if (guess.check() === 'correct') {
        return 'win';
      }
    }

    if (this.guessResults.length === 5) {
      return 'lose';
    }

    return 'in progress';
  }
}

/**
 * Represents a guess made by the user.
 */
export class WordGuess {
  letter1: LetterPosition;
  letter2: LetterPosition;
  letter3: LetterPosition;
  letter4: LetterPosition;
  letter5: LetterPosition;

  constructor(
    letter1: LetterPosition,
    letter2: LetterPosition,
    letter3: LetterPosition,
    letter4: LetterPosition,
    letter5: LetterPosition
  ) {
    this.letter1 = letter1;
    this.letter2 = letter2;
    this.letter3 = letter3;
    this.letter4 = letter4;
    this.letter5 = letter5;
  }

  /**
   * Checks if the word is correct or incorrect
   * - If all letters are correct, returns 'correct'
   * - Otherwise returns 'incorrect'
   */
  check(): 'correct' | 'incorrect' {
    if (
      this.letter1.check() === 'correct' &&
      this.letter2.check() === 'correct' &&
      this.letter3.check() === 'correct' &&
      this.letter4.check() === 'correct' &&
      this.letter5.check() === 'correct'
    ) {
      return 'correct';
    }
    return 'incorrect';
  }
}

/**
 * Represents a letter in a word at a certain position.
 */
export class LetterPosition {
  letter: string;
  position: number;
  correctWord: string;
  guess: string;

  constructor(letter: string, position: number, word: string, guess: string) {
    this.letter = letter;
    this.position = position;
    this.correctWord = word;
    this.guess = guess;
  }

  /**
   * Checks if the letter is in the correct spot.
   * - If in the correct spot, returns 'correct'
   * - If in the word but wrong-spot, returns 'incorrect'
   * - Otherwise returns 'incorrect'
   */
  check(): LetterState {
    const analyze = this.analyzeWord();
    if (analyze.correct.includes(this.position)) {
      return 'correct';
    }

    if (analyze.wrongSpot.includes(this.position)) {
      return 'wrong-spot';
    }

    return 'incorrect';
  }

  private indexesOfThisLetterInGuess(): number[] {
    const result: number[] = [];
    for (let i = 0; i < this.guess.length; i++) {
      if (this.guess[i] === this.letter) {
        result.push(i);
      }
    }
    return result;
  }

  private indexesOfThisLetterInWord(): number[] {
    const result: number[] = [];
    for (let i = 0; i < this.correctWord.length; i++) {
      if (this.correctWord[i] === this.letter) {
        result.push(i);
      }
    }
    return result;
  }

  private analyzeWord(): { correct: number[]; wrongSpot: number[] } {
    const correct: number[] = [];
    const wrongSpot: number[] = [];

    // word:  [2, 4]
    // guess: [0, 1, 4]

    let indexesOfLetterInWord = this.indexesOfThisLetterInWord();
    let indexesOfLetterInGuess = this.indexesOfThisLetterInGuess();

    // get the correct indexes
    indexesOfLetterInGuess.forEach((index) => {
      if (indexesOfLetterInWord.includes(index)) {
        correct.push(index);
      }
    });

    // word:  [2]
    // guess: [0, 1]

    indexesOfLetterInGuess = indexesOfLetterInGuess.filter(
      (i) => !correct.includes(i)
    );
    indexesOfLetterInWord = indexesOfLetterInWord.filter(
      (i) => !correct.includes(i)
    );

    indexesOfLetterInGuess.forEach((num, i) => {
      if (indexesOfLetterInWord.length >= i + 1) {
        wrongSpot.push(num);
      }
    });

    return {
      correct,
      wrongSpot,
    };
  }
}
