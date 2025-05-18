// import { useLocation } from 'react-router-dom';
// import { useState } from 'react';
// import { Box, Typography, Avatar, IconButton, Button, ThemeProvider, Paper } from '@mui/material';


// const AnswerScreen = () => {
//   const location = useLocation();
//   const { mensetsu_id, question } = location.state;

//   const [chatHistory, setChatHistory] = useState<string[]> ([]);

//   const judgeSender = () => {
//     const turn = chatHistory.length % 2;
//     let sender = ""
//     if (turn === 0) {
//       sender = "user"
//     } else {
//       sender = 'ai'
//     }
//     return sender
//   }

//   return (
//     <div>
//       <Box>
//         <Paper>

//         </Paper>
//       </Box>
//     </div>
//   )
// }

// export default AnswerScreen