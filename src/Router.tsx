import { Outlet, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Layout from "./layouts/Layout";
import TabPanel from "./layouts/TabPanel";
import Settings from "./pages/Settings";
import MedicalRecord from "./pages/MedicalRedord";
import Appoinments from "./pages/Appointments";
import DentistList from "./pages/DentistsList";

const tabs = [
  { name: "Settings", href: "/patient/settings" },
  { name: "Dentists", href: "/patient/dentists" },
  { name: "Appointments", href: "/patient/appointments" },
  { name: "Medical Record", href: "/patient/medical-record" },
  { name: "Blacklist", href: "/patient/blacklist" },
];

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
      {
        path: "logout",
        Component: () => <h1>Logout</h1>,
      },
      {
        path: "patient",
        Component: () => <TabPanel tabs={tabs} />,
        children: [
          {
            path: "settings",
            Component: () => <Settings />,
          },
          {
            path: "dentists",
            Component: () => <DentistList />,
          },
          {
            path: "appointments",
            Component: () => <Appoinments />,
          },
          {
            path: "medical-record",
            Component: () => <MedicalRecord />,
          },
          {
            path: "blacklist",
            Component: () => <h2>Blacklist</h2>,
          },
        ],
      },
      {
        path: "dentist",
        Component: () => (
          <>
            <h1>Dentist</h1>
            <Outlet />
          </>
        ),
        children: [
          {
            path: "settings",
            Component: () => <Settings />,
          },
          {
            path: "patients",
            Component: () => (
              <>
                <h2>Patients</h2>
              </>
            ),
          },
          {
            path: "appointments",
            Component: () => <Appoinments />,
          },
          {
            path: "events",
            Component: () => (
              <>
                <h2>Schedule event</h2>
              </>
            ),
          },
          {
            path: "blacklist",
            Component: () => (
              <>
                <h2>Blacklist</h2>
              </>
            ),
          },
        ],
      },
      {
        path: "admin",
        Component: () => (
          <>
            <h1>Admin</h1>
            <Outlet />
          </>
        ),
        children: [
          {
            path: "profile",
            Component: () => (
              <>
                <h2>Profile</h2>
              </>
            ),
          },
          {
            path: "accounts",
            Component: () => (
              <>
                <h2>Accounts</h2>
              </>
            ),
          },
        ],
      },
    ],
  },
]);
