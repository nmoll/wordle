import { LetterPosition, LetterState, Wordle } from './wordle';

const word = 'games';
const symbols: Record<LetterState, string> = {
  correct: '🟢',
  'wrong-spot': '🟡',
  incorrect: '🔴',
};

const play = (word: string, guesses: string[]): string[][] => {
  const wordle = new Wordle(word);

  const state: string[][] = [];
  guesses.forEach((guess) => {
    wordle.guess(guess);

    const result = wordle.guessResults.at(-1);
    if (!result) {
      return;
    }

    const grade = (letter: LetterPosition): string => {
      return `${letter.letter}${symbols[letter.check()]}`;
    };

    const letters = [];
    letters.push(grade(result.letter1));
    letters.push(grade(result.letter2));
    letters.push(grade(result.letter3));
    letters.push(grade(result.letter4));
    letters.push(grade(result.letter5));
    const gameState = wordle.getGameState();
    if (gameState != 'in progress') {
      letters.push(gameState);
    }
    state.push(letters);
  });
  return state;
};

const testGames = [
  {
    description: 'Should do nothing if word is not 5 letters',
    word: 'games',
    guesses: ['blah', 'testing'],
    expected: [],
  },
  {
    description: 'should handle simple game and lose',
    word: 'games',
    guesses: ['wrong', 'start', 'grass', 'foods', 'blank'],
    expected: [
      ['w🔴', 'r🔴', 'o🔴', 'n🔴', 'g🟡'],
      ['s🟡', 't🔴', 'a🟡', 'r🔴', 't🔴'],
      ['g🟢', 'r🔴', 'a🟡', 's🔴', 's🟢'],
      ['f🔴', 'o🔴', 'o🔴', 'd🔴', 's🟢'],
      ['b🔴', 'l🔴', 'a🟡', 'n🔴', 'k🔴', 'lose'],
    ],
  },
  {
    description: 'should win if word is guessed',
    word: 'games',
    guesses: ['flame', 'games'],
    expected: [
      ['f🔴', 'l🔴', 'a🟡', 'm🟡', 'e🟡'],
      ['g🟢', 'a🟢', 'm🟢', 'e🟢', 's🟢', 'win'],
    ],
  },
  {
    description: 'should handle wrong spot cases',
    word: 'grass',
    guesses: ['sssss', 'sssas', 'ssnak'],
    expected: [
      ['s🔴', 's🔴', 's🔴', 's🟢', 's🟢'],
      ['s🟡', 's🔴', 's🔴', 'a🟡', 's🟢'],
      ['s🟡', 's🟡', 'n🔴', 'a🟡', 'k🔴'],
    ],
  },
];

testGames.forEach((t) => {
  test(t.description, () => {
    expect(play(t.word, t.guesses)).toEqual(t.expected);
  });
});
