import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const themeColorMeta = document.querySelector('meta[name="theme-color"]')
const syncThemeColor = () => {
  const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()
  if (themeColorMeta && themeColor) themeColorMeta.setAttribute('content', themeColor)
}

const syncFavicon = () => {
  const tokens = getComputedStyle(document.documentElement)
  const ink = tokens.getPropertyValue('--ink').trim()
  const white = tokens.getPropertyValue('--white').trim()
  const gold = tokens.getPropertyValue('--gold').trim()
  const favicon = document.querySelector('link[rel="icon"]')

  if (!favicon) throw new Error('The page is missing its favicon link.')
  if (!ink || !white || !gold) throw new Error('The favicon color tokens are unavailable.')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="${ink}"/><path d="M10 34V14l14 14 14-14v20" fill="none" stroke="${white}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/><circle cx="38" cy="14" r="3" fill="${gold}"/></svg>`
  favicon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`
}

syncThemeColor()
syncFavicon()
window.addEventListener('load', syncThemeColor, { once: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
