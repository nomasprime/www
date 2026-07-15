---
name: audit-context-gaps
description: Audit a completed or substantially progressed repository task for evidence-backed engineering friction and context gaps, classify the likely cause, and recommend or record the narrowest durable fix. Use after human corrections, clarifications, difficult repository discovery, conflicting guidance, missing tools or permissions, weak validation, or any edited turn automatically continued by the repository context-gap Stop hook.
---

# Audit Context Gaps

Review evidence from the current task and improve the engineering environment without turning every mistake into more instructions.

## Audit The Run

Look for material friction demonstrated by the task:

- a human correction or clarification changed the result;
- a necessary assumption could not be verified;
- authoritative information was missing, stale, contradictory, or difficult to find;
- a repeatable procedure had to be reconstructed manually;
- a missing tool, permission, fixture, or command blocked progress;
- a deterministic concern depended on human review;
- unreliable or absent validation caused avoidable iteration.

Do not treat ordinary exploration, a unique task requirement, a genuinely novel human decision, or an unsupported guess about model behaviour as a durable gap.

## Diagnose Before Recommending

Choose one primary category:

- `task-definition`: unique intent, scope, acceptance criteria, or non-goals were absent;
- `missing-knowledge`: stable domain or repository knowledge was unavailable;
- `discoverability`: useful knowledge existed but was difficult to locate;
- `contradiction`: relevant sources or instructions disagreed;
- `workflow`: a repeatable procedure was missing or unclear;
- `affordance`: structure, types, examples, templates, or generators did not guide implementation;
- `tooling`: a required command, integration, permission, or data source was unavailable;
- `validation`: a repeatable concern lacked fast, trustworthy verification;
- `human-decision`: the work required new product, design, or architectural judgment;
- `model-capability`: adequate instructions, context, tools, and checks existed but the agent still could not perform the work reliably.

Treat the diagnosis as a hypothesis. Cite concrete evidence from the run.

## Choose A Disposition

Use the narrowest safe response:

1. **Ignore** when the observation is task-specific, immaterial, or weakly evidenced.
2. **Fix now** when the source of truth is clear, the improvement is narrow and in scope, and it can be validated with the current work.
3. **Record a proposal** when the improvement is material but broader, uncertain, cross-team, or needs recurrence before promotion.
4. **Escalate** security, compliance, destructive, or consequential human decisions immediately.

Map recommendations to an appropriate representation:

- task-specific intent -> work item or prompt;
- durable shared knowledge -> documentation, ADR, schema, or source-of-truth system;
- concise repository behaviour or routing -> nearest applicable `AGENTS.md`;
- repeatable procedure -> skill, template, runbook, script, or tool;
- enforceable invariant -> type, test, lint rule, schema check, CI, or hook;
- volatile external fact -> live API, connector, or retrieval source;
- agent limitation -> evaluation, model/runtime change, or bounded human ownership.

Never expand the user's task merely to make a speculative improvement. A recommendation is sufficient.

## Record Material Proposals

Search `.agents/context-gaps/*.json` before creating a record. Update an existing record when the underlying cause and proposed destination match; append one evidence item and set `occurrences` to the evidence count.

Create a new `<id>.json` only when no existing record represents the same gap. Follow `.agents/context-gaps/context-gap.schema.json` and use this shape:

```json
{
  "$schema": "./context-gap.schema.json",
  "id": "short-stable-kebab-case-id",
  "status": "proposed",
  "category": "discoverability",
  "scope": "repository",
  "summary": "One sentence describing the engineering gap.",
  "firstObserved": "YYYY-MM-DD",
  "lastObserved": "YYYY-MM-DD",
  "occurrences": 1,
  "impact": "medium",
  "confidence": "high",
  "evidence": [
    {
      "date": "YYYY-MM-DD",
      "task": "Short task description",
      "observation": "What in the run demonstrates the gap"
    }
  ],
  "recommendation": {
    "target": "The authoritative destination",
    "change": "The smallest durable improvement",
    "verification": "A fresh task or executable check that would prove it helped"
  },
  "resolution": null
}
```

Do not store secrets, private conversation text, personal data, or long transcripts. Paraphrase only the minimum evidence required.

Run the validator after changing records:

```bash
node .agents/skills/audit-context-gaps/scripts/context-gaps.mjs validate
```

List promotion candidates with:

```bash
node .agents/skills/audit-context-gaps/scripts/context-gaps.mjs list --min-occurrences 2
```

## Report The Outcome

If the audit produced a fix or proposal, include a concise `Engineering environment` note in the final response with the evidence, diagnosis, recommendation, and verification. If no material gap exists, finish normally without an empty audit section.
