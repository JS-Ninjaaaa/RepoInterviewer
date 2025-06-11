import React from "react";
import { Typography } from "@mui/material";
import type { Character } from "@/types/character";

interface HeaderProps {
  currentCharacter: Character;
}

const Header: React.FC<HeaderProps> = ({ currentCharacter }) => {
  return (
    <Typography
      sx={{
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "42px",
        mt: 4,
        mb: 4,
        color: currentCharacter.color[700], // ここが確実に存在する
        textShadow: [
          "-2px -2px 0 #fff", // 左上に白枠
          " 2px -2px 0 #fff", // 右上に白枠
          "-2px  2px 0 #fff", // 左下に白枠
          " 2px  2px 0 #fff", // 右下に白枠
          " 4px  4px 0 rgba(0,0,0,0.15)", // 立体シャドウ
        ].join(","),
      }}
    >
      RepoInterviewer
    </Typography>
  );
};

export default Header;
