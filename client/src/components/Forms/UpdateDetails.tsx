import TextField from "./TextField";
import { fieldType } from "../../utils/types";
import { useState } from "react";

interface props {
  title: string;
  fields: fieldType[];
  url: string;
  initFormData: {};
}

const UpdateDetails: React.FC<props> = ({
  title,
  fields,
  initFormData,
  url,
}) => {
  const [formData, setFormData] = useState(initFormData);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form className="mt-24 w-1/3">
      <div className="space-y-12">
        <div className="pb-12">
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 font-semibold leading-6 text-gray-900 text-lg">
                {title}
              </span>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
            {fields.map((field, index) => {
              return (
                <TextField
                  key={index}
                  onChange={changeHandler}
                  value={formData[field.name]}
                  {...field}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-start gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default UpdateDetails;
