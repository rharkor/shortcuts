import SettingsIcon from "@mui/icons-material/Settings";
import styles from "./Settings.module.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Popover from "@mui/material/Popover";
import api from "./utils/api";

const style = {
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

const Settings = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [redirection, setRedirection] = useState(null);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = !!anchorEl;

  const deleteAccount = async () => {
    await api.fetch("delete-account", {
      method: "POST",
    });
    setRedirection("/register");
  };

  if (redirection) {
    return <Navigate replace to={redirection} />;
  }

  return (
    <section>
      <Button
        onClick={handleClick}
        className={styles.toggler}
        variant="contained"
      >
        <SettingsIcon />
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ul
          style={{
            padding: "1rem",
          }}
        >
          <li>
            <Button
              onClick={() => {
                setDeleteAccountModal(true);
              }}
              color="error"
            >
              Supprimer son compte
            </Button>
          </li>
          <hr />
          <li>
            <Button
              onClick={() => {
                api.setAuthToken(null);
                setRedirection("/login");
              }}
            >
              Se déconnecter
            </Button>
          </li>
        </ul>
      </Popover>
      <Modal
        open={deleteAccountModal}
        onClose={() => {
          setDeleteAccountModal(false);
        }}
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Êtes vous sûr de vouloir supprimer votre compte ?
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <Button
              color="success"
              variant="contained"
              onClick={() => {
                setDeleteAccountModal(false);
              }}
            >
              Non
            </Button>
            <Button color="error" onClick={deleteAccount}>
              Oui je suis sûr
            </Button>
          </div>
        </Box>
      </Modal>
    </section>
  );
};

export default Settings;
