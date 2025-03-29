import { Wordle } from './wordle';

const word = 'games';

test('Should start with no guess results', () => {
  const wordle = new Wordle(word);
  expect(wordle.guessResults).toEqual([]);
});

test('Should do nothing if word is less than 5 letters', () => {
  const wordle = new Wordle(word);
  wordle.guess('test');
  expect(wordle.guessResults).toEqual([]);
});

test('Should do nothing if word is more than 5 letters', () => {
  const wordle = new Wordle(word);
  wordle.guess('testing');
  expect(wordle.guessResults).toEqual([]);
});

test('Should add guess result if word is 5 letters', () => {
  const wordle = new Wordle(word);
  wordle.guess('tests');
  expect(wordle.guessResults.length).toEqual(1);
});

test('Should build guess result with no correct letters', () => {
  const wordle = new Wordle(word);
  wordle.guess('xyqrb');

  const result = wordle.guessResults[0];
  if (!result) {
    throw new Error('Expected a guess result to be added');
  }

  expect(result.letter1.letter).toBe('x');
  expect(result.letter1.check()).toBe('incorrect');

  expect(result.letter2.letter).toBe('y');
  expect(result.letter2.check()).toBe('incorrect');

  expect(result.letter3.letter).toBe('q');
  expect(result.letter3.check()).toBe('incorrect');

  expect(result.letter4.letter).toBe('r');
  expect(result.letter4.check()).toBe('incorrect');

  expect(result.letter5.letter).toBe('b');
  expect(result.letter5.check()).toBe('incorrect');
});

test('Should build guess result with some correct letters', () => {
  const wordle = new Wordle(word);
  wordle.guess('gyqrs');

  const result = wordle.guessResults[0];
  if (!result) {
    throw new Error('Expected a guess result to be added');
  }

  expect(result.letter1.letter).toBe('g');
  expect(result.letter1.check()).toBe('correct');

  expect(result.letter2.letter).toBe('y');
  expect(result.letter2.check()).toBe('incorrect');

  expect(result.letter3.letter).toBe('q');
  expect(result.letter3.check()).toBe('incorrect');

  expect(result.letter4.letter).toBe('r');
  expect(result.letter4.check()).toBe('incorrect');

  expect(result.letter5.letter).toBe('s');
  expect(result.letter5.check()).toBe('correct');
});

test('Should build guess result with letters in wrong positions', () => {
  const wordle = new Wordle(word);
  wordle.guess('sygrs');

  const result = wordle.guessResults[0];
  if (!result) {
    throw new Error('Expected a guess result to be added');
  }

  expect(result.letter1.letter).toBe('s');
  expect(result.letter1.check()).toBe('incorrect');

  expect(result.letter2.letter).toBe('y');
  expect(result.letter2.check()).toBe('incorrect');

  expect(result.letter3.letter).toBe('g');
  expect(result.letter3.check()).toBe('wrong-spot');

  expect(result.letter4.letter).toBe('r');
  expect(result.letter4.check()).toBe('incorrect');

  expect(result.letter5.letter).toBe('s');
  expect(result.letter5.check()).toBe('correct');
});

test('Should show letter in incorrect spot if the letter is already correct elsewhere', () => {
  const wordle = new Wordle(word);
  wordle.guess('sygrx');

  const result = wordle.guessResults[0];
  if (!result) {
    throw new Error('Expected a guess result to be added');
  }

  expect(result.letter1.letter).toBe('s');
  expect(result.letter1.check()).toBe('wrong-spot');

  expect(result.letter2.letter).toBe('y');
  expect(result.letter2.check()).toBe('incorrect');

  expect(result.letter3.letter).toBe('g');
  expect(result.letter3.check()).toBe('wrong-spot');

  expect(result.letter4.letter).toBe('r');
  expect(result.letter4.check()).toBe('incorrect');

  expect(result.letter5.letter).toBe('x');
  expect(result.letter5.check()).toBe('incorrect');
});

test('Should show letter incorrect if the word has the letter multiple times and all are already correct', () => {
  const wordle = new Wordle('tests');
  wordle.guess('sssss');

  const result = wordle.guessResults[0];
  if (!result) {
    throw new Error('Expected a guess result to be added');
  }

  expect(result.letter1.letter).toBe('s');
  expect(result.letter1.check()).toBe('incorrect');

  expect(result.letter2.letter).toBe('s');
  expect(result.letter2.check()).toBe('incorrect');

  expect(result.letter3.letter).toBe('s');
  expect(result.letter3.check()).toBe('correct');

  expect(result.letter4.letter).toBe('s');
  expect(result.letter4.check()).toBe('incorrect');

  expect(result.letter5.letter).toBe('s');
  expect(result.letter5.check()).toBe('correct');
});

test('Should show letter in wrong spot if the word has the letter multiple times and not all are correct', () => {
  const wordle = new Wordle('tests');
  wordle.guess('ssaas');

  const result = wordle.guessResults[0];
  if (!result) {
    throw new Error('Expected a guess result to be added');
  }

  expect(result.letter1.letter).toBe('s');
  expect(result.letter1.check()).toBe('wrong-spot');

  expect(result.letter2.letter).toBe('s');
  expect(result.letter2.check()).toBe('incorrect');

  expect(result.letter3.letter).toBe('a');
  expect(result.letter3.check()).toBe('incorrect');

  expect(result.letter4.letter).toBe('a');
  expect(result.letter4.check()).toBe('incorrect');

  expect(result.letter5.letter).toBe('s');
  expect(result.letter5.check()).toBe('correct');
});

test('Should be in progress if guesses are not correct and there are more guesses left', () => {
  const wordle = new Wordle(word);
  wordle.guess('snake');
  expect(wordle.getGameState()).toBe('in progress');
  wordle.guess('tests');
  expect(wordle.getGameState()).toBe('in progress');
  wordle.guess('arise');
  expect(wordle.getGameState()).toBe('in progress');
  wordle.guess('great');
  expect(wordle.getGameState()).toBe('in progress');
});

test('Should return lose state if 5 guesses are not correct', () => {
  const wordle = new Wordle(word);
  wordle.guess('snake');
  wordle.guess('tests');
  wordle.guess('arise');
  wordle.guess('great');
  wordle.guess('asdfs');
  expect(wordle.getGameState()).toBe('lose');
});

test('Should return win state if correct guess', () => {
  const wordle = new Wordle(word);
  wordle.guess('snake');
  wordle.guess('tests');
  wordle.guess('games');
  expect(wordle.getGameState()).toBe('win');
});

test('Should return lose state if 5 incorrect guesses', () => {
  const wordle = new Wordle(word);
  wordle.guess('snake');
  wordle.guess('tests');
  wordle.guess('tesdf');
  wordle.guess('gamer');
  wordle.guess('guard');
  expect(wordle.getGameState()).toBe('lose');
});
