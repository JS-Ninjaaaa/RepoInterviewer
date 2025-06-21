import { Box, Stack, Typography, styled } from "@mui/material";
import MemoryIcon from "@mui/icons-material/Memory";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const IconWrapper = styled(Box)({
  width: 56,
  height: 56,
  borderRadius: 12,
  backgroundColor: "hsla(53, 100%, 51.4%, 0.17)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  mb: 1,
});

const items = [
  { label: "Smart AI", Icon: MemoryIcon, color: "#00e676" },
  { label: "Points", Icon: EmojiEventsIcon, color: "#ffd600" },
  { label: "Interactive", Icon: ChatBubbleOutlineIcon, color: "#1e88e5" },
];

const FeatureGrid = () => (
  <Stack direction="row" spacing={6} justifyContent="center" mb={4}>
    {items.map(({ label, Icon, color }) => (
      <Box key={label} textAlign="center">
        <IconWrapper>
          <Icon sx={{ color, fontSize: 28 }} />
        </IconWrapper>
        <Typography variant="body2">{label}</Typography>
      </Box>
    ))}
  </Stack>
);

export default FeatureGrid;
