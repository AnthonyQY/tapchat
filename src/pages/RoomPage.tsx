// @ts-nocheck
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
  selectIsLocalScreenShared,
  selectIsLocalVideoEnabled,
  selectPeers,
  useHMSActions,
  useHMSNotifications,
  useHMSStore,
} from "@100mslive/react-sdk";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Peer from "../components/Peer";

import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSnackbar } from "notistack";
import ChatWidget from "../components/ChatWidget";

import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

import useSound from "use-sound";
import startSfx from "../sounds/start.wav";
import backSfx from "../sounds/back.wav";

import openSfx from "../sounds/open.mp3";
import closeSfx from "../sounds/close.mp3";
import messagePopSfx from "../sounds/messagePop.mp3";

export default function RoomPage() {
  const hmsActions = useHMSActions();

  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const audioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const videoEnabled = useHMSStore(selectIsLocalVideoEnabled);
  const screenshareEnabled = useHMSStore(selectIsLocalScreenShared);

  const peers = useHMSStore(selectPeers);

  const navigate = useNavigate();

  const isDesktop = useMediaQuery("(min-width: 800px)");

  const [videoPref, setVideoPref] = useState<boolean>(true);

  const { enqueueSnackbar } = useSnackbar();

  const [playStart] = useSound(startSfx);
  const [playBack] = useSound(backSfx);
  const [playMsgPop] = useSound(messagePopSfx);
  const [playOpen] = useSound(openSfx);
  const [playClose] = useSound(closeSfx);

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
    if (audioEnabled) {
      playClose();
    } else {
      playOpen();
    }
  };

  const handleToggleVideo = async () => {
    if (screenshareEnabled && !videoEnabled) {
      showSnack("Error: Cannot enable video during screen share", "error");
    } else {
      if (videoEnabled) {
        playClose();
      } else {
        playOpen();
      }
      await hmsActions.setLocalVideoEnabled(!videoEnabled);
      setVideoPref(!videoEnabled);
    }
  };

  const handleShareScreen = async () => {
    await hmsActions.setScreenShareEnabled(!screenshareEnabled);
  };

  const showSnack = (message: string, variant: any) => {
    enqueueSnackbar(message, { variant: variant });
  };

  useEffect(() => {
    const checkScreenshare = async () => {
      if (screenshareEnabled) {
        await hmsActions.setLocalVideoEnabled(false);
      } else if (!screenshareEnabled && videoPref) {
        await hmsActions.setLocalVideoEnabled(true);
      } else if (screenshareEnabled && videoEnabled) {
        await hmsActions.setLocalVideoEnabled(false);
      }
    };
    checkScreenshare();
  }, [screenshareEnabled]);

  // Notification event handler
  const notification = useHMSNotifications();
  useEffect(() => {
    if (!notification) {
      return;
    }

    switch (notification.type) {
      case HMSNotificationTypes.PEER_JOINED:
        showSnack(`${notification.data.name} joined`, "success");
        playStart();
        break;
      case HMSNotificationTypes.PEER_LEFT:
        showSnack(`${notification.data.name} left`, "error");
        playBack();
        break;
      case HMSNotificationTypes.NEW_MESSAGE:
        playMsgPop();
        break;
      case HMSNotificationTypes.ERROR:
        showSnack(`Error code: ${notification.data.code}`, "error");
        playBack();
        break;
      case HMSNotificationTypes.RECONNECTING:
        showSnack("Reconnecting to room", "warning");
        playBack();
        break;
      case HMSNotificationTypes.RECONNECTED:
        showSnack(`Reconnected successfully`, "success");
        playStart();
        break;
      case HMSNotificationTypes.ROOM_ENDED:
        showSnack(`Room ended: ${notification.data.reason}`, "error");
        playBack();
        break;
      case HMSNotificationTypes.REMOVED_FROM_ROOM:
        showSnack(`Removed from room: ${notification.data.reason}`, "error");
        playBack();
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
                aria-label="screen share"
                onClick={handleShareScreen}
                color={screenshareEnabled ? "error" : "default"}
              >
                {screenshareEnabled ? (
                  <CancelPresentationIcon />
                ) : (
                  <PresentToAllIcon />
                )}
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
              maxHeight={isDesktop ? "80vh" : "30vh"}
              spacing={1}
              direction={peers.length > 1 ? "column" : "row"}
              display={isDesktop ? "flex" : "block"}
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
