import { useState } from "react";
import { Navigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import api from "./utils/api";
import { toast } from "react-toastify";
import { Link as Navigation } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity() || isSending) {
      e.stopPropagation();
      return;
    }

    setIsSending(true);

    const apiCall = api
      .fetch("login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
      .then((res) => {
        if (res.status !== "success") {
          throw res.error;
        }

        const accessToken = res.access_token;
        api.setAuthToken(accessToken);
        setShouldRedirect(true);
      })
      .catch((e) => {
        console.error(e);
        throw e;
      })
      .finally(() => {
        setIsSending(false);
      });
    await toast.promise(apiCall, {
      pending: "Connexion en cours..",
      success: "Connexion réussie",
      error: "Echec, veuillez ressayer",
    });
  };

  if (shouldRedirect) return <Navigate replace to="/" />;

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Se connecter
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Addresse email"
            name="email"
            autoComplete="email"
            type={"email"}
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Connexion
          </Button>
          <Grid container>
            <Grid item>
              <Navigation to={"/register"}>
                <Typography variant="body2">
                  Pas encore de compte? S'inscrire
                </Typography>
              </Navigation>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
