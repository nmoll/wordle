import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Wordle, LetterPosition } from '../wordle-game/wordle';
import wordsJSON from '../words.json';
import { ConfettiComponent } from './confetti/confetti.component';

class Row {
  id: number;
  columns: Column[];

  constructor(columns: Column[]) {
    this.id = Math.random() * 1000;
    this.columns = columns;
  }
}

class Column {
  id: number;
  letter: LetterPosition | undefined;
  colorClass: string | undefined;

  constructor(letter: LetterPosition | undefined) {
    this.id = Math.random() * 1000;
    this.letter = letter;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [NgClass, ConfettiComponent],
})
export class AppComponent {
  rows: Row[] = [];

  wordle: Wordle = this.createWordle();

  keyboard: string[][] = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
  ];

  guessing: string[] = [];

  constructor() {
    this.createCells();
  }

  guess(word: string) {
    this.wordle.guess(word);
    const i = this.wordle.guessResults.length - 1;
    const guessResult = this.wordle.guessResults[i];
    this.rows[i].columns[0].letter = guessResult.letter1;
    this.rows[i].columns[1].letter = guessResult.letter2;
    this.rows[i].columns[2].letter = guessResult.letter3;
    this.rows[i].columns[3].letter = guessResult.letter4;
    this.rows[i].columns[4].letter = guessResult.letter5;
    setTimeout(() => {
      this.rows[i].columns[0].colorClass = guessResult.letter1.check();
    }, 300);
    setTimeout(() => {
      this.rows[i].columns[1].colorClass = guessResult.letter2.check();
    }, 600);
    setTimeout(() => {
      this.rows[i].columns[2].colorClass = guessResult.letter3.check();
    }, 900);
    setTimeout(() => {
      this.rows[i].columns[3].colorClass = guessResult.letter4.check();
    }, 1200);
    setTimeout(() => {
      this.rows[i].columns[4].colorClass = guessResult.letter5.check();
    }, 1500);
  }

  pressKeyboard(key: string) {
    if (key === 'backspace') {
      if (this.guessing.length > 0) {
        this.guessing.splice(this.guessing.length - 1);
      }
      return;
    }
    if (key === 'enter') {
      if (this.guessing.length === 5) {
        const word = this.guessing.join('');
        this.guessing = [];
        this.guess(word);
      }
      return;
    }
    if (this.guessing.length < 5) {
      this.guessing.push(key);
    }
  }

  startNewGame() {
    this.wordle = this.createWordle();
    this.rows = [];
    this.createCells();
  }

  private createCells() {
    for (let i = 0; i < 5; i++) {
      this.rows.push(
        new Row([
          new Column(undefined),
          new Column(undefined),
          new Column(undefined),
          new Column(undefined),
          new Column(undefined),
        ])
      );
    }
  }

  private createWordle(): Wordle {
    const random = Math.floor(Math.random() * wordsJSON.words.length);
    const word = wordsJSON.words[random];
    return new Wordle(word);
  }
}
