import { useVideo } from "@100mslive/react-sdk";
import { Box, Paper, Stack, Typography } from "@mui/material";

function Peer({ peer }: { peer: any }) {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack,
  });
  return (
    <Paper
      sx={{
        borderTopLeftRadius: "0.5rem",
        borderTopRightRadius: "0.5rem",
      }}
    >
      <Stack>
        <Box sx={{ width: "100%", height: "100%" }}>
          <video
            ref={videoRef}
            className={`peer-video ${peer.isLocal ? "local" : ""}`}
            style={{
              width: "inherit",
              borderTopLeftRadius: "0.5rem",
              borderTopRightRadius: "0.5rem",
              height: "inherit",
            }}
            autoPlay
            muted
            playsInline
          />
        </Box>
        <Typography variant="subtitle1" marginLeft={"1rem"}>
          {peer.name} {peer.isLocal ? "(You)" : ""}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default Peer;
