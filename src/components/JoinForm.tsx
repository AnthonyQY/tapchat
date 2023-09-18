import { useForm } from "react-hook-form";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useHMSActions } from "@100mslive/react-sdk";

export default function JoinForm() {
  const { register, handleSubmit } = useForm();

  const hmsActions = useHMSActions();

  const handleFormSubmit = async (res: any) => {
    const authToken = await hmsActions.getAuthTokenByRoomCode({
      roomCode: res.roomcode,
    });

    try {
      await hmsActions.join({ userName: res.username, authToken: authToken });
    } catch (e) {
      console.log(e);
    }
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
          <TextField
            {...register("roomcode", { required: true, maxLength: 32 })}
            placeholder="12345678"
            label="Room Code"
          />
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
