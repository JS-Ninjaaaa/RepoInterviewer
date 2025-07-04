import FeedbackIcon from "@mui/icons-material/Feedback";
import { Box, Typography } from "@mui/material";

const SurveyFormLink = () => {
  return (
    <Box
      component="a"
      href="https://docs.google.com/forms/d/e/1FAIpQLScc-i6Vj6gm778Vi9ZJIhOJ5--_5yaaLr9X4yDgL4NbsxO-mw/viewform"
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.2,
        textDecoration: "none", // リンクの下線を消す
        bgcolor: (theme) => theme.palette.primary.main,
        color: (theme) => theme.palette.primary.contrastText,
        px: 2.5,
        py: 1.2,
        borderRadius: 2,
        fontWeight: 700,
        fontSize: "1.1rem",
        boxShadow: 2,
        mb: 3,
        transition: "background 0.2s, box-shadow 0.2s",
        "&:hover": {
          bgcolor: (theme) => theme.palette.primary.dark,
          boxShadow: 4,
          textDecoration: "none",
        },
      }}
    >
      <FeedbackIcon
        sx={{
          fontSize: 24,
          color: (theme) => theme.palette.primary.contrastText,
        }}
      />
      <Typography
        variant="body1"
        sx={{
          fontWeight: 700,
          color: (theme) => theme.palette.primary.contrastText,
        }}
      >
        アンケートにご協力ください
      </Typography>
    </Box>
  );
};

export default SurveyFormLink;
