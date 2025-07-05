import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";

interface Props {
  generalReview: string;
}

const FeedbackBox = ({ generalReview }: Props) => {
  return (
    <Box
      sx={{
        width: "90%",
        maxWidth: 500,
        minHeight: 280,
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
      <ReactMarkdown>{generalReview}</ReactMarkdown>
    </Box>
  );
};

export default FeedbackBox;
