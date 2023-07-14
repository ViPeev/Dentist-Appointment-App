import { Outlet, NavLink } from "react-router-dom";
import { tabType } from "../utils/types";

const TabPanel: React.FC<{ tabs: tabType[] }> = ({ tabs }) => {
  return (
    <>
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </>
  );
};

export default TabPanel;
