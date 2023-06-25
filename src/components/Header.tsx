import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import tooth from "../assets/images/tooth.png";

export default function Header(): JSX.Element {
  return (
    <header className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Dentist Appointments</span>
            <img className="h-8 w-auto" src={tooth} alt="Home" />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-6">
          <a
            href="/login"
            className="lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900"
          >
            Log in
          </a>
          <a
            href="/register"
            className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 transition-all duration-300"
          >
            Sign up
          </a>
          <a
            href="/logout"
            className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300"
          >
            Logout
          </a>
        </div>
      </nav>
    </header>
  );
}
