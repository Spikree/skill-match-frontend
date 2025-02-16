import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import ErrorFallBack from "./errorPages/ErrorFallBack.tsx";
import { ErrorBoundary } from "react-error-boundary";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary FallbackComponent={ErrorFallBack}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </ErrorBoundary>
);
