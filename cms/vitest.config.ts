import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import { readFileSync } from 'fs'

// Load .env.local for local runs — in CI env vars come from GitHub Actions secrets
function loadDotEnv() {
  try {
    const file = readFileSync(resolve(__dirname, '.env.local'), 'utf-8')
    const env: Record<string, string> = {}
    for (const line of file.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx === -1) continue
      const key = trimmed.slice(0, idx).trim()
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
      // Only set if not already set (CI secrets take priority)
      if (key && !process.env[key]) env[key] = val
    }
    return env
  } catch {
    return {}
  }
}

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/unit/**/*.test.ts'],
    env: loadDotEnv(),
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
})
