import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Cadastro from "./pages/Cadastro.tsx";
import Account from "./pages/Account/Account.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/cadastro",
    element: <Cadastro />,
  },
  {
    path: "/account",
    element: <Account />,
  }
]);

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId='712065091138-0iaa0qpolcm1646nmnd91thctaqinv9v.apps.googleusercontent.com'>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </GoogleOAuthProvider>
);
