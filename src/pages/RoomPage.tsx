import { Box, Chip, Container, IconButton, Paper, Stack } from "@mui/material";
import {
  selectIsConnectedToRoom,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectPeers,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Peer from "../components/Peer";

import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import LogoutIcon from "@mui/icons-material/Logout";

export default function RoomPage() {
  const hmsActions = useHMSActions();

  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const audioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const videoEnabled = useHMSStore(selectIsLocalVideoEnabled);

  const peers = useHMSStore(selectPeers);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  }, [isConnected]);

  const handleExitRoom = () => {
    hmsActions.leave();
  };

  const handleToggleAudio = () => {
    hmsActions.setLocalAudioEnabled(!audioEnabled);
  };

  const handleToggleVideo = () => {
    hmsActions.setLocalVideoEnabled(!videoEnabled);
  };

  return (
    <Container sx={{ height: "100%", paddingTop: "1rem" }}>
      <Stack spacing={2}>
        <Chip variant="outlined" label="Connected" color="success" />
        <Paper>
          <Stack direction="row">
            <IconButton aria-label="mute" onClick={handleToggleAudio}>
              {audioEnabled ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
            <IconButton aria-label="video toggle" onClick={handleToggleVideo}>
              {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton
              aria-label="leave room"
              onClick={handleExitRoom}
              color="error"
              sx={{ marginLeft: "auto" }}
            >
              <LogoutIcon />
            </IconButton>
          </Stack>
        </Paper>

        <Stack display={"flex"} height={"80vh"} spacing={2}>
          {peers.map((peer) => {
            if (peer.isLocal) {
              return <Peer key={peer.id} peer={peer} />;
            }
          })}
          <Box sx={{ maxHeight: "100%" }} overflow={"scroll"}>
            <Stack overflow={"scroll"} spacing={2}>
              {peers.map((peer) => {
                if (!peer.isLocal) {
                  return <Peer key={peer.id} peer={peer} />;
                }
              })}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}
