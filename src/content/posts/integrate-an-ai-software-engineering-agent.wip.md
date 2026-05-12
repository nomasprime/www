## Guardrails

1. Local (eg, Lefthook)
2. Remote CI
3. Runtime (eg, logs, traces, metrics)

Types:

- Tests (smoke, performance, observability)
- Dependency
- Security
- Compliance

## Refactoring
Refactoring also becomes more important to correct for drift

- TDD
- Existing code, shapes and abstractions 
- Docs
- Templates

## PR-Based Flow

A PR is the smallest atomic deployable change. If multiple PRs make up a larger feature, they could be deployed gradually behind a feature flag.

Git commits are the steps (squashed at the end to keep history clean).

### Planning

1. Human and agent develop a plan from a template (supported by skill?)
2. When ready, a PR’s created (CLI or MCP?)
3. The plan’s reviewed and merged

Part of the skill here should be to ask for anything it’s unclear about.

#### Template

Versioned, like any other prompt, as a JetBrains project template, bootstrapped with Copier.

```markdown
# <title>

## Why

## What

<bddSpecs>

## How

<notes>
```

#### Other Criteria

Who could be added if we expand on the task management through PRs idea, otherwise it’ll just be whoever commits.

Where could just be this repo, or across repos if the change is driven from a higher level.

When would be asap for learn or it could be based on criteria (eg, time) and exposed around a feature flag.

### How

1. System or end-to-end tests
2. Initially mock collaborators
3. When test passes create the real object and tests
4. Work down until entire change’s implemented

Generation happens incrementally.

While working, due to degradation, we should keep loops short and bread crumbing for the next loop.

### Review

Requires two approvals:

- Different agent
- Human

We should also have additional checks around documentation (if we’re really implementing this as code), including documented mini retrospectives.

Anything repeated is missing context and should be persisted.

## Metrics

- First-pass acceptance rate
- Iteration cycles

Can bake this into the Claude reviewer we’re building.

## BDD

Testing:

- Hypothesis, example, or property based (inputs)
- Mutations (code itself)

## Git

How to use commit messages? I feel like this is a natural place to preserve ongoing thinking around the current work, there’s also the PR comments.

Think of Vitamin-R flow, breadcrumbs, etc.

To understand the model we need it to explain each change (we get a diff and commit message with Git).