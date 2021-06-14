import Cookies from 'js-cookie'

const TokenKey = 'token'
export default {
  get() {
    const token = sessionStorage.getItem(TokenKey)
    return token ? token : Cookies.get(TokenKey)
  },
  set(token, options = null, isKeep = true) {
    if (!isKeep) {
      return sessionStorage.setItem(TokenKey, token)
    }
    return Cookies.set(TokenKey, token, options)
  },
  remove() {
    const token = sessionStorage.getItem(TokenKey)
    token ? sessionStorage.removeItem(TokenKey) : Cookies.remove(TokenKey)
  }
}
