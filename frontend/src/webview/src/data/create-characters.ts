import { Character } from "@/types/character";
import { amber, blue, deepPurple, lightGreen } from "@mui/material/colors";
import type { ImageUri } from "@shared/uri";

export function createCharacters(imageUris: ImageUri): Character[] {
  return [
    {
      level: "easy",
      name: "Yuzu",
      title: "やさしいギャル",
      questionType: "１問１答",
      totalQuestion: 1,
      quotes: ["マジすごいじゃん〜！えらい！", "ちょっとだけ直せば完璧っしょ☆"],
      image: imageUris.yuzu,
      halfImage: imageUris.halfYuzu,
      wholeImage: imageUris.wholeYuzu,
      color: amber,
      lightBackground: imageUris.lightBackground,
      darkBackground: imageUris.darkBackground,
    },
    {
      level: "normal",
      name: "Haru",
      title: "先輩エンジニア",
      questionType: "１問１答",
      totalQuestion: 5,
      quotes: ["この責務分離、もう一歩かな", "設計思想としては筋が通ってる"],
      image: imageUris.haru,
      halfImage: imageUris.halfHaru,
      wholeImage: imageUris.wholeHaru,
      color: lightGreen,
      lightBackground: imageUris.lightBackground,
      darkBackground: imageUris.darkBackground,
    },
    {
      level: "hard",
      name: "Saki",
      title: "辛口メンター",
      questionType: "深掘り",
      totalQuestion: 2,
      quotes: ["このコード、保守性ゼロ", "それ、Goの文法理解してる？"],
      image: imageUris.saki,
      halfImage: imageUris.halfSaki,
      wholeImage: imageUris.wholeSaki,
      color: blue,
      lightBackground: imageUris.lightBackground,
      darkBackground: imageUris.darkBackground,
    },
    {
      level: "extreme",
      name: "Ren",
      title: "超冷徹なPM",
      questionType: "深掘り",
      totalQuestion: 2,
      quotes: [
        "このコード、今すぐリファクタしろ",
        "その程度の抽象化で通ると思うな",
      ],
      image: imageUris.ren,
      halfImage: imageUris.halfRen,
      wholeImage: imageUris.wholeRen,
      color: deepPurple,
      lightBackground: imageUris.lightBackground,
      darkBackground: imageUris.darkBackground,
    },
  ];
}
