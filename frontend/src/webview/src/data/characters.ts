import { amber, lightGreen, blue, deepPurple } from "@mui/material/colors";
import { Character } from "@/types/character";
import type { ImageUri } from "@shared/uri";

export function createCharacters(imageUris: ImageUri): Character[] {
  return [
    {
      level: "easy",
      name: "Yuzu",
      title: "やさしいギャル",
      questionType: "Q&A",
      totalQuestion: 5,
      quotes: ["マジすごいじゃん〜！えらい！", "ちょっとだけ直せば完璧っしょ☆"],
      image: imageUris.yuzu,
      wholeImage: imageUris.wholeYuzu,
      color: amber,
    },
    {
      level: "normal",
      name: "Haru",
      title: "先輩エンジニア",
      questionType: "Q&A",
      totalQuestion: 5,
      quotes: ["この責務分離、もう一歩かな", "設計思想としては筋が通ってる"],
      image: imageUris.haru,
      wholeImage: imageUris.wholeHaru,
      color: lightGreen,
    },
    {
      level: "hard",
      name: "Saki",
      title: "辛口メンター",
      questionType: "deeper",
      totalQuestion: 2,
      quotes: ["このコード、保守性ゼロ", "それ、Goの文法理解してる？"],
      image: imageUris.saki,
      wholeImage: imageUris.wholeSaki,
      color: blue,
    },
    {
      level: "extreme",
      name: "Ren",
      title: "超冷徹なPM",
      questionType: "deeper",
      totalQuestion: 2,
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
