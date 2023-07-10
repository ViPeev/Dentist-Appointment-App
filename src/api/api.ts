const deploy = false;
export const host = deploy ? "" : "http://localhost:5000/api/v1/";

async function request(url, options) {
  const response = await fetch(`${host}/api${url}`, options);

  const data = await response.json();
  return data;
}

function getOptions(method = "get", body) {
  const options = {
    method,
    headers: {},
  };

  const token = localStorage.getItem("authToken");
  if (token != null) {
    options.headers["X-Authorization"] = token;
  }

  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  return options;
}

export async function get(url) {
  return await request(url, getOptions());
}

export async function post(url, data) {
  return await request(url, getOptions("post", data));
}

export async function put(url, data) {
  return await request(url, getOptions("put", data));
}

export async function del(url) {
  return await request(url, getOptions("delete"));
}