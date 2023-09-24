// @ts-nocheck
import {
  useHMSStore,
  selectHMSMessages,
  useHMSActions,
} from "@100mslive/react-sdk";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ChatMessage from "./ChatMessage";
import { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";

import useSound from "use-sound";
import messagePopSfx from "../sounds/messagePop.mp3";

export default function ChatWidget() {
  const hmsActions = useHMSActions();
  const allMessages = useHMSStore(selectHMSMessages);
  const [message, setMessage] = useState<any>("");
  const isDesktop = useMediaQuery("(min-width: 800px)");

  const handleSendMessage = () => {
    hmsActions.sendBroadcastMessage(message);
    setMessage("");
  };

  const [playMsgPop] = useSound(messagePopSfx);
  useEffect(() => {
    playMsgPop();
  }, [allMessages]);

  return (
    <Box padding={"5px"}>
      <Paper sx={{ height: isDesktop ? "53vh" : "25vh", maxWidth: "25rem" }}>
        <Stack height={"inherit"} spacing={1}>
          <Box paddingLeft={"1rem"} paddingTop={"0.5rem"}>
            <Typography variant="h6">Chat</Typography>
          </Box>

          <Divider />
          <Stack
            overflow={"scroll"}
            paddingBottom={"1rem"}
            paddingRight={"0.5rem"}
          >
            {allMessages.map((x) => (
              <ChatMessage message={x} />
            ))}
          </Stack>
          <Stack direction={"row"} marginTop={"auto !important"} width={"100%"}>
            <TextField
              label="Message"
              placeholder="Your message"
              fullWidth
              onChange={(e: any) => setMessage(e.target.value)}
              value={message}
              variant="filled"
              onKeyDown={(e: any) => {
                if (e.key == "Enter") {
                  handleSendMessage();
                }
              }}
              InputProps={{
                sx: { borderRadius: 0 },
                endAdornment: (
                  <IconButton
                    aria-label="send message"
                    onClick={handleSendMessage}
                    color="primary"
                    sx={{ padding: "1rem" }}
                  >
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
