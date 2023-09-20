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
import ChatWidget from "../components/ChatWidget";

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
        /**showSnack(
          `${notification.data.message} received from ${notification.data.senderName}`,
          "info"
        );**/
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
        <Stack spacing={2} height={"80vh"}>
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
            <Stack
              flex={1}
              height={isDesktop ? "80vh" : "80vh"}
              maxHeight={"80vh"}
              spacing={1}
              direction={peers.length > 1 ? "column" : "row"}
              display={"flex"}
            >
              <Stack flex={2}>
                {peers.map((peer) => {
                  if (peer.isLocal) {
                    return <Peer key={peer.id} peer={peer} />;
                  }
                })}
              </Stack>
              <Box flex={0.8}>{isDesktop ? <ChatWidget /> : null}</Box>
            </Stack>

            <Box
              sx={{ maxHeight: "100%" }}
              overflow={"scroll"}
              margin={peers.length > 1 ? "1rem" : "0 !important"}
              flex={peers.length > 1 ? 2 : 0}
            >
              <Stack>
                <Stack overflow={"scroll"} spacing={2}>
                  {peers.map((peer) => {
                    if (!peer.isLocal) {
                      return <Peer key={peer.id} peer={peer} />;
                    }
                  })}
                </Stack>
              </Stack>
            </Box>

            {isDesktop ? null : <ChatWidget />}
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
