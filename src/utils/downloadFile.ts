export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob)

  // Virtual anchor element to trigger the download
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Revoke the object URL to release memory
  window.URL.revokeObjectURL(url)
}
