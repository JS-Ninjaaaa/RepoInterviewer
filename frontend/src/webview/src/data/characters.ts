import { amber, lightGreen, blue, deepPurple } from "@mui/material/colors";
import { Character } from "@/types/character";
import type { ImageUri } from "@shared/uri";

export function createCharacters(imageUris: ImageUri): Character[] {
  return [
    {
      level: "easy",
      totalQuestion: 5,
      name: "ユズ",
      text: "Yuzu",
      title: "やさしいギャル",
      quotes: ["マジすごいじゃん〜！えらい！", "ちょっとだけ直せば完璧っしょ☆"],
      image: imageUris.yuzu,
      wholeImage: imageUris.wholeYuzu,
      color: amber,
    },
    {
      level: "normal",
      totalQuestion: 5,
      name: "ハル",
      text: "Haru",
      title: "先輩エンジニア",
      quotes: ["この責務分離、もう一歩かな", "設計思想としては筋が通ってる"],
      image: imageUris.haru,
      wholeImage: imageUris.wholeHaru,
      color: lightGreen,
    },
    {
      level: "hard",
      totalQuestion: 2,
      name: "サキ",
      text: "Saki",
      title: "辛口メンター",
      quotes: ["このコード、保守性ゼロ", "それ、Goの文法理解してる？"],
      image: imageUris.saki,
      wholeImage: imageUris.wholeSaki,
      color: blue,
    },
    {
      level: "extreme",
      totalQuestion: 2,
      name: "黒鉄レン",
      text: "Ren",
      title: "超冷徹なPM",
      quotes: [
        "このコード、今すぐリファクタしろ",
        "その程度の抽象化で通ると思うな",
      ],
      image: imageUris.ren,
      wholeImage: imageUris.wholeRen,
      color: deepPurple,
    },
  ];
}
