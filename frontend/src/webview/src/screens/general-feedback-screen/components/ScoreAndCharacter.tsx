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
      gap: 4,
      width: "90%",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <ScoreDisplay scores={scores} currentCharacter={currentCharacter} />

    <img
      src={currentCharacter.wholeImage}
      alt={currentCharacter.name + " の全身イラスト"}
      height={320}
      style={{ objectFit: "contain" }}
    />
  </Box>
);

export default ScoreAndCharacter;
