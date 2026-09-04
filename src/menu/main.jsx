import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./menu.css";
import MenuApp from "./MenuApp";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MenuApp />
  </StrictMode>
);
