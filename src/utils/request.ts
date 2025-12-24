import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { notification } from 'antd';
// import { history } from '@aniyajs/plugin-router'

const { protocol } = window.location;

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  302: '临时重定向。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

interface ExtraAxiosError extends AxiosError {
  data: {
    code?: number
    connectInfo?: string
    message?: string
    timestamp?: string
  },
  statusText?: string
}

const errorHandler = (errorResponse: ExtraAxiosError) => {
  const { data, status, statusText } = errorResponse
  const errCode = data?.code || status || 500
  const errText = data?.message || (codeMessage as any)[errCode] || statusText

  if (status === 403) {
    // history.push('/exception/403');
  }

  if ((status === 401) && !localStorage.getItem('token')) {
    return
  }
    
  notification.error({
    message: `请求错误 ${errCode}`,
    description: errText,
    duration: 0,
  });
}

const baseURL = 
 (process.env.NODE_ENV === 'development') ? '/api': `${API_DOMAIN}`

export default (url: string, options: Partial<AxiosRequestConfig> = {}) => {
  const extraHeaders = {}
  const defaultOptions: Partial<AxiosRequestConfig>  = {
    withCredentials: false, // 是否允许携带cookie
  }
  if (localStorage.getItem('token')) {
    Object.assign(extraHeaders, {
      token: localStorage.getItem('token')
    })
  }

  Object.assign(defaultOptions, {
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
      ...options?.headers,
    },
  })

  const newOptions = {
    ...defaultOptions,
    ...{
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options?.headers,
      }
    },
  }

  return axios({
    url, 
    baseURL,
    ...newOptions
  })
  .then((response) => {
    const { data } = response

    return data
  })
  .catch((errorRes) => {
    if (errorRes?.response) {
      errorHandler(errorRes?.response)
    }
  })
}