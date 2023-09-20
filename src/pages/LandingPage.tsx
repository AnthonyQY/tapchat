import {
  Container,
  Typography,
  Stack,
  useMediaQuery,
  Box,
} from "@mui/material";
import JoinForm from "../components/JoinForm";
import { selectIsConnectedToRoom, useHMSStore } from "@100mslive/react-sdk";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../fonts/fonts.css";
import { motion } from "framer-motion";

export default function LandingPage() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 800px)");
  useEffect(() => {
    if (isConnected) {
      navigate("/room");
    }
  }, [isConnected]);

  const formVariants = {
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "linear", duration: 0.5 },
    },

    hidden: {
      opacity: 0,
      scale: 0,
    },
  };

  const typographyVariants = {
    visible: {
      opacity: 1,
      transition: { type: "linear", duration: 1 },
    },

    hidden: {
      opacity: 0,
    },
  };

  return (
    <Container sx={{ height: "100vh" }}>
      <Stack
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        height={"100%"}
        spacing={5}
      >
        <Typography
          fontFamily={"coolvetica"}
          variant={isDesktop ? "h1" : "h2"}
          fontWeight={"bold"}
          component={motion.div}
          whileHover={{
            scale: 1.2,
            transition: { duration: 0.3 },
          }}
          variants={typographyVariants}
          initial="hidden"
          whileInView="visible"
        >
          tapchat
        </Typography>
        <Box
          component={motion.div}
          variants={formVariants}
          initial="hidden"
          whileInView="visible"
        >
          <JoinForm />
        </Box>
      </Stack>
    </Container>
  );
}
