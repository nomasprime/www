#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

let input = ''
for await (const chunk of process.stdin) input += chunk

let event
try {
  event = JSON.parse(input)
} catch {
  console.error('Context-gap hook received invalid JSON input.')
  process.exit(1)
}

const workspace = createHash('sha256')
  .update(event.cwd ?? '')
  .digest('hex')
  .slice(0, 16)
const stateDirectory = join(tmpdir(), 'codex-context-gap-audit', workspace)
const marker = join(stateDirectory, `${event.session_id}-${event.turn_id}.json`)

if (event.hook_event_name === 'PostToolUse') {
  await mkdir(stateDirectory, { recursive: true })
  await writeFile(
    marker,
    JSON.stringify({
      cwd: event.cwd,
      sessionId: event.session_id,
      turnId: event.turn_id,
      editedAt: new Date().toISOString(),
    }),
  )
  process.exit(0)
}

if (event.hook_event_name !== 'Stop') {
  console.log(JSON.stringify({ continue: true }))
  process.exit(0)
}

if (event.stop_hook_active) {
  await rm(marker, { force: true })
  console.log(JSON.stringify({ continue: true }))
  process.exit(0)
}

try {
  await rm(marker)
} catch (error) {
  if (error.code === 'ENOENT') {
    console.log(JSON.stringify({ continue: true }))
    process.exit(0)
  }
  throw error
}

console.log(
  JSON.stringify({
    decision: 'block',
    reason:
      'Use $audit-context-gaps to audit this edited turn before finishing. Review only evidence from this task. Fix a narrow in-scope gap when safe, record a material broader proposal, or finish normally without an audit section when no material gap exists.',
  }),
)
