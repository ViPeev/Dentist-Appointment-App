import { useState, useEffect, SyntheticEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/authSlice";
import { authSelector } from "../utils/selectors";
import { loginRoutes } from "../utils/roles";
import ModalWrapper from "../layouts/ModalWrapper";
import SubmitButton from "../components/Buttons/SubmitButton";

const Login: React.FC = () => {
  return <ModalWrapper Form={LoginForm} />;
};

const LoginForm: React.FC = ({ children }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const { error, isLoading, userData } = useSelector(authSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData !== null) {
      navigate(loginRoutes[userData?.role || 2]);
    }
  }, [userData]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const submitHandler = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="flex min-h-full relative flex-1 flex-col justify-center px-3 py-6 lg:px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Login
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-2" onSubmit={submitHandler}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={changeHandler}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2 mb-10">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={changeHandler}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="mb-4">
          <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
          </div>
        </form>
      </div>
      {children}
    </div>
  );
};

export default Login;
