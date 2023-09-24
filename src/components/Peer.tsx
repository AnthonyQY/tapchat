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
import NoPhotographyIcon from "@mui/icons-material/NoPhotography";

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
          boxShadow:
            peerAudioLevel > 0 ? " 0px 0px 5px 2px rgba(57,255,20,1)" : "none",
        }}
        component={motion.div}
        variants={peerVariants}
        initial="hidden"
        whileInView="visible"
        exit={{ opacity: 0 }}
      >
        <Stack height={"inherit"}>
          <Box
            sx={{ width: "100%", position: "relative", paddingTop: "56.25%" }}
          >
            {screenshareVideoTrack?.enabled ? (
              <video
                ref={screenVideoRef}
                className={`peer-video ${peer.isLocal ? "local" : ""}`}
                style={{
                  width: "inherit",
                  borderTopLeftRadius: "0.5rem",
                  borderTopRightRadius: "0.5rem",
                  height: isDesktop ? (peer.isLocal ? "100%" : "50vh") : "25vh",
                  position: "absolute",
                  top: "0",
                  bottom: "0",
                  right: "0",
                  left: "0",
                }}
                autoPlay
                muted
                playsInline
              />
            ) : videoOn ? (
              <video
                ref={videoRef}
                className={`peer-video ${peer.isLocal ? "local" : ""}`}
                style={{
                  width: "inherit",
                  borderTopLeftRadius: "0.5rem",
                  borderTopRightRadius: "0.5rem",
                  height: isDesktop ? (peer.isLocal ? "100%" : "50vh") : "25vh",
                  position: "absolute",
                  top: "0",
                  bottom: "0",
                  right: "0",
                  left: "0",
                }}
                autoPlay
                muted
                playsInline
              />
            ) : (
              <Box
                sx={{
                  width: "inherit",
                  position: "absolute",
                  top: "0",
                  bottom: "0",
                  right: "0",
                  left: "0",
                }}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                fontSize={isDesktop ? "12rem" : "6rem"}
              >
                <NoPhotographyIcon fontSize={"inherit"} />
              </Box>
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
