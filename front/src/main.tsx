import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login/Login.tsx";
import Cadastro from "./pages/Cadastro.tsx";
import { createRoot } from "react-dom/client";
import Account from "./pages/Account.tsx";
import { AuthProvider } from "./connection/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CadastroEndereco from "./componentes/CadastroEndereco.tsx";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";

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
    element: (
      <ProtectedRoute>
        <Account />
      </ProtectedRoute>
    ),
  },
  {
    path: "/c-endereco",
    element: <CadastroEndereco />,
  },

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
