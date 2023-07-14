import { roles } from "./types";

export const userRoles: roles = {
  1: "admin",
  2: "dentist",
  3: "patient",
};

export const loginRoutes: Record<number, string> = {
  1: "/admin",
  2: "/dentist/appointments",
  3: "/patient/appointments",
};
