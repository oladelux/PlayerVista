import Cookies from 'js-cookie'

export const addCookie = (name: string, value: string, expiryDate?: string) => {
  const options = expiryDate ? { expires: new Date(expiryDate) } : undefined
  Cookies.set(name, value, options)
}

export const removeCookie = (name: string) => {
  Cookies.remove(name)
}

export const getCookie = (name: string) => {
  return Cookies.get(name)
}
