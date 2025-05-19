import type { Color } from '@mui/material';

export interface Character {
  level: '初級' | '中級' | '上級' | '激詰め';
  question_id: number;
  name: string;
  text: string;
  title: string;
  quotes: string[];
  image: string;
  color: Color;
}