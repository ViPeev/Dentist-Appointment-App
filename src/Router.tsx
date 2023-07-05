import { createBrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Layout from "./layouts/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      {
        path: "login",
        Component: () => (
          <Home>
            <Login />
          </Home>
        ),
      },
      {
        path: "register",
        Component: () => (
          <Home>
            <Register />
          </Home>
        ),
      },
    ],
  },
]);
