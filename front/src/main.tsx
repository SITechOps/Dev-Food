import "./index.css";
import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Loading } from "./components/Loading.tsx";
import Restaurant from "./pages/Restaurant.tsx";
import Restaurants from "./pages/Restaurants.tsx";

const pages = {
  App: "./App.tsx",
  Home: "./pages/Home.tsx",
  Auth: "./pages/Auth.tsx",
  Account: "./pages/Account.tsx",
  CadastroEndereco: "./components/CadastroEndereco.tsx",
  Restaurant: "./pages/Restaurant.tsx",
  Restaurants: "./pages/Restaurants.tsx",
};

const { App, Home, Auth, Account, CadastroEndereco } = Object.fromEntries(
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
    element: <Auth />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "/c-endereco",
    element: <CadastroEndereco />,
  },
  {
    path: "/restaurante/:id",
    element: <Restaurant />,
  },
  {
    path: "/restaurantes",
    element: <Restaurants />,
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
