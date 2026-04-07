/**
 * Veltra CMS — Migration Runner
 *
 * Applies versioned code migrations in order. Each migration in
 * scripts/migrations/ must export: version, description, check(), up()
 *
 * Usage: npm run migrate
 *
 * Rules:
 *  - Migrations run sequentially, numbered from 1 with no gaps
 *  - A failing migration stops the run — subsequent ones will NOT execute
 *  - Skipping a version is not possible; the runner enforces strict order
 *  - .veltra-version is updated after each migration (including skipped ones)
 */

import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

const ROOT = process.cwd()
const MIGRATIONS_DIR = path.join(ROOT, 'scripts', 'migrations')
const VERSION_FILE = path.join(ROOT, '.veltra-version')

interface Migration {
  version: number
  description: string
  check(root: string): Promise<{ ok: boolean; reason?: string }>
  up(root: string): Promise<void>
}

async function loadMigrations(): Promise<Migration[]> {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return []
  }

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.ts') || f.endsWith('.js'))
    .sort()

  const migrations: Migration[] = []
  for (const file of files) {
    const filePath = path.join(MIGRATIONS_DIR, file)
    const mod = await import(pathToFileURL(filePath).href)
    if (typeof mod.version !== 'number' || typeof mod.up !== 'function') {
      console.error(`Invalid migration file: ${file} — must export version (number) and up (function)`)
      process.exit(1)
    }
    migrations.push(mod as Migration)
  }

  return migrations.sort((a, b) => a.version - b.version)
}

function readCurrentVersion(): number {
  if (!fs.existsSync(VERSION_FILE)) {
    // Repos that existed before the migration system are treated as v1.
    // Running migrate will advance them from v1 → latest.
    return 1
  }
  const raw = fs.readFileSync(VERSION_FILE, 'utf-8').trim()
  const n = parseInt(raw, 10)
  if (isNaN(n) || n < 1) {
    console.error(`.veltra-version contains an invalid value: "${raw}"`)
    process.exit(1)
  }
  return n
}

function writeVersion(v: number) {
  fs.writeFileSync(VERSION_FILE, String(v), 'utf-8')
}

async function main() {
  console.log('╔════════════════════════════════════════╗')
  console.log('║     Veltra CMS — Migration Runner      ║')
  console.log('╚════════════════════════════════════════╝\n')

  const migrations = await loadMigrations()

  // Validate: migrations must be numbered 1, 2, 3, ... with no gaps
  for (let i = 0; i < migrations.length; i++) {
    const expected = i + 1
    const actual = migrations[i].version
    if (actual !== expected) {
      console.error(`Migration sequence error:`)
      console.error(`  Expected v${expected}, found v${actual}`)
      console.error(`  Migrations must be numbered sequentially with no gaps.`)
      process.exit(1)
    }
  }

  const currentVersion = readCurrentVersion()
  const latestVersion = migrations.length > 0 ? migrations[migrations.length - 1].version : 0

  console.log(`  Repo version  : v${currentVersion}`)
  console.log(`  Latest version: v${latestVersion}`)

  if (currentVersion > latestVersion) {
    console.log('\n  Version is ahead of known migrations. Nothing to do.')
    return
  }

  const pending = migrations.filter(m => m.version > currentVersion)

  if (pending.length === 0) {
    console.log('\n  Already up to date. Nothing to do.')
    return
  }

  console.log(`\n  Pending: ${pending.length} migration(s)\n`)

  let appliedCount = 0
  let skippedCount = 0

  for (const migration of pending) {
    console.log(`────────────────────────────────────────`)
    console.log(`v${migration.version}: ${migration.description}`)

    // Pre-check: is this migration needed?
    let checkResult: { ok: boolean; reason?: string }
    try {
      checkResult = await migration.check(ROOT)
    } catch (err) {
      console.error(`\n  Pre-check threw an error: ${err}`)
      console.error(`  Migration v${migration.version} aborted.`)
      console.error(`  Subsequent migrations will not run until this is fixed.\n`)
      process.exit(1)
    }

    if (!checkResult.ok) {
      console.log(`  Skipped — ${checkResult.reason ?? 'already applied'}`)
      skippedCount++
    } else {
      try {
        await migration.up(ROOT)
        console.log(`  Applied.`)
        appliedCount++
      } catch (err) {
        console.error(`\n  Migration failed: ${err}`)
        console.error(`  Subsequent migrations will not run until this is fixed.`)
        console.error(`  Current version stays at v${migration.version - 1}.\n`)
        process.exit(1)
      }
    }

    // Advance version regardless of skip (skipped = already at this state)
    writeVersion(migration.version)
    console.log(`  .veltra-version → v${migration.version}`)
  }

  const final = pending[pending.length - 1].version
  console.log(`\n════════════════════════════════════════`)
  console.log(`Done. v${currentVersion} → v${final}  (applied: ${appliedCount}, skipped: ${skippedCount})`)
}

main().catch(err => {
  console.error('\nUnexpected error:', err)
  process.exit(1)
})
