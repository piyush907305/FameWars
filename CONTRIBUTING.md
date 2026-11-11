# Contributing

Phase 1 was approved by the owner; see docs/18-phase1-approved-baseline.md. v0.1.0 is the placeholder combat prototype. Do not start Phase 2, add paid services or publish a public production release without approval.

Use short branches (`docs/round-rules`, `feat/input`), focused commits and PRs linked to an issue/milestone. Keep main releasable. Owner reviews even solo changes; record self-review when no second reviewer exists. Required checks/branch protection must actually be enabled in GitHub; the scaffold does not configure them.

Code convention planned: strict TypeScript; explicit types at public module boundaries; no `any` without a documented reason; pure simulation transitions; named units (`ticks`, `mm`, `basisPoints`); stable IDs; formatting through Prettier and linting through ESLint. React state never owns combat state. Runtime schemas reject unknown fields. No dependency introduced without licence, size and maintenance review. Use conventional commit prefixes and ADRs for material decisions.

PRs include scope, acceptance criteria, evidence, performance impact, privacy/content impact and rollback. Test behavior and edge cases rather than mirroring code. Simulation changes need replay/hash tests; rendering changes need device evidence; documentation changes need link review. Assets require per-file provenance and commercial clearance before inclusion. Never commit keys, private permissions/contracts, personal data, or generated celebrity material.

Tag `v0.x.y` releases; pre-1.0 breaking schema/protocol changes increment minor, compatible fixes increment patch. Track sim/content/protocol versions separately. Preserve save migrations and compatible deployment pairs. A tag alone is not a release gate. Phase 0 local tag is a definition snapshot only.
