import { useForm } from "react-hook-form";
import {
  Button,
  Divider,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useHMSActions } from "@100mslive/react-sdk";
import { CSSProperties, useState } from "react";
import { useSnackbar } from "notistack";
import { AnimatePresence } from "framer-motion";
import { PulseLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

export default function JoinForm() {
  const { register, handleSubmit } = useForm();
  const [channel, setChannel] = useState<any>("fue-jllp-csd");
  const [submitted, setSubmitted] = useState(false);

  const hmsActions = useHMSActions();

  const { enqueueSnackbar } = useSnackbar();
  const showSnack = (message: string, variant: any) => {
    enqueueSnackbar(message, { variant: variant });
  };

  const handleFormSubmit = async (res: any) => {
    setSubmitted(true);
    let authToken;
    if (res?.roomcode.length > 0) {
      try {
        authToken = await hmsActions.getAuthTokenByRoomCode({
          roomCode: res.roomcode,
        });
      } catch (e) {
        showSnack("Invalid room code", "error");
      }
    } else {
      authToken = await hmsActions.getAuthTokenByRoomCode({
        roomCode: channel,
      });
    }
    if (authToken) {
      try {
        await hmsActions.join({ userName: res.username, authToken: authToken });
      } catch (e) {
        showSnack("Invalid auth token", "error");
        setSubmitted(false);
      }
    }
  };

  const handleChange = (event: any) => {
    setChannel(event.target.value as number);
  };

  return (
    <>
      <AnimatePresence>
        {!submitted ? (
          <Paper variant="outlined" sx={{ padding: 2 }}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Stack spacing={2}>
                <Typography variant="h6">Join Room</Typography>
                <TextField
                  {...register("username", { required: true, maxLength: 32 })}
                  placeholder="My Name"
                  label="Username"
                />
                <InputLabel>Room</InputLabel>
                <Select
                  value={channel}
                  onChange={handleChange}
                  defaultValue={"fue-jllp-csd"}
                >
                  <MenuItem value={"fue-jllp-csd"}>Public 1</MenuItem>
                  <MenuItem value={"thu-ygea-teg"}>Public 2</MenuItem>
                  <MenuItem value={"rgr-yjlj-qkn"}>Public 3</MenuItem>
                </Select>
                <Divider>OR</Divider>
                <TextField
                  {...register("roomcode", { maxLength: 32 })}
                  placeholder="12345678"
                  label="Room Code"
                />

                <Button type="submit" variant="contained">
                  Enter
                </Button>
              </Stack>
            </form>
          </Paper>
        ) : (
          <PulseLoader
            color={"white"}
            loading={submitted}
            size={25}
            aria-label="Loading Spinner"
            data-testid="loader"
            cssOverride={override}
          />
        )}
      </AnimatePresence>
    </>
  );
}
