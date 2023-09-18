import { Button, Container } from "@mui/material";
import {
  selectIsConnectedToRoom,
  selectPeers,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Peer from "../components/Peer";
export default function RoomPage() {
  const hmsActions = useHMSActions();

  const isConnected = useHMSStore(selectIsConnectedToRoom);
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
  return (
    <Container>
      <h1>Connected</h1>
      <Button color="error" variant="contained" onClick={handleExitRoom}>
        Leave Room
      </Button>
      <div>
        {peers.map((peer) => (
          <Peer key={peer.id} peer={peer} />
        ))}
      </div>
    </Container>
  );
}
