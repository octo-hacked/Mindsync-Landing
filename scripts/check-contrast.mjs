import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tokenSource = readFileSync(resolve(root, 'public/design-tokens.css'), 'utf8')
const appSource = readFileSync(resolve(root, 'src/App.jsx'), 'utf8')
const tokens = new Map(
  [...tokenSource.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]),
)

function colorFromHex(value) {
  const hex = value.slice(1)
  const expanded = hex.length === 3 ? [...hex].map(char => char + char).join('') : hex
  return { channels: [0, 2, 4].map(offset => Number.parseInt(expanded.slice(offset, offset + 2), 16)), alpha: 1 }
}

function resolveColor(name, seen = new Set()) {
  if (seen.has(name)) throw new Error(`Circular color token reference: --${name}`)
  const value = tokens.get(name)
  if (!value) throw new Error(`Missing color token: --${name}`)
  const nextSeen = new Set(seen).add(name)
  const alias = value.match(/^var\(--([\w-]+)\)$/)
  if (alias) return resolveColor(alias[1], nextSeen)
  if (value.startsWith('#')) return colorFromHex(value)

  const mix = value.match(/^color-mix\(in srgb,\s*var\(--([\w-]+)\)\s+([\d.]+)%,\s*(var\(--([\w-]+)\)|transparent)\s*\)$/)
  if (mix) {
    const first = resolveColor(mix[1], nextSeen)
    const firstRatio = Number(mix[2]) / 100
    const second = mix[4] ? resolveColor(mix[4], nextSeen) : { channels: first.channels, alpha: 0 }
    return {
      channels: first.channels.map((channel, index) => {
        const secondChannel = second.alpha ? second.channels[index] : channel
        return channel * firstRatio + secondChannel * (1 - firstRatio)
      }),
      alpha: first.alpha * firstRatio + second.alpha * (1 - firstRatio),
    }
  }
  throw new Error(`Unsupported token value for --${name}: ${value}`)
}

function composite(foreground, background) {
  const alpha = foreground.alpha + background.alpha * (1 - foreground.alpha)
  return {
    channels: foreground.channels.map((channel, index) => {
      if (!alpha) return 0
      return (channel * foreground.alpha + background.channels[index] * background.alpha * (1 - foreground.alpha)) / alpha
    }),
    alpha,
  }
}

function luminance(color) {
  const channels = color.channels.map(channel => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function ratio(foreground, background) {
  const foregroundLuminance = luminance(composite(foreground, background))
  const backgroundLuminance = luminance(background)
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
    / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
}

const pairs = [
  ['text', 'surface', 18, 'Body copy on white'],
  ['text', 'surface-alt', 18, 'Body copy on soft background'],
  ['text', 'surface-panel', 18, 'Body copy on mist panel'],
  ['text-muted', 'surface', 16, 'Secondary copy on white'],
  ['text-muted', 'surface-alt', 16, 'Secondary copy on soft background'],
  ['text-muted', 'surface-panel', 16, 'Secondary copy on mist panel'],
  ['accent-on-light', 'surface', 14, 'Bronze labels on white'],
  ['accent-on-light', 'surface-alt', 14, 'Bronze labels on soft background'],
  ['accent-on-light', 'surface-panel', 14, 'Bronze labels on mist'],
  ['text', 'status-tint', 14, 'Text on gold tint'],
  ['accent-on-light', 'status-tint', 14, 'Bronze on gold tint pills'],
  ['text', 'accent-on-dark', 16, 'Ink on gold CTA'],
  ['text-on-dark', 'accent-status', 14, 'White on teal prototype pill'],
  ['text-on-dark', 'surface-dark', 18, 'White on ink banner'],
  ['text-soft-on-dark', 'surface-dark', 18, 'Mist on ink banner'],
  ['text-on-dark-muted', 'surface-dark', 14, 'Muted text on ink'],
  ['text-on-dark', 'surface-deep', 18, 'White on deep hero/footer'],
  ['text-soft-on-dark', 'surface-deep', 18, 'Mist on deep hero'],
  ['text-on-dark-muted', 'surface-deep', 14, 'Muted text on deep background'],
  ['accent-on-dark', 'surface-dark', 20, 'Gold emphasis on ink'],
  ['accent-on-dark', 'surface-deep', 20, 'Gold emphasis on deep background'],
  ['text-on-dark', 'hover-primary-light', 14, 'White on light-button hover'],
  ['text-on-dark', 'active-primary-light', 14, 'White on light-button active'],
  ['text', 'hover-primary-dark', 14, 'Ink on dark-button hover'],
  ['text', 'active-primary-dark', 14, 'Ink on dark-button active'],
  ['status-error', 'surface', 14, 'Form error on white'],
  ['accent-status', 'surface', 14, 'Form success on white'],
  ['text-on-dark', 'nav-surface', 14, 'Nav link on glass over white', 'surface'],
  ['text-on-dark-muted', 'nav-surface', 14, 'Muted nav text on glass over white', 'surface'],
  ['text-on-dark', 'nav-surface', 14, 'Nav link on glass over soft background', 'surface-alt'],
]

const failures = []
for (const [foregroundName, backgroundName, fontSize, label, backdropName] of pairs) {
  const backgroundToken = resolveColor(backgroundName)
  const backdrop = backdropName ? resolveColor(backdropName) : { channels: [255, 255, 255], alpha: 1 }
  const background = backgroundToken.alpha < 1 ? composite(backgroundToken, backdrop) : backgroundToken
  const contrast = ratio(resolveColor(foregroundName), background)
  const minimum = fontSize >= 24 ? 3 : 4.5
  const result = `${contrast.toFixed(2)}:1 ${contrast >= minimum ? 'PASS' : 'FAIL'} — ${label} (--${foregroundName} / --${backgroundName})`
  console.log(result)
  if (contrast < minimum) failures.push(result)
}

const traceOpacityMatch = appSource.match(/context\.globalAlpha\s*=\s*([0-9.]+)\s*\+\s*trace\s*\*\s*([0-9.]+)/)
if (!traceOpacityMatch) throw new Error('Unable to read the hero waveform trace opacity.')
const maxTraceOpacity = Number(traceOpacityMatch[1]) + 3 * Number(traceOpacityMatch[2])
if (maxTraceOpacity < 0.25 || maxTraceOpacity > 0.3) {
  throw new Error(`Hero waveform opacity ${maxTraceOpacity} is outside the requested 25–30% range.`)
}

const waveformBackground = composite(
  { ...resolveColor('accent-on-dark'), alpha: maxTraceOpacity },
  resolveColor('surface-dark'),
)
const waveformTextPairs = [
  ['text-on-dark', 'Hero headline over maximum waveform trace'],
  ['text-soft-on-dark', 'Hero subheading over maximum waveform trace'],
  ['text-on-dark-muted', 'Hero disclaimer over maximum waveform trace'],
]

for (const [foregroundName, label] of waveformTextPairs) {
  const contrast = ratio(resolveColor(foregroundName), waveformBackground)
  const result = `${contrast.toFixed(2)}:1 ${contrast >= 4.5 ? 'PASS' : 'FAIL'} — ${label}`
  console.log(result)
  if (contrast < 4.5) failures.push(result)
}

if (failures.length) {
  console.error(`\n${failures.length} text/background pair(s) failed WCAG AA.`)
  process.exitCode = 1
} else {
  console.log(`\nAll ${pairs.length + waveformTextPairs.length} used text/background pairs meet WCAG AA.`)
}
