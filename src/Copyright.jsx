import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      marginBottom={".5rem"}
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://huort.com/"
        target={"_blank"}
        style={{
          color: "rgba(0, 0, 0, 0.6)",
          textDecoration: "underline",
        }}
      >
        huort.com
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Copyright;
