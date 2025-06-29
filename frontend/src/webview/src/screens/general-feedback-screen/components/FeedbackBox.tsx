import { Box, Typography, useTheme } from "@mui/material";

interface Props {
  generalReview: string;
}

const FeedbackBox = ({ generalReview }: Props) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "90%",
        maxWidth: 500,
        minHeight: 220,
        bgcolor: theme.palette.primary.main,
        border: `1px solid ${theme.palette.shadowColor}`,
        borderRadius: 2,
        p: 2,
        mt: 2,
        mb: 3,
        overflowY: "auto",
        color: "#fff",
        fontSize: 14,
        lineHeight: 1.6,
      }}
    >
      <Typography sx={{ whiteSpace: "pre-wrap" }}>{generalReview}</Typography>
    </Box>
  );
};

export default FeedbackBox;
