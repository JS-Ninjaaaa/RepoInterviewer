import { Box } from "@mui/material";
import ScoreDisplay from "./ScoreDisplay";
import type { Character } from "@/types/character";

interface Props {
  currentCharacter: Character;
  scores: number[];
}

const ScoreAndCharacter = ({ currentCharacter, scores }: Props) => (
  <Box
    sx={{
      display: "flex",
      gap: 2,
      width: "90%",
      justifyContent: "space-between",
      alignItems: "flex-start",
      mt: 3,
    }}
  >
    <ScoreDisplay scores={scores} currentCharacter={currentCharacter} />

    <img
      src={currentCharacter.wholeImage}
      height={260}
      style={{ objectFit: "contain" }}
    />
  </Box>
);

export default ScoreAndCharacter;
