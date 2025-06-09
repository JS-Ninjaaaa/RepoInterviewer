import { Box, Typography } from "@mui/material";
import { Character } from "@/types/character";

interface ScoreDisplayProps {
  currentCharacter: Character;
  scores: number[];
}

const ScoreDisplay = ({ currentCharacter, scores }: ScoreDisplayProps) => {
  let totalScore: number = 0;
  for (let i = 0; i < scores.length; i++) {
    totalScore += scores[i];
  }

  return (
    <>
      <Typography
        sx={{
          fontSize: "28px",
          fontWeight: "bold",
          mt: "16%",
        }}
      >
        最終結果
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          color: currentCharacter.color[700],
          p: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: 76,
            lineHeight: 1,
          }}
        >
          {totalScore}
        </Typography>

        <Typography
          sx={{
            fontSize: "32px",
          }}
        >
          点
        </Typography>
      </Box>

      <Box
        sx={{
          mb: 2,
        }}
      >
        <Typography
          sx={{
            color: currentCharacter.color[700],
          }}
        >
          {scores.join(" / ")}
        </Typography>
      </Box>
    </>
  );
};

export default ScoreDisplay;
