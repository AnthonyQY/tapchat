import { Container, Box } from "@mui/material";
import JoinForm from "../components/JoinForm";
import { selectIsConnectedToRoom, useHMSStore } from "@100mslive/react-sdk";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      navigate("/room");
    }
  }, [isConnected]);

  return (
    <Container sx={{ height: "100vh" }}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        height={"100%"}
      >
        <JoinForm />
      </Box>
    </Container>
  );
}
