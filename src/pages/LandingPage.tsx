import { Container, Typography, Stack, useMediaQuery } from "@mui/material";
import JoinForm from "../components/JoinForm";
import { selectIsConnectedToRoom, useHMSStore } from "@100mslive/react-sdk";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../fonts/fonts.css";

export default function LandingPage() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 800px)");
  useEffect(() => {
    if (isConnected) {
      navigate("/room");
    }
  }, [isConnected]);

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
        >
          tapchat
        </Typography>
        <JoinForm />
      </Stack>
    </Container>
  );
}
