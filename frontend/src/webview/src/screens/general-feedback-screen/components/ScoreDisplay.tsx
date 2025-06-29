import { Box, Typography } from "@mui/material";
import { Character } from "@/types/character";

interface ScoreDisplayProps {
  currentCharacter: Character;
  scores: number[];
}

const ScoreDisplay = ({ currentCharacter, scores }: ScoreDisplayProps) => {
  const questions = Array.from(
    { length: currentCharacter.totalQuestion },
    (_, i) => scores[i] ?? 0
  );

  const totalScore = questions.reduce((a, b) => a + b, 0);
  const maxPerQuestion = 100 / currentCharacter.totalQuestion;

  return (
    <Box sx={{ width: "60%" }}>
      {scores.map((s, i) => {
        const percent = Math.min(100, Math.max(0, (s / maxPerQuestion) * 100));

        return (
          <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={{ width: 40, color: "#fff", fontSize: 14 }}>
              {`Q.${i + 1}`}
            </Typography>

            {/* ===== バー部分 ===== */}
            <Box
              sx={{
                position: "relative",
                flexGrow: 1,
                height: 4,
                borderRadius: 4,
                background: (theme) => theme.gradients.primary, // ← 全面にグラデーション
                overflow: "hidden",
                mr: 1,
              }}
            >
              {/* 未達成部分を上からグレーで隠す */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${percent}%`,
                  right: 0,
                  bgcolor: "#24304b", // スクリーンショットの薄いネイビー
                }}
              />
            </Box>

            <Typography sx={{ width: 24, color: "#fff", fontSize: 14 }}>
              {s}
            </Typography>
          </Box>
        );
      })}

      {/* ── TOTAL SCORE ── */}
      <Typography
        sx={{
          mt: 2,
          fontSize: 16,
          fontWeight: "bold",
          color: "#fff",
        }}
      >
        TOTAL&nbsp;SCORE&nbsp;&nbsp;
        <span style={{ fontSize: 20 }}>{totalScore}</span>
        /100
      </Typography>
    </Box>
  );
};

export default ScoreDisplay;
