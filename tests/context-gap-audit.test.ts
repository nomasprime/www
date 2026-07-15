import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterEach, describe, expect, test } from 'vitest'

const repository = process.cwd()
const validator = resolve(
  repository,
  '.agents/skills/audit-context-gaps/scripts/context-gaps.mjs',
)
const hook = resolve(repository, '.codex/hooks/context-gap-audit.mjs')
const temporaryDirectories: string[] = []

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { force: true, recursive: true })
  }
})

function createWorkspace(record?: Record<string, unknown>) {
  const workspace = mkdtempSync(join(tmpdir(), 'context-gap-test-'))
  temporaryDirectories.push(workspace)
  const records = join(workspace, '.agents/context-gaps')
  mkdirSync(records, { recursive: true })
  if (record) {
    writeFileSync(join(records, `${record.id}.json`), JSON.stringify(record))
  }
  return workspace
}

function runScript(
  script: string,
  input: Record<string, unknown>,
  cwd = repository,
) {
  return spawnSync(process.execPath, [script], {
    cwd,
    encoding: 'utf8',
    input: JSON.stringify(input),
  })
}

function validRecord() {
  return {
    $schema: './context-gap.schema.json',
    id: 'missing-release-command',
    status: 'proposed',
    category: 'discoverability',
    scope: 'repository',
    summary: 'The supported release command is difficult to find.',
    firstObserved: '2026-07-14',
    lastObserved: '2026-07-14',
    occurrences: 1,
    impact: 'medium',
    confidence: 'high',
    evidence: [
      {
        date: '2026-07-14',
        task: 'Release a preview',
        observation: 'The command was not present in repository guidance.',
      },
    ],
    recommendation: {
      target: 'Deployment documentation',
      change: 'Document the supported command.',
      verification: 'Ask a fresh agent to locate and run the command.',
    },
    resolution: null,
  }
}

describe('context gap records', () => {
  test('validates a well-formed record', () => {
    const workspace = createWorkspace(validRecord())
    const result = spawnSync(process.execPath, [validator, 'validate'], {
      cwd: workspace,
      encoding: 'utf8',
    })

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Validated 1 context gap record.')
  })

  test('rejects an occurrence count without matching evidence', () => {
    const record = { ...validRecord(), occurrences: 2 }
    const workspace = createWorkspace(record)
    const result = spawnSync(process.execPath, [validator, 'validate'], {
      cwd: workspace,
      encoding: 'utf8',
    })

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('occurrences must equal evidence length')
  })
})

describe('context gap audit hook', () => {
  test('continues an edited turn once with the audit prompt', () => {
    const id = `test-${Date.now()}-${Math.random()}`
    const common = {
      cwd: repository,
      model: 'test-model',
      permission_mode: 'default',
      session_id: id,
      turn_id: id,
    }

    const edit = runScript(hook, {
      ...common,
      hook_event_name: 'PostToolUse',
      tool_name: 'apply_patch',
    })
    const firstStop = runScript(hook, {
      ...common,
      hook_event_name: 'Stop',
      stop_hook_active: false,
    })
    const secondStop = runScript(hook, {
      ...common,
      hook_event_name: 'Stop',
      stop_hook_active: true,
    })

    expect(edit.status).toBe(0)
    expect(JSON.parse(firstStop.stdout)).toMatchObject({
      decision: 'block',
    })
    expect(JSON.parse(secondStop.stdout)).toEqual({ continue: true })
  })

  test('does not request an audit for an unedited turn', () => {
    const id = `test-${Date.now()}-${Math.random()}`
    const result = runScript(hook, {
      cwd: repository,
      hook_event_name: 'Stop',
      model: 'test-model',
      permission_mode: 'default',
      session_id: id,
      stop_hook_active: false,
      turn_id: id,
    })

    expect(result.status).toBe(0)
    expect(JSON.parse(result.stdout)).toEqual({ continue: true })
  })
})
