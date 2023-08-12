const deploy: boolean = false;
export const host: string = deploy ? "" : "http://localhost:5000/api/v1/";

export type optionTypes = {
  method: string;
  headers: { ["X-Authorization"]?: string; ["Content-Type"]: string };
  body: BodyInit | null | undefined;
};

export type dataType = { [index: string]: number | string };

async function request(url: string, options: optionTypes) {
  const response = await fetch(`${host}${url}`, options);

  if (response.ok === false) {
    const error = await response.json();
    console.log(error);
    throw new Error(error.message);
  }

  const data = await response.json();
  return data;
}

function getOptions(method?: string, body?: {}) {
  const options = {
    method: method || "get",
    headers: {},
  } as optionTypes;

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

export async function get(url: string) {
  return await request(url, getOptions());
}

export async function post(url: string, data: dataType) {
  return await request(url, getOptions("post", data));
}

export async function put(url: string, data: dataType) {
  return await request(url, getOptions("put", data));
}

export async function del(url: string) {
  return await request(url, getOptions("delete"));
}
