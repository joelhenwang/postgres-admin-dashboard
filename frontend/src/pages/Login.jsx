import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "../features/authSlice";
import { useNavigate } from "react-router-dom";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

const Login = () => {
  // States
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  ); // get the auth state from the store

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Send the data to the server
    dispatch(loginUser({ username, password }));
  };

  // Redirect to home if the user is authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  React.useEffect(() => {
    if (error) {
      dispatch(clearAuthError());
    }
    return () => {
      if (error) {
        dispatch(clearAuthError());
      }
    }
  }, [username, password, error, dispatch]);

  return (
    <>
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ width: "100%" }}>
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" onClose={() => dispatch(clearAuthError())}>
              {error}
            </Alert>  // Display the error message if there is one
          )}


          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              gap: 2,
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <FormControl disabled={isLoading}>
              <FormLabel htmlFor="username">User</FormLabel>
              <TextField
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                fullWidth
                variant="outlined"
              />
            </FormControl>

            <FormControl disabled={isLoading}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                variant="outlined"
                required
              />
            </FormControl>

            <Divider></Divider>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{position: "relative"}}
            >
              {isLoading ?(
                <CircularProgress size={24} sx={{
                  color: "white",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}/>) : ('Sign In')
              }
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </>
  );
};

export default Login;
