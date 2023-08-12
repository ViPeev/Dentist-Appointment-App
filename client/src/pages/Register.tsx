import { useState, useEffect, SyntheticEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authSelector } from "../utils/selectors";
import { register } from "../features/authSlice";
import { registerRole } from "../utils/types";
import { loginRoutes } from "../utils/roles";
import Select from "../components/Misc/Select";
import ModalWrapper from "../layouts/ModalWrapper";
import SubmitButton from "../components/Buttons/SubmitButton";

const roles: registerRole[] = [
  { id: 3, name: "looking for a dentist" },
  { id: 2, name: "a dentist" },
];

const Register: React.FC = () => {
  return <ModalWrapper Form={RegisterForm} />;
};

const RegisterForm: React.FC = ({ children }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: roles[0].id,
  });

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

  const selectHandler: (value: registerRole) => void = (value) => {
    setFormData((prev) => {
      return { ...prev, role: value.id };
    });
  };

  const submitHandler = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="flex relative min-h-full flex-1 flex-col justify-center px-3 py-6 lg:px-4">
      {/* Close Button here*/}
      {children}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Register
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-2" onSubmit={submitHandler}>
          <div className="flex flex-row gap-3">
            <span className="w-1/2">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                First Name
              </label>
              <div className="mt-2">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="first name"
                  required
                  onChange={changeHandler}
                  value={formData.firstName}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                />
              </div>
            </span>
            <span className="w-1/2">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Last Name
              </label>
              <div className="mt-2">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="last name"
                  onChange={changeHandler}
                  value={formData.lastName}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                />
              </div>
            </span>
          </div>
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
                onChange={changeHandler}
                value={formData.email}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <Select
            selectHandler={selectHandler}
            selected={roles[0]}
            values={roles}
          />
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="password"
                onChange={changeHandler}
                value={formData.password}
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
                Repeat Password
              </label>
            </div>
            <div className="mt-2 mb-10">
              <input
                id="repass"
                name="repass"
                type="password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="mb-4">
            <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
