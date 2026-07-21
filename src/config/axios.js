import axios from 'axios'

export const backendurl = process.env.REACT_APP_BACKEND_URL || 'https://wechat-backend-fob0.onrender.com/'

const api = axios.create({
  baseURL: backendurl,
  withCredentials: true,
})

// Single in-memory source of truth for the current access token. Call this
// after login/signup/refresh so every request picks up the latest token.
let accessToken = null

export const setAccessToken = (token) => {
  accessToken = token
}

export const getAccessToken = () => accessToken

// Attach the current access token to every outgoing request. This always
// overrides any header a caller set manually, so there's one source of truth
// instead of components reading a possibly-stale token out of context.
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// On a 401, try exactly once to refresh the access token (the refresh cookie
// is sent automatically via withCredentials) and replay the original request.
// If refreshing itself fails, the session is truly over: clear the token and
// let the rest of the app know via a DOM event (this file has no access to
// react-router/context) so it can clear user state and redirect to login.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isRefreshRequest = originalRequest?.url?.includes('/user/refresh')

    if (error.response?.status === 401 && !originalRequest?._retry && !isRefreshRequest) {
      originalRequest._retry = true
      try {
        const { data } = await api.post('/user/refresh')
        setAccessToken(data.token)
        originalRequest.headers.Authorization = `Bearer ${data.token}`
        return api(originalRequest)
      } catch (refreshError) {
        setAccessToken(null)
        window.dispatchEvent(new Event('auth:logout'))
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
