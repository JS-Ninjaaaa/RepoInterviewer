import React from 'react';
import { Box, Backdrop, CircularProgress, Typography } from '@mui/material';

export const LoadingOverlay: React.FC<{ open: boolean; message: string }> = ({ open, message }) => (
  <Backdrop
    open={open}
    sx={{
      zIndex: theme => theme.zIndex.drawer + 1,
      color: '#fff',
      flexDirection: 'column',
      p: 2,
    }}
  >
    <CircularProgress color="inherit" />
    {message && (
      <Box mt={2}>
        <Typography variant="h6">{message}</Typography>
      </Box>
    )}
  </Backdrop>
);