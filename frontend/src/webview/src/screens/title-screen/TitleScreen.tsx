import { Box } from "@mui/material";
import { motion } from "framer-motion";

import TitleHeader from "@/screens/title-screen/components/TitleHeader";
import FeatureGrid from "@/screens/title-screen/components/FeatureGrid";
import TitleFooter from "@/screens/title-screen/components/TitleFooter";

const MotionBox = motion(Box);

const TitleScreen = () => {
  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      sx={{
        height: "100vh",
        backgroundColor: (theme) => theme.palette.background.default,
        color: (theme) => theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
        gap: 4,
        position: "absolute",
        left: 0,
        width: "100%",
      }}
    >
      <TitleHeader />
      <FeatureGrid />
      <TitleFooter />
    </MotionBox>
  );
};

export default TitleScreen;
