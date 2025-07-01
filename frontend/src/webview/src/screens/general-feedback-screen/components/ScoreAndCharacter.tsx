import { Box, Typography } from "@mui/material";
import ScoreDisplay from "./ScoreDisplay";
import type { Character } from "@/types/character";

interface Props {
  currentCharacter: Character;
  scores: number[];
}

const ScoreAndCharacter = ({ currentCharacter, scores }: Props) => {
  const totalScore = scores.reduce((sum, v) => sum + v, 0);

  return(
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%", 
    }}>
    <Box
      sx={{
        display: "flex",
        gap: 4,
        alignItems: "center",
        width: "90%", 
      }}
    >
      <ScoreDisplay scores={scores} currentCharacter={currentCharacter} />

      <Box
        component="img"
        src={currentCharacter.wholeImage}
        alt={`${currentCharacter.name} の全身イラスト`}
        sx={{
          maxHeight: 240,      // ここで縦をピタリと制限
          width: 'auto',       // 横はアスペクト比を保って自動調整
          objectFit: 'contain',// はみ出さずにフィット
        }}
      />

    </Box>
      <Typography
        sx={{
          fontSize: 24,
          fontWeight: "bold",
          color: (theme) => theme.palette.text.primary,
          whiteSpace: 'pre-wrap',
          m: 2
        }}
      >
        {`TOTAL SCORE  ${totalScore} / 100`}
      </Typography>
  </Box>
)};

export default ScoreAndCharacter;