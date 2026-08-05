import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "@fontsource/saira/400.css";
import "@fontsource/saira/700.css";
import "./index.css";
import App from "./App.tsx";
import { store } from "./store/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
