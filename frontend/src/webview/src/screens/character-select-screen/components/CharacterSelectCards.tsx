import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CheckIcon from "@mui/icons-material/Check";
import type { Character } from "@/types/character";

interface Props {
  currentCharacter: Character;
}

const CharacterSelectCards: React.FC<Props> = ({ currentCharacter }) => {
  const theme = useTheme();
  const textColor = theme.palette.text.primary;

  const levelToRating = {
    easy: 1,
    normal: 2,
    hard: 3,
    extreme: 4,
  } as const;

  const rating = levelToRating[currentCharacter.level];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: 600,
        width: 600,
        maxWidth: "80vw",
        borderRadius: 2,
        background: theme.gradients.secondary.main,
        p: 1.5,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0px 6px 16px rgba(255, 255, 255, 0.24)"
            : "0px 6px 16px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          borderRadius: 1,
          backgroundColor: (theme) => theme.palette.background.default,
          textAlign: "center",
          px: 2,
          height: "280px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: "32px",
              "@media (max-width:600px)": {
                fontSize: "28px",
              },
              "@media (max-width:500px)": {
                fontSize: "22px",
              },
              "@media (max-width:400px)": {
                fontSize: "16px",
              },
              fontWeight: "bold",
              color: textColor,
            }}
          >
            {currentCharacter.name}
          </Typography>
          <Box display="flex" alignItems="center">
            {Array.from({ length: 4 }).map((_, i) => (
              <StarIcon
                key={i}
                sx={{
                  fontSize: "32px",
                  "@media (max-width:600px)": {
                    fontSize: "28px",
                  },
                  "@media (max-width:500px)": {
                    fontSize: "22px",
                  },
                  "@media (max-width:450px)": {
                    fontSize: "16px",
                  },
                  color: i < rating ? "#FFD700" : "#B0B0B0",
                }}
              />
            ))}
          </Box>
        </Box>

        <Box
          component="img"
          src={currentCharacter.halfImage}
          alt={currentCharacter.name}
          sx={{
            display: "flex",
            objectFit: "contain",
            objectPosition: "50% 100%",
            borderRadius: 1,
            mt: 2,
            maxWidth: "70%",
            maxHeight: "100%",
          }}
        />
      </Box>
      <Typography sx={{ color: textColor, my: 3, fontSize: "18px" }}>
        {currentCharacter.title}
      </Typography>
      <Box
        sx={{
          width: "90%",
          borderRadius: 1,
          backgroundColor: (theme) => theme.palette.background.default,
          p: 2,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "16px",
            color: textColor,
            mb: 1,
          }}
        >
          口調
        </Typography>
        {currentCharacter.quotes.map((q, i) => (
          <Typography
            key={i}
            sx={{
              fontSize: "14px",
              "@media (max-width:400px)": {
                fontSize: "12px",
              },
            }}
          >
            「{q}」
          </Typography>
        ))}
      </Box>
      <Box
        sx={{
          width: "100%",
          borderRadius: 1,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "14px",
          color: textColor,
          m: 4,
          gap: 2,
        }}
      >
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          <CheckIcon sx={{ mr: 2, fontSize: "18px" }} />
          {currentCharacter.questionType}形式
        </Typography>
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          <CheckIcon sx={{ mr: 1, fontSize: "18px" }} />全
          {currentCharacter.totalQuestion.toLocaleString(
            "ja-JP-u-nu-fullwide",
            { useGrouping: false }
          )}
          問
        </Typography>
      </Box>
    </Box>
  );
};

export default CharacterSelectCards;
