import { Letter } from "./Letter";

export class Word {
  letters: Letter[] = [];
  idx: number;
  isBugged = false;

  public constructor(word: string, idx: number) {
    this.letters = this.destructureWord(word);
    this.idx = idx;
  }

  destructureWord(word: string) {
    let letters = new Array<Letter>();
    let count = 0;
    for (const letter of word) {
      const newLt = new Letter(letter, count);
      letters.push(newLt);
      count++;
    }
    return letters;
  }
}

export default Word;
