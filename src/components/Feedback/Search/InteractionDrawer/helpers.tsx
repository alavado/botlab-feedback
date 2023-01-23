export const openExternalLink = (url: string) => {
  const el = document.createElement('a')
  el.setAttribute('target', '_blank')
  el.setAttribute('href', url)
  el.style.display = 'none'
  document.body.appendChild(el)
  el.click()
  document.body.removeChild(el)
}
