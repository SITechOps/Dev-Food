import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login/Login.tsx";
import Cadastro from "./pages/Cadastro.tsx";
import { createRoot } from "react-dom/client";
import Account from "./pages/Account/Account.tsx";
import { AuthProvider } from "./connection/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CadastroEndereco from "./pages/CadastroEndereco/CadastroEndereco.tsx";
// import ComplementoEndereco from "./pages/CadastroEndereco/ComplementoEndereco.tsx";

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
    path: "/login",
    element: <Login />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "/c-endereco",
    element: <CadastroEndereco />,
  },
  // {
  //   path: "/compl-endereco",
  //   element: <ComplementoEndereco />,
  // },
]);

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="712065091138-0iaa0qpolcm1646nmnd91thctaqinv9v.apps.googleusercontent.com">
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </StrictMode>
  </GoogleOAuthProvider>
);
