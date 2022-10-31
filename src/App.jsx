import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Links from "./Links";
import Login from "./Login";
import Register from "./Register";
import Copyright from "./Copyright";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  return (
    <div className="App">
      <CssBaseline />

      <HashRouter>
        <ToastContainer position="bottom-right" />
        <Routes>
          <Route index element={<Links />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Routes>
        <Copyright />
      </HashRouter>
    </div>
  );
}

export default App;
