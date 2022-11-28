export enum length {
  short = 1, // <20
  medium = 2, /// <40
  long = 3, // <60
}

export type Text = {
  source: string;
  content: string;
  type: length;
};

const textArr: Array<Text> = [
  {
    source: "Kagome (InuYasha)",
    content:
      "I want you to be happy. I want you to laugh a lot. I don’t know what exactly I’ll be able to do for you, but I’ll always be by your side.",
    type: length.short,
  },
  {
    source: "Galileo",
    content:
      "You cannot teach a man anything; you can only help him discover it in himself.",
    type: length.short,
  },
  {
    source: "Mary Shelley, Frankenstein",
    content: "Beware; for I am fearless, and therefore powerful.",
    type: length.short,
  },
  {
    source: "Nao Tamori (Charlotte)",
    content: "The scars that you can’t see are the hardest to heal.",
    type: length.short,
  },
  {
    source: "Roronoa Zoro (One Piece)",
    content:
      "You need to accept the fact that you’re not the best and have all the will to strive to be better than anyone you face.",
    type: length.short,
  },
  {
    source: "Akame (Akame Ga Kill)",
    content:
      "If you can’t find a reason to fight, then you shouldn’t be fighting.",
    type: length.short,
  },
  //=====
  {
    source: "La Vie En Rose",
    content: `Hold me close and hold me fast. The magic spell you cast. This is "La vie en rose". When you kiss me, heaven sighs. And though I close my eyes.I see "La vie en rose".`,
    type: length.medium,
  },
  {
    source: "Okabe (Steins; Gate)",
    content:
      "No matter which love line, what time, or where I am, I will always love you. I’ll say it one more time. I love you.",
    type: length.medium,
  },
  {
    source: "Gold D. Rodger (One Piece)",
    content:
      "Destiny. Fate. Dreams. These unstoppable ideas are held deep in the heart of man. As long as there are people who seek freedom in this life, these things shall not vanish from the Earth.",
    type: length.medium,
  },
  {
    source: "Don Quixote Doflamingo (One Piece)",
    content:
      "Those who stand at the top determine what’s wrong and what’s right! This very place is neutral ground! Justice will prevail, you say? But of course it will! Whoever wins this war becomes justice!",
    type: length.medium,
  },
  {
    source: "Jiraiya (Naruto)",
    content:
      "A person grows up when he’s able to overcome hardships. Protection is important, but there are some things that a person must learn on his own.",
    type: length.medium,
  },
  {
    source: "Jet Black (Cowboy Bebop)",
    content:
      "Everything has a beginning and an end. Life is just a cycle of starts and stops. There are ends we don’t desire, but they’re inevitable, we have to face them. It’s what being human is all about.",
    type: length.medium,
  },
  {
    source: " Koro-sensei (Assassination Classroom)",
    content:
      "Whether a fish lives in a clear stream or a water ditch, so long as it continues swimming forward, it will grow up beautifully.",
    type: length.medium,
  },
  {
    source: "Hinata Miyake (A Place Further than the Universe)",
    content:
      "When you hit the point of no return, that’s the moment it truly becomes a journey. If you can still turn back, it’s not really a journey",
    type: length.medium,
  },

  //========
  {
    source: "Albert Einstein ",
    content:
      "The important thing is not to stop questioning. Curiosity has its own reason for existence. One cannot help but be in awe when he contemplates the mysteries of eternity, of life, of the marvelous structure of reality. It is enough if one tries merely to comprehend a little of this mystery each day.",
    type: length.long,
  },
  {
    source: "Koko Hekmatyar (Jormungand)",
    content:
      "Remember what you said before? A normal person with a gun will wind up doing something he never thought himself capable of? No one in this world can truly hold himself separate from violence. Guns are literally within reach of anyone. Sadly that’s where we put our faith, in bullets rather than human kindness",
    type: length.long,
  },
  {
    source: "Saitama (One Punch Man)",
    content:
      "Who decides limits? And based on what? You said you worked hard? Well, maybe you need to work a little harder. Is that really the limit of your strength? Could the you of tomorrow beat you today? Instead of giving in, move forward.",
    type: length.long,
  },
  {
    source: "Erwin Smith (Attack on Titan)",
    content:
      "If you begin to regret, you’ll dull your future decisions and let others make your choices for you. All that’s left for you then is to die. Nobody can foretell the outcome. Each decision you make holds meaning only by affecting your next decision.",
    type: length.long,
  },
  {
    source: "Himura Kenshin (Rurouni Kenshin)",
    content:
      "You’ll only realize that you truly love someone if they already caused you enormous pain. Your enemies can never hurt you the way your loved ones can. It’s the people close to your heart that can give you the most piercing wound. Love is a double-edged sword, it can heal the wound faster or it can sink the blade even deeper.",
    type: length.long,
  },
  {
    source: "Edward Elric (Fullmetal Alchemist: Brotherhood)",
    content:
      "A lesson without pain is meaningless. That’s because no one can gain without sacrificing something. But by enduring that pain and overcoming it, he shall obtain a powerful, unmatched heart.",
    type: length.long,
  },
];

export default textArr;
