import Word from "../../Classes/Word";

export function sentenceToArray(sentence: string) {
  const arr = sentence.split(" ");
  return arr;
}

export function sentenceToWordArr(sentence: string) {
  const arr = sentenceToArray(sentence);
  let wordArr = new Array<Word>();
  arr.forEach((word, index) => {
    const temp = new Word(word, index);
    wordArr.push(temp);
  });
  return wordArr;
}
