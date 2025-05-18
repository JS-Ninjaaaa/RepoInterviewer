import { yellow, lightGreen, blue, deepPurple } from '@mui/material/colors'

export interface Character {
  level: '初級' | '中級' | '上級' | '激詰め';
  questionnum: number;
  name: string;
  text: string;
  title: string;
  quotes: string[];
  image: string;
  color: typeof yellow | typeof lightGreen | typeof blue | typeof deepPurple;
}