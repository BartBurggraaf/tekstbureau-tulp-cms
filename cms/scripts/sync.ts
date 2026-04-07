/**
 * Veltra CMS — Sync from upstream
 *
 * Runs the full update sequence in one command:
 *   1. git fetch upstream
 *   2. git merge upstream/main
 *   3. npm run migrate
 *
 * Usage: npm run sync
 *
 * Bails at any step if something needs manual attention (conflicts,
 * missing remote, dirty working tree).
 */

import { spawnSync } from 'child_process'

// ─── helpers ─────────────────────────────────────────────────────────────────

function run(cmd: string): { ok: boolean; stdout: string; stderr: string } {
  const result = spawnSync(cmd, { shell: true, cwd: process.cwd(), encoding: 'utf-8' })
  return {
    ok:     result.status === 0,
    stdout: (result.stdout ?? '').trim(),
    stderr: (result.stderr ?? '').trim(),
  }
}

function step(label: string) {
  console.log(`\n── ${label}`)
}

function fail(message: string, hint?: string): never {
  console.error(`\n  Error: ${message}`)
  if (hint) console.error(`  Hint:  ${hint}`)
  process.exit(1)
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔════════════════════════════════════════╗')
  console.log('║     Veltra CMS — Sync from upstream    ║')
  console.log('╚════════════════════════════════════════╝')

  // 1. Check upstream remote exists
  step('Checking remotes')
  const remotes = run('git remote')
  if (!remotes.stdout.split('\n').map(r => r.trim()).includes('upstream')) {
    fail(
      'No "upstream" remote found.',
      'Add it with:\n  git remote add upstream https://github.com/BartBurggraaf/Veltra-CMS-Base.git'
    )
  }
  console.log('  upstream remote found.')

  // 2. Check for uncommitted local changes
  step('Checking working tree')
  const status = run('git status --porcelain')
  if (status.stdout.length > 0) {
    fail(
      'You have uncommitted local changes.',
      'Commit or stash them first:\n  git stash\n  npm run sync\n  git stash pop'
    )
  }
  console.log('  Working tree is clean.')

  // 3. Fetch upstream
  step('Fetching upstream')
  const fetch = run('git fetch upstream')
  if (!fetch.ok) {
    fail(`git fetch upstream failed.\n  ${fetch.stderr}`)
  }
  console.log('  Fetched.')

  // 4. Check if behind
  const behindResult = run('git rev-list HEAD..upstream/main --count')
  const behindCount  = parseInt(behindResult.stdout, 10)

  if (isNaN(behindCount)) {
    fail('Could not compare with upstream/main. Does the branch exist?')
  }

  if (behindCount === 0) {
    console.log('\n  Already up to date with upstream. Nothing to do.')
    return
  }

  // Show what's incoming
  const log = run('git log HEAD..upstream/main --oneline')
  console.log(`\n  ${behindCount} new commit(s):`)
  log.stdout.split('\n').forEach(l => console.log(`    ${l}`))

  // 5. Merge
  step('Merging upstream/main')
  const merge = run('git merge upstream/main --no-edit')
  if (!merge.ok) {
    // Try to leave the repo in a clean state
    run('git merge --abort')
    fail(
      'Merge failed — conflicts detected. Merge has been aborted.',
      'Resolve manually:\n  git fetch upstream\n  git merge upstream/main\n  # fix conflicts\n  git commit\n  npm run migrate'
    )
  }
  console.log('  Merged successfully.')

  // 6. Run migrations
  step('Running migrations')
  const migrate = run('npm run migrate')
  // Print migration output (it has its own formatting)
  const migrateOutput = (migrate.stdout + (migrate.stderr ? '\n' + migrate.stderr : '')).trim()
  if (migrateOutput) {
    migrateOutput.split('\n').forEach(l => console.log(`  ${l}`))
  }

  if (!migrate.ok) {
    fail(
      'Migrations failed. The merge was applied but migrations need manual attention.',
      'Fix the issue in the failing migration and run:\n  npm run migrate'
    )
  }

  console.log('\n════════════════════════════════════════')
  console.log('Sync complete.')
}

main().catch(err => {
  console.error('\nUnexpected error:', err)
  process.exit(1)
})
