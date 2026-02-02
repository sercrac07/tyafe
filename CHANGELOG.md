# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.0.1 - 

### Added

- Initial release
- Runtime schema factories:
  - Primitives: `string` (`nonEmpty`, `min`, `max`, `regex`, `email`, `url`), `number` (`min`, `max`, `integer`, `positive`, `negative`), `bigint` (`min`, `max`, `positive`, `negative`), `boolean`, `symbol`, `undefined`, `null`, `literal`, `date` (`min`, `max`), `file` (`min`, `max`, `mime`)
  - Structural: `array` (`nonEmpty`, `min`, `max`), `object`, `record`, `tuple`
  - Special: `booleanish`, `union`, `intersection`
  - Utility: `optional`, `nullable`, `nullish`
- Core parsing APIs: `parse`, `parseAsync`, `safeParse`, `safeParseAsync`
- Error model: `TyafeIssue` with `Issue[]`, `TyafeError`
- Type utilities: `Input`, `Output`, `Default`, `Validator`, `Processor`, `Preprocessor`, `MaybePromise`
- Test suite with `vitest` covering all schemas and base functionality
- Package exports: `t` (schemas), `ERROR_CODES`, `TyafeError`, `TyafeIssue`, `T` (types)
- Documentation: README with Quick Start and examples
