import { userType } from "../features/authSlice";

function setUserData(data: userType): void {
  localStorage.setItem("authToken", data.accessToken);
  localStorage.setItem(
    "userData",
    JSON.stringify({
      email: data.email,
      _id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
    })
  );
}

function clearUserData(): void {
  localStorage.removeItem("userData");
  localStorage.removeItem("authToken");
}

function getUserData(): Omit<userType, "accessToken"> | null {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
}

function getAuthToken(): Pick<userType, "accessToken"> | null {
  const authToken = localStorage.getItem("authToken");
  return authToken ? JSON.parse(authToken) : null;
}

function updateUserData(updatedDetails: Partial<userType>): void {
  const userData = localStorage.getItem("userData") as string;
  const user = JSON.parse(userData);

  Object.entries(updatedDetails).forEach(([key, value]) => {
    user[key] = value;
  });

  localStorage.setItem("userData", JSON.stringify(user));
}

// function setCredentials(username, password) {
//   localStorage.setItem(
//     "credentials",
//     JSON.stringify({
//       username,
//       password,
//     })
//   );
// }

// function getCredentials() {
//   const credentials = localStorage.getItem("credentials");

//   return credentials ? JSON.parse(credentials) : null;
// }

// function clearCredentials() {
//   localStorage.removeItem("credentials");
// }

export { setUserData, clearUserData, getUserData, updateUserData getAuthToken };
