import UpdateDetails from "../components/UpdateDetails";
import { fieldType } from "../utils/types";

interface inputFields {
  patient: fieldType[];
  dentist: fieldType[];
  password: fieldType[];
}

const inputFields: inputFields = {
  patient: [
    { title: "First name", name: "first-name", type: "text" },
    { title: "Last name", name: "last-name", type: "text" },
    { title: "Email address", name: "email", type: "email" },
  ],
  dentist: [
    { title: "First name", name: "first-name", type: "text" },
    { title: "Last name", name: "last-name", type: "text" },
    { title: "Email address", name: "email", type: "email" },
  ],
  password: [
    { title: "Current Password", name: "prev-pass", type: "password" },
    { title: "New Password", name: "new-pass", type: "password" },
    { title: "Repeat Password", name: "re-pass", type: "password" },
  ],
};

const Settings: React.FC = () => {
  return (
    <>
      <UpdateDetails
        title="Edit Account Details"
        fields={inputFields.patient}
        url="string"
      />
      <UpdateDetails
        title="Edit Password"
        fields={inputFields.password}
        url="string"
      />
    </>
  );
};

export default Settings;
