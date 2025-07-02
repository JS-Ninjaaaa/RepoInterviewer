import { Box, Stack, Typography, styled } from "@mui/material";
import MemoryIcon from "@mui/icons-material/Memory";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const IconWrapper = styled(Box)({
  width: "64px",
  height: "64px",
  borderRadius: 12,
  backgroundColor: "hsla(53, 100%, 51.4%, 0.17)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const items = [
  { label: "Smart AI", Icon: MemoryIcon, color: "#00e676" },
  { label: "Score", Icon: EmojiEventsIcon, color: "#ffd600" },
  { label: "Interactive", Icon: ChatBubbleOutlineIcon, color: "#1e88e5" },
];

const FeatureGrid = () => (
  <Stack
    sx={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      mb: 4,
      gap: 6,
    }}
  >
    {items.map(({ label, Icon, color }) => (
      <Box
        key={label}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          mt: 2,
          gap: 1,
        }}
      >
        <IconWrapper>
          <Icon sx={{ color, fontSize: 28 }} />
        </IconWrapper>
        <Typography
          sx={{
            fontSize: "16px",
          }}
        >
          {label}
        </Typography>
      </Box>
    ))}
  </Stack>
);

export default FeatureGrid;
