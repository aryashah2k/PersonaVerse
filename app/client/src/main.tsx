import { createRoot } from "react-dom/client";
import "./index.css";
import "./app.css"; // Added import for app.css
import App from "./App.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element");
}

createRoot(rootElement).render(<App />);
