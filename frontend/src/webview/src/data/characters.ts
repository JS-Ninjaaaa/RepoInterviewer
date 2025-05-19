import { amber, lightGreen, blue, deepPurple } from '@mui/material/colors'
import { Character } from '../types/character';

import yuzuPng from '../assets/images/yuzu.png';
import haruPng from '../assets/images/haru.png';
import sakiPng from '../assets/images/saki.png';
import renPng  from '../assets/images/ren.png';

export const characters: Character[] = [
  {
    level: '初級',
    total_question: 5,
    name: 'ユズ',
    text: 'Yuzu',
    title: 'やさしいギャル',
    quotes: [
      'マジすごいじゃん〜！えらい！',
      'ちょっとだけ直せば完璧っしょ☆',
    ],
    image: yuzuPng,
    color: amber,
  },
  {
    level: '中級',
    total_question: 5,
    name: 'ハル',
    text: 'Haru',
    title: '先輩エンジニア',
    quotes: [
      'この責務分離、もう一歩かな',
      '設計思想としては筋が通ってる',
    ],
    image: haruPng,
    color: lightGreen,
  },
  {
    level: '上級',
    total_question: 2,
    name: 'サキ',
    text: 'Saki',
    title: '辛口メンター',
    quotes: [
      'このコード、保守性ゼロ',
      'それ、Goの文法理解してる？',
    ],
    image: sakiPng,
    color: blue,
  },
  {
    level: '激詰め',
    total_question: 2,
    name: '黒鉄レン',
    text: 'Ren',
    title: 'Kurogane',
    quotes: [
      'このコード、今すぐリファクタしろ',
      'その程度の抽象化で通ると思うな',
    ],
    image: renPng,
    color: deepPurple,
  },
];
