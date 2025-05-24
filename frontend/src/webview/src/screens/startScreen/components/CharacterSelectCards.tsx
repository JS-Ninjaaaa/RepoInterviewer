import { Box, Typography, Avatar, IconButton } from "@mui/material";
import { characters } from "../../../data/characters";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

interface Props {
  selectingCharacter: {
    characterIndex: number;
    setCharacterIndex: React.Dispatch<React.SetStateAction<number>>;
  };
}

const CharacterSelectCards = ({
  selectingCharacter: { characterIndex, setCharacterIndex },
}: Props) => {
  const currentCharacter = characters[characterIndex];

  const handleNextCharacter = () => {
    setCharacterIndex((prev) => (prev + 1) % characters.length);
  };

  const handlePrevCharacter = () => {
    setCharacterIndex(
      (prev) => (prev - 1 + characters.length) % characters.length,
    );
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "90%",
        mb: "100px",
      }}
    >
      <IconButton
        onClick={handlePrevCharacter}
        sx={{
          mt: "60px",
          mx: 1,
          bgcolor: "white",
          borderRadius: 5,
          width: "20px",
          height: "42px",
          boxShadow: 1,
          "&:hover": {
            background: "#e0e0e0",
          },
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: "18px", fontWeight: "bold" }} />
      </IconButton>

      <Box
        sx={{
          p: 4,
          borderRadius: 1,
          width: "90%",
          minWidth: "180px",
          maxWidth: "320px",
          maxHeight: "320px",
          backgroundColor: "white",
          boxShadow: 3,
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          mt: "60px",
        }}
      >
        <Box sx={{ alignItems: "center", display: "inline-flex" }}>
          <Avatar
            src={currentCharacter.image}
            alt={currentCharacter.name}
            sx={{ width: 84, height: 84, mr: 3 }}
          />
          <Box sx={{ ml: 4 }}>
            <Typography variant="subtitle1" sx={{ fontSize: 32, mb: 0 }}>
              {currentCharacter.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: currentCharacter.color[900], fontWeight: "bold" }}
            >
              {currentCharacter.level}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            backgroundColor: currentCharacter.color[200],
            my: 2,
            fontWeight: 700,
          }}
        >
          {currentCharacter.title}
        </Typography>

        {currentCharacter.quotes.map((q, i) => (
          <Typography
            key={i}
            variant="caption"
            display="block"
            sx={{ fontSize: "14px" }}
          >
            「{q}」
          </Typography>
        ))}
      </Box>

      <IconButton
        onClick={handleNextCharacter}
        sx={{
          mt: "60px",
          mx: 1,
          bgcolor: "white",
          borderRadius: 5,
          width: "20px",
          height: "42px",
          boxShadow: 1,
          "&:hover": {
            background: "#e0e0e0",
          },
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: "18px", fontWeight: "bold" }} />
      </IconButton>
    </Box>
  );
};

export default CharacterSelectCards;
