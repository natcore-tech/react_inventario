// src/infrastructure/http/axios-client.ts
import axios, { type AxiosRequestConfig } from 'axios'
import { API_CONFIG } from '@/infrastructure/config/api.config'
import { localTokenStorage } from '@/infrastructure/storage/local-token-storage'
import { ApiException } from '@/domain/exceptions/api.exception'
import { parseApiError } from './parse-api-error'

/**
 * Evento personalizado que se dispara en window cuando la sesión expira
 * de forma irrecuperable (refresh token inválido o caducado).
 * El AuthStore escucha este evento para limpiar el estado de usuario.
 */
export const AUTH_EXPIRED_EVENT = 'authExpired'

/** Tipo del detalle del evento authExpired. */
export interface AuthExpiredEventDetail {
  reason: string
}

// ─── Instancia Axios ─────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request interceptor ─────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  (config) => {
    const token = localTokenStorage.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(parseApiError(error)),
)

// ─── Response interceptor ────────────────────────────────────────────────────

let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

// Flag de un solo disparo para el evento de sesión expirada (evita múltiples disparos concurrentes)
let authExpiredDispatched = false

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

function notifySubscribers(token: string) {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

/**
 * Dispara el evento authExpired una única vez (debounced).
 * Múltiples peticiones concurrentes con 401 solo producen un evento.
 */
function dispatchAuthExpiredOnce(reason: string) {
  if (authExpiredDispatched) return
  authExpiredDispatched = true
  // Resetear el flag después de un ciclo para permitir futuros eventos
  setTimeout(() => { authExpiredDispatched = false }, 3000)
  const event = new CustomEvent<AuthExpiredEventDetail>(AUTH_EXPIRED_EVENT, {
    detail: { reason },
  })
  window.dispatchEvent(event)
}

/**
 * Para peticiones GET que reciben 401 (endpoints públicos protegidos por el backend),
 * resolvemos silenciosamente con datos vacíos en lugar de propagar el error.
 * Esto evita que los stores de Zustand actualicen el estado en bucle.
 */
function resolveEmptyForPublicGet(originalRequest: AxiosRequestConfig & { _retry?: boolean }) {
  if (originalRequest.method?.toUpperCase() === 'GET') {
    return Promise.resolve({ data: [], results: [] } as any)
  }
  return null
}

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Errores que no son 401 o reintentos ya marcados: pasar directamente
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(parseApiError(error))
    }

    // Marcar para evitar bucle de reintento
    originalRequest._retry = true

    const refreshToken = localTokenStorage.getRefreshToken()

    if (!refreshToken) {
      // Sin token de refresh: limpiar y disparar evento (una sola vez)
      localTokenStorage.clearTokens()
      dispatchAuthExpiredOnce('No refresh token available')

      // Para GET públicos: retornar datos vacíos silenciosamente (sin propagar excepción)
      const emptyResponse = resolveEmptyForPublicGet(originalRequest)
      if (emptyResponse) return emptyResponse

      return Promise.reject(
        new ApiException(401, 'Sesión expirada. Por favor inicia sesión de nuevo.'),
      )
    }

    if (isRefreshing) {
      // Refresh en curso: encolar
      return new Promise<string>((resolve) => {
        subscribeTokenRefresh(resolve)
      }).then((newToken) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }
        return apiClient(originalRequest)
      })
    }

    isRefreshing = true

    try {
      const { data } = await axios.post<{ access: string }>(
        `${API_CONFIG.BASE_URL}/auth/token/refresh/`,
        { refresh: refreshToken },
        { timeout: API_CONFIG.TIMEOUT },
      )

      const newAccessToken = data.access
      localTokenStorage.setTokens(newAccessToken, refreshToken)
      notifySubscribers(newAccessToken)

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      }

      return apiClient(originalRequest)
    } catch {
      // Refresh falló: sesión irrecuperable
      localTokenStorage.clearTokens()
      refreshSubscribers = []
      dispatchAuthExpiredOnce('Refresh token invalid or expired')

      // Para GET públicos: retornar datos vacíos silenciosamente
      const emptyResponse = resolveEmptyForPublicGet(originalRequest)
      if (emptyResponse) return emptyResponse

      return Promise.reject(
        new ApiException(401, 'Tu sesión ha expirado. Por favor inicia sesión de nuevo.'),
      )
    } finally {
      isRefreshing = false
    }
  },
)