export interface Character {
  level: '初級' | '中級' | '上級' | '超上級';
  name: string;
  title: string;
  quotes: string[];
  image: string;
}

export const characters: Character[] = [
  {
    level: '初級',
    name: 'ユズ',
    title: 'ギャルAI「ユズ」',
    quotes: [
      'マジすごいじゃん〜！えらい！',
      'これちょっとだけ直せば完璧っしょ☆',
    ],
    image: '/images/yuzu.png',
  },
  {
    level: '中級',
    name: 'サキ',
    title: '先輩エンジニア「サキ」',
    quotes: [
      'この責務分離、もう一歩かな',
      '設計思想としては筋が通ってる',
    ],
    image: '/images/saki.png',
  },
  {
    level: '上級',
    name: 'カグヤ',
    title: '辛口メンター「カグヤ」',
    quotes: [
      'このコード、保守性ゼロ',
      'それ、Goの文法理解してる？',
    ],
    image: '/images/kaguya.png',
  },
  {
    level: '超上級',
    name: '黒鉄レン',
    title: '黒鉄（くろがね）レン / Kurogane',
    quotes: [
      'このコード、今すぐリファクタしろ',
      '責務が曖昧。お前が書いたのか？',
      'その程度の抽象化で通ると思うな',
    ],
    image: '/images/kurogane.png',
  },
];
