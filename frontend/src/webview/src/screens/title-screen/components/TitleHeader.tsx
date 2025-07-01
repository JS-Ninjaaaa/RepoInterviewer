import { Box, Typography, styled } from "@mui/material";

const GradientText = styled("span")(({ theme }) => ({
  background: theme.gradients.primary,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

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
          <Typography
            sx={{
              fontSize: "24px",
            }}
          >
            Interactive Coding Interview Practice
          </Typography>
          <Typography
            sx={{
              color: (theme) => theme.palette.primary.light,
              fontSize: "20px",
            }}
          >
            AI-powered interview based on your repository
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default TitleHeader;
