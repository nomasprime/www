# Repository Guidance

## Engineering Environment Feedback

- After a turn that changes repository files, run the `audit-context-gaps` skill before finishing. The repository Stop hook requests this automatically for supported edit tools.
- Treat friction as evidence to diagnose, not automatic proof that more prompt context is required.
- Fix a gap during the current task only when the source of truth is clear, the change is narrow and in scope, and the improvement can be validated.
- Record broader or uncertain material findings in `.agents/context-gaps/`; do not record task-specific details, secrets, personal data, or generic model mistakes.
- Report an engineering-environment recommendation only when the audit finds a material gap. Do not add an empty audit section to normal results.

## Validation

- Run `CI=true pnpm run build` for the full site check and production build.
- A missing `node_modules/.vite/deps_ssr` chunk while another local process is active is a known repository validation failure, not evidence of a content error. See `.agents/context-gaps/site-build-vite-cache-race.json`; the build does not yet have a reliable concurrent-process workaround.
