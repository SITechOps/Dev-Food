import "./index.css";
import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Loading } from "./components/Loading.tsx";

const pages = {
  App: "./App.tsx",
  Home: "./pages/Home.tsx",
  AuthUser: "./pages/AuthUser.tsx",
  Account: "./pages/Account.tsx",
  CadastroEndereco: "./components/CadastroEndereco.tsx",
};

const { App, Home, AuthUser, Account, CadastroEndereco } = Object.fromEntries(
  Object.entries(pages).map(([key, path]) => [key, lazy(() => import(path))]),
);

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
    path: "/auth",
    element: <AuthUser />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "/c-endereco",
    element: <CadastroEndereco />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="712065091138-0iaa0qpolcm1646nmnd91thctaqinv9v.apps.googleusercontent.com">
    <StrictMode>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </StrictMode>
  </GoogleOAuthProvider>,
);
