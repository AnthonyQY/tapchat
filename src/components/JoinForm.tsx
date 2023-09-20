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
import { useState } from "react";

export default function JoinForm() {
  const { register, handleSubmit } = useForm();
  const [channel, setChannel] = useState<any>("fue-jllp-csd");

  const hmsActions = useHMSActions();

  const handleFormSubmit = async (res: any) => {
    let authToken;
    if (res?.roomcode.length > 0) {
      authToken = await hmsActions.getAuthTokenByRoomCode({
        roomCode: res.roomcode,
      });
    } else {
      authToken = await hmsActions.getAuthTokenByRoomCode({
        roomCode: channel,
      });
    }

    try {
      await hmsActions.join({ userName: res.username, authToken: authToken });
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (event: any) => {
    setChannel(event.target.value as number);
  };

  return (
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
  );
}
