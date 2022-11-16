export class Letter {
  letter: string = "";
  id: number;
  wasVisited: boolean = false;
  incorrect: boolean = false;

  constructor(string: string, id: number) {
    this.letter = string;
    this.id = id;
  }

  set_wasVisited(boolean: boolean) {
    this.wasVisited = boolean;
  }
}

export default Letter;
