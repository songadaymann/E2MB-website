export function assetPath(relativePath = '') {
  if (!relativePath) return import.meta.env.BASE_URL

  const trimmedPath = relativePath.replace(/^\/+/, '')
  return `${import.meta.env.BASE_URL}${trimmedPath}`
}
