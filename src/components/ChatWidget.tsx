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
import { useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function ChatWidget() {
  const hmsActions = useHMSActions();
  const allMessages = useHMSStore(selectHMSMessages);
  const [message, setMessage] = useState<any>("");
  const isDesktop = useMediaQuery("(min-width: 800px)");
  const chatBottomRef = useRef<null | HTMLDivElement>(null);
  let lastSenderName: String = "";

  const handleSendMessage = () => {
    hmsActions.sendBroadcastMessage(message);
    setMessage("");
    scrollChatBottom();
  };

  const scrollChatBottom = () => {
    chatBottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box padding={"5px"}>
      <Paper sx={{ height: isDesktop ? "48vh" : "25vh", maxWidth: "25rem" }}>
        <Stack height={"inherit"} spacing={1}>
          <Stack
            paddingLeft={"1rem"}
            paddingTop={"0.5rem"}
            direction={"row"}
            alignItems={"center"}
          >
            <Typography variant="h6">Chat</Typography>
            <IconButton
              aria-label="scroll to bottom"
              onClick={scrollChatBottom}
              sx={{
                marginLeft: "auto",
              }}
            >
              <ArrowDownwardIcon />
            </IconButton>
          </Stack>

          <Divider />
          <Stack
            overflow={"scroll"}
            paddingBottom={"1rem"}
            paddingRight={"0.5rem"}
          >
            {allMessages.map((x) => {
              let showName = !(x?.senderName === lastSenderName);
              lastSenderName = x?.senderName || "";
              return <ChatMessage message={x} showName={showName} />;
            })}
            <Box ref={chatBottomRef} />
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
