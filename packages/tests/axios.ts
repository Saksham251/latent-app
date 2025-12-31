import axios2, {
  AxiosRequestConfig,
  AxiosResponse
} from "axios"

export const axios = {
  async post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<AxiosResponse<T>> {
    try {
      return await axios2.post<T, AxiosResponse<T>, D>(url, data, config)
    } catch (e: any) {
      return e.response
    }
  },

  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await axios2.get<T>(url, config)
    } catch (e: any) {
      return e.response
    }
  },

  async put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<AxiosResponse<T>> {
    try {
      return await axios2.put<T, AxiosResponse<T>, D>(url, data, config)
    } catch (e: any) {
      return e.response
    }
  },

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await axios2.delete<T>(url, config)
    } catch (e: any) {
      return e.response
    }
  }
}
