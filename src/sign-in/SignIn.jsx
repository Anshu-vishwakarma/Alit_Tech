import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  maxWidth: 450,
  padding: theme.spacing(4),
  gap: theme.spacing(2),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),

  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    zIndex: -1,
    background:
      "radial-gradient(circle at center,#eef5ff,#ffffff)",
  },
}));

export default function SignIn(props) {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");

  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [alertType, setAlertType] = React.useState("success");
  const [alertMessage, setAlertMessage] = React.useState("");
    const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
    const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage(
        "Password must be at least 6 characters."
      );
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };
    const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) return;

    setLoading(true);

    const data = new FormData(event.currentTarget);

    const payload = {
      email: data.get("email"),
      password: data.get("password"),
    };

    try {
      const response = await axios.post(
        "https://alitinvoiceappapi.azurewebsites.net/api/Auth/Login",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", response.data.token);

      setAlertType("success");
      setAlertMessage("Login successful.");
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/Dashboard");
      }, 1000);

    } catch (error) {
      setAlertType("error");

      setAlertMessage(
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Invalid email or password."
      );

      setOpenSnackbar(true);

    } finally {
      setLoading(false);
    }
  };
    return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <SignInContainer>
        <Card>

          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h4" fontWeight={700}>
              Welcome Back
            </Typography>

            <Typography color="text.secondary">
              Log in to your account
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel>Email</FormLabel>

              <TextField
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                fullWidth
                required
                error={emailError}
                helperText={emailErrorMessage}
                autoComplete="email"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>

              <TextField
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                fullWidth
                required
                error={passwordError}
                helperText={passwordErrorMessage}
                autoComplete="current-password"
              />
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                height: 45,
              }}
            >
              {loading ? (
                <CircularProgress
                  size={22}
                  color="inherit"
                />
              ) : (
                "Sign In"
              )}
            </Button>

            <Typography
              textAlign="center"
              mt={2}
            >
              Don't have an account?{" "}

              <Link
                to="/SignUp"
                style={{
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Sign Up
              </Link>
            </Typography>

          </Box>

        </Card>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Alert
            severity={alertType}
            variant="filled"
            onClose={handleCloseSnackbar}
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>

      </SignInContainer>
    </AppTheme>
  );
}