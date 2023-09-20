import {
  Box,
  Chip,
  Container,
  IconButton,
  Paper,
  Stack,
  useMediaQuery,
} from "@mui/material";
import {
  HMSNotificationTypes,
  selectIsConnectedToRoom,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectPeers,
  useHMSActions,
  useHMSNotifications,
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
import { useSnackbar } from "notistack";

export default function RoomPage() {
  const hmsActions = useHMSActions();

  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const audioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const videoEnabled = useHMSStore(selectIsLocalVideoEnabled);

  const peers = useHMSStore(selectPeers);

  const navigate = useNavigate();

  const isDesktop = useMediaQuery("(min-width: 800px)");

  const { enqueueSnackbar } = useSnackbar();

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

  const showSnack = (message: string, variant: any) => {
    enqueueSnackbar(message, { variant: variant });
  };

  // Notification event handler
  const notification = useHMSNotifications();
  useEffect(() => {
    if (!notification) {
      return;
    }

    switch (notification.type) {
      case HMSNotificationTypes.PEER_JOINED:
        showSnack(`${notification.data.name} joined`, "success");
        break;
      case HMSNotificationTypes.PEER_LEFT:
        showSnack(`${notification.data.name} left`, "error");
        break;
      case HMSNotificationTypes.NEW_MESSAGE:
        showSnack(
          `${notification.data.message} received from ${notification.data.senderName}`,
          "info"
        );
        break;
      case HMSNotificationTypes.ERROR:
        showSnack(`Error code: ${notification.data.code}`, "error");
        break;
      case HMSNotificationTypes.RECONNECTING:
        showSnack("Reconnecting to room", "warning");
        break;
      case HMSNotificationTypes.RECONNECTED:
        showSnack(`Reconnected successfully`, "success");
        break;
      case HMSNotificationTypes.ROOM_ENDED:
        showSnack(`Room ended: ${notification.data.reason}`, "error");
        break;
      case HMSNotificationTypes.REMOVED_FROM_ROOM:
        showSnack(`Removed from room: ${notification.data.reason}`, "error");
        break;
      default:
        break;
    }
  }, [notification]);

  return (
    <>
      <Container sx={{ height: "100%", paddingTop: "1rem" }}>
        <Stack spacing={2}>
          <Chip variant="outlined" label="Connected" color="success" />
          <Paper>
            <Stack direction="row">
              <IconButton
                aria-label="mute"
                onClick={handleToggleAudio}
                color={audioEnabled ? "default" : "error"}
              >
                {audioEnabled ? <MicIcon /> : <MicOffIcon />}
              </IconButton>
              <IconButton
                aria-label="video toggle"
                onClick={handleToggleVideo}
                color={videoEnabled ? "default" : "error"}
              >
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

          <Stack
            display={"flex"}
            height={"80vh"}
            direction={isDesktop ? "row" : "column"}
            spacing={2}
          >
            <Box flex={1}>
              {peers.map((peer) => {
                if (peer.isLocal) {
                  return <Peer key={peer.id} peer={peer} />;
                }
              })}
            </Box>

            <Box
              sx={{ maxHeight: "100%" }}
              overflow={"scroll"}
              margin={peers.length > 1 ? "1rem" : "0 !important"}
              flex={peers.length > 1 ? 2 : 0}
            >
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
    </>
  );
}
