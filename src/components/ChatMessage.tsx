import { Stack, Typography } from "@mui/material";

export default function ChatMessage({ message }: { message: any }) {
  return (
    <Stack paddingLeft={"1rem"}>
      <Typography
        variant="subtitle2"
        color={message.senderName == "You" ? "#3498db" : "default"}
      >
        {message.senderName}
      </Typography>
      <Typography
        variant="body1"
        color={"#cccccc"}
        sx={{ wordWrap: "break-word" }}
      >
        {message.message}
      </Typography>
    </Stack>
  );
}
