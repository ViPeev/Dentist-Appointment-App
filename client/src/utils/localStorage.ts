import { userType } from "../features/authSlice";

function setUserData(data: userType) {
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

function clearUserData() {
  localStorage.removeItem("userData");
  localStorage.removeItem("authToken");
}

function getUserData() {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
}

function getAuthToken() {
  const authToken = localStorage.getItem("authToken");
  return authToken ? JSON.parse(authToken) : null;
}

// function updateUserData(image) {
//   const userData = localStorage.getItem("userData");
//   const user = JSON.parse(userData);
//   user.image = image;
//   localStorage.setItem("userData", JSON.stringify(user));
// }

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

export { setUserData, clearUserData, getUserData, getAuthToken };
