const KEY = 'admin-token'

export const getToken = () => {
  try { return localStorage.getItem(KEY) || '' } catch { return '' }
}
export const setToken = (t) => {
  try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY) } catch { /* ignore */ }
}

export async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {}
  if (auth) headers.Authorization = `Bearer ${getToken()}`
  let payload = body
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }
  const res = await fetch(`/api${path}`, { method, headers, body: payload })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed.')
    err.status = res.status
    throw err
  }
  return data
}
