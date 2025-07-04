import type { Color } from "@mui/material";

export interface Character {
  level: "easy" | "normal" | "hard" | "extreme";
  name: string;
  title: string;
  questionType: string;
  totalQuestion: number;
  quotes: string[];
  image: string;
  halfImage: string;
  wholeImage: string;
  color: Color;
  lightBackground: string;
  darkBackground: string;
}
