import { Box, Typography, styled } from "@mui/material";

const GradientText = styled("span")({
  background: "linear-gradient(90deg, #00c853, #4f84f7, #772feb)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

const TitleHeader = () => {
  return (
    <>
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            color: (theme) => theme.palette.text.primary,
            fontWeight: "bold",
            lineHeight: 1.1,
          }}
        >
          <GradientText>Repo</GradientText> Interviewer
        </Typography>
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1">
            Interactive Coding Interview Practice
          </Typography>
          <Typography variant="body2" color="grey.500">
            AI-powered questions based on your repository
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default TitleHeader;
