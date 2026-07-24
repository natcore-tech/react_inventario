export const SESSION_TOKEN_KEY = 'token'

export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(SESSION_TOKEN_KEY) || localStorage.getItem('inventario_access')
}

export function hasActiveSessionToken(): boolean {
  return getSessionToken() !== null
}

export function buildLoginRedirectState(fromPath: string, message: string) {
  return {
    from: { pathname: fromPath },
    message,
  }
}