import request from "./request";

export const queryAsyncGet = async (url: string) => {
  return request(url, {
    method: "GET",
  })
}

export const queryAsyncPost = async (url: string) => {
  return request(url, {
    method: "POST",
  })
}

export const queryPost = async (url: string, data: any) => {
  return request(url, {
    method: "POST",
    data
  })
}

export const queryGet = async (url: string, params: any) => {
  return request(url, {
    method: "GET",
    params
  })
}

export const queryPostParams = async (url: string, data: any) => {
  const formData = new URLSearchParams();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  
  return request(url, {
    method: "POST",
    data: formData.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
}

export const queryDelete = async (url: string, data: any) => {
  return request(url, {
    method: "DELETE",
    data
  })
}

export const queryUpload = async (url: string, formData: FormData) => {
  return request(url, {
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}