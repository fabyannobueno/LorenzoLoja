import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("main.tsx executing, root element:", document.getElementById("root"));

try {
  createRoot(document.getElementById("root")!).render(<App />);
  console.log("React mounted successfully");
} catch (e) {
  console.error("React mount failed:", e);
}
