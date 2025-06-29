import { Box, Typography } from "@mui/material";

interface Props {
  generalReview: string;
}

const FeedbackBox = ({ generalReview }: Props) => {
  return (
    <Box
      sx={{
        width: "90%",
        maxWidth: 500,
        minHeight: 220,
        maxHeight: "60vw",
        bgcolor: (theme) => theme.palette.background.nav,
        borderRadius: 2,
        p: 2,
        mt: 2,
        mb: 3,
        overflowY: "auto",
        color: (theme) => theme.palette.text.primary,
        fontSize: 14,
        lineHeight: 1.6,
      }}
    >
      <Typography sx={{ whiteSpace: "pre-wrap" }}>{generalReview}</Typography>
    </Box>
  );
};

export default FeedbackBox;
