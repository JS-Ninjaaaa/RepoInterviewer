
import { Box, Typography } from "@mui/material";
import { Character } from "@/types/character";

interface ScoreDisplayProps {
  currentCharacter: Character;
  scores: number[];
}

const ScoreDisplay = ({ currentCharacter, scores }: ScoreDisplayProps) => {
  const maxScorePerQuestion = 100 / currentCharacter.totalQuestion;

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: 46,
          fontWeight: "bold",
          color: (theme) => theme.palette.text.primary,
          width: "100%",
          textAlign: "center",
          mb: "4px"
        }}
      >
        RESULT
      </Typography>
      <Box
        sx={{
          width: "100%",
          borderTop: (theme) => `1px solid ${theme.palette.text.primary}`,
          mb: 1
        }}
      />
      {scores.map((score, i) => {
        const percent = Math.min(
          100,
          Math.max(0, (score / maxScorePerQuestion) * 100)
        );

        return (
          <Box key={i} sx={{ display: "flex", alignItems: "center", my: "4px" }}>
            <Typography
              sx={{
                color: (theme) => theme.palette.text.primary,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {`Q.${i + 1}`}
            </Typography>

            <Box
              sx={{
                position: "relative",
                flexGrow: 1,
                height: 4,
                borderRadius : 4,
                background: (theme) => theme.gradients.primary,
                overflow: "hidden",
                mx: 1,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${percent}%`,
                  right: 0,
                  bgcolor: (theme) => theme.palette.grey[300],
                }}
              />
            </Box>

            <Typography
              sx={{
                color: (theme) => theme.palette.text.primary,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {score}
            </Typography>
          </Box>
        );
      })}

      <Box
        sx={{
          width: "100%",
          borderBottom: (theme) => `1px solid ${theme.palette.text.primary}`,
          mt: 1
        }}
      />
    </Box>
  );
};

export default ScoreDisplay;
