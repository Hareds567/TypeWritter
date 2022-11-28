import Word from "../../Classes/Word";
import textArr from "../../Texts/Texts";

function sentenceToArray(sentence: string) {
  const arr = sentence.split(" ");
  return arr;
}

function getTextByType(type: number) {
  return textArr.filter((text) => text.type === type);
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

export function getRandomText() {
  const randomIndex = Math.floor(Math.random() * textArr.length);
  const sentence = sentenceToWordArr(textArr[randomIndex].content);
  return { sentence, obj: textArr[randomIndex] };
}

export function getRandomTextByType(type: number) {
  const textArr = getTextByType(type);
  const randomIndex = Math.floor(Math.random() * textArr.length);
  const sentence = sentenceToWordArr(textArr[randomIndex].content);
  return { sentence, obj: textArr[randomIndex] };
}
