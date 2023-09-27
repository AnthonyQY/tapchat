import { Stack, Typography } from "@mui/material";

export default function ChatMessage({
  message,
  showName,
}: {
  message: any;
  showName: boolean;
}) {
  return (
    <Stack paddingLeft={"1rem"}>
      {showName ? (
        <Typography
          variant="subtitle2"
          color={message.senderName == "You" ? "#3498db" : "#ffd700"}
        >
          {message.senderName}
        </Typography>
      ) : null}
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
