import {
  selectConnectionQualityByPeerID,
  selectIsPeerAudioEnabled,
  selectIsPeerVideoEnabled,
  selectPeerAudioByID,
  selectScreenShareByPeerID,
  useHMSActions,
  useHMSStore,
  useVideo,
} from "@100mslive/react-sdk";
import { Box, Paper, Stack, Typography, useMediaQuery } from "@mui/material";

import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import SignalCellularAlt2BarIcon from "@mui/icons-material/SignalCellularAlt2Bar";
import SignalCellularAlt1BarIcon from "@mui/icons-material/SignalCellularAlt1Bar";
import SignalCellularConnectedNoInternet0BarIcon from "@mui/icons-material/SignalCellularConnectedNoInternet0Bar";
import SignalCellular0BarIcon from "@mui/icons-material/SignalCellular0Bar";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

function Peer({ peer }: { peer: any }) {
  const isDesktop = useMediaQuery("(min-width: 800px)");
  const downlinkQuality = useHMSStore(
    selectConnectionQualityByPeerID(peer.id)
  )?.downlinkQuality;

  const peerAudioLevel = useHMSStore(selectPeerAudioByID(peer.id));
  const audioOn = useHMSStore(selectIsPeerAudioEnabled(peer.id));
  const videoOn = useHMSStore(selectIsPeerVideoEnabled(peer.id));

  const screenshareVideoTrack = useHMSStore(selectScreenShareByPeerID(peer.id));

  const { videoRef } = useVideo({ trackId: peer.videoTrack });
  const screenVideoRef = useRef(null);

  const hmsActions = useHMSActions();

  const peerVariants = {
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "linear", duration: 0.25 },
    },

    hidden: {
      opacity: 0,
      scale: 0,
    },
  };

  useEffect(() => {
    let screenshareCheck = async () => {
      if (screenshareVideoTrack && screenVideoRef.current) {
        if (screenshareVideoTrack.enabled) {
          await hmsActions.attachVideo(
            screenshareVideoTrack.id,
            screenVideoRef.current
          );
        } else {
          await hmsActions.detachVideo(
            screenshareVideoTrack.id,
            screenVideoRef.current
          );
        }
      }
    };
    screenshareCheck();
  }, [screenshareVideoTrack]);

  return (
    <AnimatePresence>
      <Paper
        sx={{
          borderTopLeftRadius: "0.5rem",
          borderTopRightRadius: "0.5rem",
          height: "fit-content",
          width: "100%",
          border:
            peerAudioLevel > 0 ? "3px solid #39FF14" : "3px solid transparent",
        }}
        component={motion.div}
        variants={peerVariants}
        initial="hidden"
        whileInView="visible"
        exit={{ opacity: 0 }}
      >
        <Stack height={"inherit"}>
          <Box sx={{ width: "100%", height: "100%" }}>
            {screenshareVideoTrack?.enabled ? (
              <video
                ref={screenVideoRef}
                className={`peer-video ${peer.isLocal ? "local" : ""}`}
                style={{
                  width: "inherit",
                  borderTopLeftRadius: "0.5rem",
                  borderTopRightRadius: "0.5rem",
                  height: isDesktop ? (peer.isLocal ? "100%" : "50vh") : "25vh",
                }}
                autoPlay
                muted
                playsInline
              />
            ) : (
              <video
                ref={videoRef}
                className={`peer-video ${peer.isLocal ? "local" : ""}`}
                style={{
                  width: "inherit",
                  borderTopLeftRadius: "0.5rem",
                  borderTopRightRadius: "0.5rem",
                  height: isDesktop ? (peer.isLocal ? "100%" : "50vh") : "25vh",
                }}
                autoPlay
                muted
                playsInline
              />
            )}
          </Box>
          <Stack padding={"0.25rem"} direction={"row"}>
            <Typography
              variant="subtitle1"
              marginLeft={"1rem"}
              color={peer.isLocal ? "lightgreen" : "white"}
            >
              {peer.name} {peer.isLocal ? "(You)" : ""}
            </Typography>
            <Stack direction={"row"} marginLeft={"auto"}>
              {audioOn ? <MicIcon /> : <MicOffIcon color="error" />}
              {videoOn ? <VideocamIcon /> : <VideocamOffIcon color="error" />}

              {downlinkQuality == -1 ? (
                <SignalCellular0BarIcon color="primary" />
              ) : null}
              {downlinkQuality == 0 ? (
                <SignalCellularConnectedNoInternet0BarIcon color="error" />
              ) : null}
              {downlinkQuality == 1 ? (
                <SignalCellularAlt1BarIcon color="error" />
              ) : null}
              {downlinkQuality == 2 ? (
                <SignalCellularAlt2BarIcon color="warning" />
              ) : null}
              {downlinkQuality !== undefined ? (
                downlinkQuality >= 3 ? (
                  <SignalCellularAltIcon color="success" />
                ) : null
              ) : null}
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </AnimatePresence>
  );
}

export default Peer;
