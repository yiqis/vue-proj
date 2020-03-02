var result = {
  session(key, val) {
    window.sessionStorage.setItem(key, val)
  },
  $path(vm, path) {
    vm.$router.push(`/${path}`)
  }
}
export default result
