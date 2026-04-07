/**
 * v1 — Initial baseline
 *
 * This is the starting point for all Veltra repos created before the
 * migration system was introduced. It performs no changes — its only
 * purpose is to establish v1 as the recorded baseline so that v2+
 * migrations know where to start from.
 */

export const version = 1
export const description = 'Establish v1 baseline (no changes)'

export async function check(_root: string): Promise<{ ok: boolean; reason?: string }> {
  return { ok: true }
}

export async function up(_root: string): Promise<void> {
  // No-op. Running this migration simply records that the repo is at v1.
}
