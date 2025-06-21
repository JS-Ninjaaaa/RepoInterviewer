import { Box, Typography, styled } from "@mui/material";
import { motion } from "framer-motion";
import CodeIcon from "@mui/icons-material/Code";

const GradientText = styled("span")({
  background: "linear-gradient(90deg, #00c853, #4f84f7, #772feb)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

const TitleHeader = () => {
  return (
    <>
      <Box textAlign="center" mb={4}>
        <Box
          component={motion.div}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4fc3f7, #00e676)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 1,
          }}
        >
          <CodeIcon sx={{ color: "#fff", fontSize: 32 }} />
        </Box>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            color: (theme) => theme.palette.text.primary,
            fontWeight: "bold",
          }}
        >
          <GradientText>Repo</GradientText> Interviewer
        </Typography>
        <Typography variant="subtitle1">
          Interactive Coding Interview Practice
        </Typography>
        <Typography variant="body2" color="grey.500">
          AI-powered questions based on your repository
        </Typography>
      </Box>
    </>
  );
};

export default TitleHeader;
