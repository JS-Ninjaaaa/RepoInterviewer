import type { Color } from "@mui/material";

export interface Character {
  level: "easy" | "normal" | "hard" | "extreme";
  totalQuestion: number;
  name: string;
  text: string;
  title: string;
  quotes: string[];
  image: string;
  wholeImage: string;
  color: Color;
}
