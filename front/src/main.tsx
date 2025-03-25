import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import { createRoot } from "react-dom/client";
import Account from "./pages/Account.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CadastroEndereco from "./componentes/CadastroEndereco.tsx";

const router = createBrowserRouter([
  {
    path: "/cadastro",
    element: <App />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/account",
    element: <Account/>
  },
  {
    path: "/c-endereco",
    element: <CadastroEndereco />,
  },

]);

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="712065091138-0iaa0qpolcm1646nmnd91thctaqinv9v.apps.googleusercontent.com">
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
  </GoogleOAuthProvider>
);
