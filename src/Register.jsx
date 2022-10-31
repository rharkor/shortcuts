import { useState } from "react";
import { Navigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import api from "./utils/api";
import { toast } from "react-toastify";
import { Link as Navigation } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.stopPropagation();
      return;
    }

    if (isSending) {
      toast.error("Inscription déjà en cours..");
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("Les mots de passe doivent être identiques");
      return;
    }

    setIsSending(true);

    const apiCall = api
      .fetch("register", {
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
      pending: "Inscription en cours..",
      success: "Inscription réussie",
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
          Créer un compte
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Addresse email"
                name="email"
                autoComplete="email"
                type={"email"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="passwordConfirm"
                label="Confirmer votre mot de passe"
                type="password"
                id="passwordConfirm"
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            S'inscrire
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Navigation to="/login">
                <Typography variant="body2">
                  Vous possedez déjà un compte? Se connecter
                </Typography>
              </Navigation>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
