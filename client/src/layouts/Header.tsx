import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { authSelector } from "../utils/selectors";
import tooth from "../assets/images/tooth.png";
import { loginRoutes } from "../utils/roles";

const Header: React.FC = () => {
  const { userData } = useSelector(authSelector);
  
  return (
    <header className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8 border-b-4 border-cyan-700"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link to="/">
            <span className="sr-only">Dentist Appointments</span>
            <img className="h-8 w-auto" src={tooth} alt="Home" title="Home" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-6">
          {!userData ? (
            <>
              <Link to="/login">
                <span className="lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900">
                  Log in
                </span>
              </Link>
              <Link to="/register">
                <span className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 transition-all duration-300">
                  Sign up
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link to={loginRoutes[userData.role]}>
                <span className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300">
                  Dashboard
                </span>
              </Link>
              <Link to="/logout">
                <span className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300">
                  Logout
                </span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
