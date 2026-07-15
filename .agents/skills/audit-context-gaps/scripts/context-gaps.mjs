#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const categories = new Set([
  'task-definition',
  'missing-knowledge',
  'discoverability',
  'contradiction',
  'workflow',
  'affordance',
  'tooling',
  'validation',
  'human-decision',
  'model-capability',
])
const statuses = new Set(['proposed', 'accepted', 'resolved', 'rejected'])
const impacts = new Set(['low', 'medium', 'high', 'critical'])
const confidences = new Set(['low', 'medium', 'high'])
const datePattern = /^\d{4}-\d{2}-\d{2}$/
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const args = process.argv.slice(2)
const command = args.shift() ?? 'list'
const directory = resolve(process.cwd(), '.agents/context-gaps')

function option(name, fallback) {
  const index = args.indexOf(name)
  return index === -1 ? fallback : args[index + 1]
}

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function validateRecord(record, filename) {
  const errors = []
  const add = (condition, message) => {
    if (!condition) errors.push(`${filename}: ${message}`)
  }

  add(
    record && typeof record === 'object' && !Array.isArray(record),
    'must contain an object',
  )
  if (!record || typeof record !== 'object' || Array.isArray(record))
    return errors

  add(
    record.$schema === './context-gap.schema.json',
    '$schema must be ./context-gap.schema.json',
  )
  add(nonEmpty(record.id) && idPattern.test(record.id), 'id must be kebab-case')
  add(filename === `${record.id}.json`, 'filename must match id')
  add(statuses.has(record.status), 'status is invalid')
  add(categories.has(record.category), 'category is invalid')
  add(nonEmpty(record.scope), 'scope is required')
  add(nonEmpty(record.summary), 'summary is required')
  add(
    datePattern.test(record.firstObserved),
    'firstObserved must be YYYY-MM-DD',
  )
  add(datePattern.test(record.lastObserved), 'lastObserved must be YYYY-MM-DD')
  add(
    Number.isInteger(record.occurrences) && record.occurrences > 0,
    'occurrences must be a positive integer',
  )
  add(impacts.has(record.impact), 'impact is invalid')
  add(confidences.has(record.confidence), 'confidence is invalid')
  add(
    Array.isArray(record.evidence) && record.evidence.length > 0,
    'evidence must be a non-empty array',
  )

  if (Array.isArray(record.evidence)) {
    add(
      record.occurrences === record.evidence.length,
      'occurrences must equal evidence length',
    )
    record.evidence.forEach((item, index) => {
      add(
        item && typeof item === 'object',
        `evidence[${index}] must be an object`,
      )
      if (!item || typeof item !== 'object') return
      add(
        datePattern.test(item.date),
        `evidence[${index}].date must be YYYY-MM-DD`,
      )
      add(nonEmpty(item.task), `evidence[${index}].task is required`)
      add(
        nonEmpty(item.observation),
        `evidence[${index}].observation is required`,
      )
    })
  }

  add(
    record.recommendation && typeof record.recommendation === 'object',
    'recommendation is required',
  )
  if (record.recommendation && typeof record.recommendation === 'object') {
    add(
      nonEmpty(record.recommendation.target),
      'recommendation.target is required',
    )
    add(
      nonEmpty(record.recommendation.change),
      'recommendation.change is required',
    )
    add(
      nonEmpty(record.recommendation.verification),
      'recommendation.verification is required',
    )
  }

  if (record.resolution !== null) {
    add(
      record.resolution && typeof record.resolution === 'object',
      'resolution must be null or an object',
    )
    if (record.resolution && typeof record.resolution === 'object') {
      add(
        datePattern.test(record.resolution.date),
        'resolution.date must be YYYY-MM-DD',
      )
      add(nonEmpty(record.resolution.change), 'resolution.change is required')
      add(
        nonEmpty(record.resolution.verification),
        'resolution.verification is required',
      )
    }
  }

  return errors
}

async function loadRecords() {
  const filenames = (await readdir(directory))
    .filter(
      (filename) =>
        filename.endsWith('.json') && filename !== 'context-gap.schema.json',
    )
    .sort()

  const records = []
  const errors = []
  for (const filename of filenames) {
    try {
      const record = JSON.parse(
        await readFile(resolve(directory, filename), 'utf8'),
      )
      errors.push(...validateRecord(record, filename))
      records.push(record)
    } catch (error) {
      errors.push(`${filename}: ${error.message}`)
    }
  }
  return { records, errors }
}

const { records, errors } = await loadRecords()
if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exit(1)
}

if (command === 'validate') {
  console.log(
    `Validated ${records.length} context gap record${records.length === 1 ? '' : 's'}.`,
  )
  process.exit(0)
}

if (command === 'list') {
  const minimum = Number.parseInt(option('--min-occurrences', '1'), 10)
  if (!Number.isInteger(minimum) || minimum < 1) {
    console.error('--min-occurrences must be a positive integer')
    process.exit(1)
  }

  const impactOrder = { critical: 4, high: 3, medium: 2, low: 1 }
  const selected = records
    .filter(
      (record) => record.status === 'proposed' && record.occurrences >= minimum,
    )
    .sort(
      (left, right) =>
        right.occurrences - left.occurrences ||
        impactOrder[right.impact] - impactOrder[left.impact] ||
        left.id.localeCompare(right.id),
    )

  if (selected.length === 0) {
    console.log('No matching context gap proposals.')
    process.exit(0)
  }

  for (const record of selected) {
    console.log(
      `${record.id}\t${record.occurrences}\t${record.impact}\t${record.confidence}\t${record.category}\t${record.summary}`,
    )
  }
  process.exit(0)
}

console.error('Usage: context-gaps.mjs <validate|list> [--min-occurrences N]')
process.exit(1)
