import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { tabType } from "../utils/types";
import { useEffect, useState } from "react";

const TabPanel: React.FC<{ tabs: tabType[] }> = ({ tabs }) => {
  let [route, setRoute] = useState<string>("appointments");
  const navigate = useNavigate();

  useEffect((): void => {
    navigate(route);
  }, [route]);

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const newRoute = e.target.value?.toLowerCase().replace(" ", "-");
    setRoute(newRoute || "appointments");
  };

  return (
    <>
      <div className="p-5 sticky top-0">
        <div className="sm:hidden flex justify-center">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-3/4 rounded-md border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
            onChange={changeHandler}
          >
            {tabs.map((tab) => (
              <option key={tab.name} value={tab.name}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.href}
                className={({ isActive }) => {
                  return isActive
                    ? "bg-cyan-600 text-white rounded-md px-3 py-2 text-sm font-medium"
                    : "text-gray-500 hover:text-gray-700 rounded-md px-3 py-2 text-sm font-medium";
                }}
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default TabPanel;
