import {
  selectConnectionQualityByPeerID,
  useHMSStore,
  useVideo,
} from "@100mslive/react-sdk";
import { Box, Paper, Stack, Typography } from "@mui/material";

import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import SignalCellularAlt2BarIcon from "@mui/icons-material/SignalCellularAlt2Bar";
import SignalCellularAlt1BarIcon from "@mui/icons-material/SignalCellularAlt1Bar";
import SignalCellularConnectedNoInternet0BarIcon from "@mui/icons-material/SignalCellularConnectedNoInternet0Bar";
import SignalCellular0BarIcon from "@mui/icons-material/SignalCellular0Bar";
import { AnimatePresence, motion } from "framer-motion";

function Peer({ peer }: { peer: any }) {
  const downlinkQuality = useHMSStore(
    selectConnectionQualityByPeerID(peer.id)
  )?.downlinkQuality;
  const { videoRef } = useVideo({
    trackId: peer.videoTrack,
  });
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
  return (
    <AnimatePresence>
      <Paper
        sx={{
          borderTopLeftRadius: "0.5rem",
          borderTopRightRadius: "0.5rem",
          height: "fit-content",
          width: "100%",
        }}
        component={motion.div}
        variants={peerVariants}
        initial="hidden"
        whileInView="visible"
        exit={{ opacity: 0 }}
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
          <Stack padding={"0.25rem"} direction={"row"}>
            <Typography
              variant="subtitle1"
              marginLeft={"1rem"}
              color={peer.isLocal ? "lightgreen" : "white"}
            >
              {peer.name} {peer.isLocal ? "(You)" : ""}
            </Typography>
            <Box marginLeft={"auto"}>
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
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </AnimatePresence>
  );
}

export default Peer;
