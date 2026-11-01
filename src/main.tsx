import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "./loader/loader.css";
import "./loader/loadingManager";
import "./hooks/useTheme"; // applies theme class before mount to avoid flash

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
