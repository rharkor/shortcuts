import { useEffect, useState } from "react";
import api from "./utils/api";
import style from "./Links.module.css";
import { Navigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import Settings from "./Settings";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
const { ipcRenderer } = (window.require && window.require("electron")) || {};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 400,
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  gap: "1rem",
  flexDirection: "column",
};

const Links = () => {
  const [links, setLinks] = useState([]);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [addUrlModal, setAddUrlModal] = useState(false);
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const refresh = async () => {
    return await api
      .fetch("links")
      .then((data) => {
        if (data.status !== "success") {
          throw data.error;
        }
        setLinks(data.value);
      })
      .catch((e) => {
        console.error(e);
        setShouldRedirect(true);
      });
  };

  useEffect(() => {
    refresh();
  }, []);

  const addLink = async () => {
    await api.fetch("add-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        description,
      }),
    });
    await refresh();
  };

  const removeItem = async (linkId) => {
    await api.fetch("remove-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        linkId,
      }),
    });
    await refresh();
  };

  if (shouldRedirect) return <Navigate replace to="/login" />;

  return (
    <main>
      <Settings />
      <Typography component="h1" variant="h5" marginTop="3rem">
        Vos raccourcis
      </Typography>
      <Container>
        <nav>
          <ul
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <li>
              <Button
                onClick={() => {
                  ipcRenderer?.send(
                    "openLinks",
                    JSON.stringify(links.map((link) => link.url))
                  );
                }}
                variant="contained"
                color="warning"
              >
                Tout ouvrir
              </Button>
            </li>
            <li>
              <Button
                onClick={() => {
                  setAddUrlModal(true);
                }}
                variant="outlined"
              >
                <AddIcon />
              </Button>
            </li>
          </ul>
        </nav>
        <section
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: "2rem",
            gap: "1rem",
          }}
        >
          {links.map((link) => {
            return (
              <Card
                sx={{ minWidth: 275 }}
                key={link.id}
                onClick={() => ipcRenderer?.send("openLink", link.url)}
                style={{
                  minWidth: "150px",
                  flex: "1",
                  backgroundColor: "#f7f7f7",
                  display: "flex",
                  flexDirection: "row",
                  gap: "2rem",
                  padding: "1rem",
                  justifyContent: "space-between",
                }}
                className={style.card}
                component="article"
              >
                <h2>{link.description}</h2>
                <Button
                  onClick={() => {
                    removeItem(link.id);
                  }}
                >
                  <DeleteForeverIcon />
                </Button>
              </Card>
            );
          })}
        </section>
      </Container>
      <Modal
        open={addUrlModal}
        onClose={() => {
          setAddUrlModal(false);
        }}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Ajouter un raccourcis
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <Box component="form" onSubmit={addLink} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="name"
                label="Nom du lien"
                type="text"
                id="name"
                autoComplete="link-name"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="url"
                label="Url du lien"
                type="text"
                id="url"
                autoComplete="link-url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: "1rem",
                  marginTop: "2rem",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    setAddUrlModal(false);
                  }}
                >
                  Annuler
                </Button>
                <Button color="success" variant="contained" type="submit">
                  Oui je suis sûr
                </Button>
              </div>
            </Box>
          </div>
        </Box>
      </Modal>
    </main>
  );
};

export default Links;
