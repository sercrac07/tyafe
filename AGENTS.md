# AI Agent Development Guide for Tyafe

This file contains development guidelines for AI agents working on the Tyafe TypeScript validation library. Follow these standards to maintain code quality and consistency.

## Development Commands

### Testing Commands

```bash
# Run all tests
npm test

# Run specific test file (preferred method)
npm test -- string.test.ts
npm test -- test/string.test.ts

# Run tests in watch mode for development
npm run test:watch

# Run tests with coverage
npm run test -- --coverage

# Run tests matching pattern
npm test -- "primitive.*"
npm test -- "array.*"
```

### Build & Quality Commands

```bash
# Build the library
npm run build

# Type checking (strict mode)
npm run typecheck

# Linting (Biome)
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code (Biome)
npm run format

# Format with auto-fix
npm run format:fix

# Complete quality check
npm run check
```

## Code Style Guidelines

### Import Organization

Always follow this exact order:

```typescript
// 1. External libraries
import { describe, expect, it } from "vitest";

// 2. Internal types (alphabetical)
import type { Input, Output, ValidatorConfig } from "../types";
import type { Expect } from "./utils";

// 3. Internal modules (alphabetical)
import { ERROR_CODES, REGEXES } from "../constants";
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import { deepCopy } from "../lib/copy";
```

### Formatting Standards (Biome Configuration)

```json
{
  "indentStyle": "space",
  "indentWidth": 2,
  "lineEnding": "lf",
  "lineWidth": 80,
  "arrowParentheses": "always",
  "quoteStyle": "double",
  "semicolons": "always",
  "trailingCommas": "all"
}
```

### Naming Conventions

| Element | Convention | Example |
|---------|-------------|---------|
| Classes | `PascalCase` with `Tyafe` prefix | `TyafeString`, `TyafeObject` |
| Methods | `camelCase` | `parseFunction`, `validateInput` |
| Properties | `camelCase` | `schema`, `validators` |
| Constants | `UPPER_SNAKE_CASE` | `ERROR_CODES`, `REGEXES` |
| Files | `kebab-case` | `string-validator.ts`, `user-schema.ts` |
| Types | `PascalCase` | `Input<T>`, `Output<T>` |

## TypeScript Standards

### Strict Configuration

Project uses strict TypeScript with these key settings:

- `strict: true`
- `exactOptionalPropertyTypes: true`
- `noImplicitOverride: true`
- `noUncheckedIndexedAccess: true`

### Generic Type Patterns

```typescript
// Schema inheritance pattern
export class TyafeNewSchema<T extends TyafeBase<any, any>> extends TyafeBase<
  Input<T>,    // Input type from wrapped schema
  Output<T>,    // Output type from wrapped schema
  { error: string }  // Extra configuration
>

// Type inference utilities
const _input: Expect<T.Input<typeof _schema>, ExpectedInputType> = null as any;
const _output: Expect<T.Output<typeof _schema>, ExpectedOutputType> = null as any;
```

### Type Safety Requirements

1. **Never use `any`** unless absolutely necessary
2. **Prefer `unknown`** for untyped values
3. **Use type guards** for runtime type checking
4. **Preserve generic types** through method chaining
5. **Use `as` casting only when necessary** and document why

## Schema Development Patterns

### Required Schema Structure

```typescript
export class TyafeNewSchema extends TyafeBase<InputType, OutputType, { error: string }> {
  // Required: Schema identifier (literal type)
  public override readonly kind: "newSchema" = "newSchema";

  constructor(error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error: error || "Default error message",
    });
  }

  // Required: Synchronous parsing
  protected override parseFunction(input: unknown): OutputType {
    if (!isValidType(input)) {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error)
      ]);
    }
    return transform(input);
  }

  // Required: Asynchronous parsing (delegate to sync unless async needed)
  protected override async parseFunctionAsync(input: unknown): Promise<OutputType> {
    return this.parseFunction(input);
  }

  // Required: Deep cloning
  public override clone(): TyafeNewSchema {
    const newThis = new TyafeNewSchema();
    newThis._config = deepCopy(this._config);
    return newThis;
  }
}
```

### Error Handling Standards

```typescript
// Always use ERROR_CODES from constants
ERROR_CODES.CORE.INVALID_TYPE
ERROR_CODES.STRING.MIN
ERROR_CODES.NUMBER.POSITIVE

// Use buildIssue helper for consistency
const issue = this.buildIssue(
  ERROR_CODES.STRING.MIN,
  "String must be at least 5 characters",
  config  // string | ValidatorConfig
);

// For nested schemas, prepend path
issues.push(
  ...parsed.issues.map((issue) => ({
    ...issue,
    path: [index, ...issue.path]  // Array
    // or path: [key, ...issue.path]  // Object
  }))
);
```

### Async/Sync Separation

```typescript
// Sync method: Throw error for async operations
protected override parseFunction(input: unknown): OutputType {
  if (isAsyncValidator) {
    throw new TyafeError("Async validator must be parsed with an async parser");
  }
  return syncLogic(input);
}

// Async method: Handle async operations
protected override async parseFunctionAsync(input: unknown): Promise<OutputType> {
  if (isAsyncValidator) {
    return await asyncLogic(input);
  }
  return this.parseFunction(input);
}
```

## Testing Standards

### Test File Structure

```typescript
import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

// Type inference tests (compile-time)
const _schema = t.newSchema();
const _input: Expect<T.Input<typeof _schema>, ExpectedInputType> = null as any;
const _output: Expect<T.Output<typeof _schema>, ExpectedOutputType> = null as any;

describe("newSchema schema", () => {
  it("should be defined", () => {
    expect(t.newSchema).toBeDefined();
  });

  // Success cases: valid inputs should parse
  it("should parse valid input", () => {
    expect(_schema.parse(validInput)).toBe(expectedOutput);
  });

  // Failure cases: invalid inputs should throw
  it("should throw on invalid input", () => {
    expect(() => _schema.parse(invalidInput)).toThrow();
  });

  // Type inference: ensure TypeScript types are correct
  it("should have correct types", () => {
    // This test passes at compile time if types are correct
    const _test: Expect<T.Output<typeof _schema>, ExpectedOutputType> = null as any;
  });
});
```

### Test Coverage Requirements

Every schema must include:

- ✅ Definition test (schema exists)
- ✅ Success cases (valid inputs)
- ✅ Failure cases (invalid inputs, wrong types)
- ✅ Edge cases (boundaries, special values)
- ✅ Clone test (schema cloning works)
- ✅ Pipeline tests (method chaining)
- ✅ Async tests (if applicable)

## File Organization

### Directory Structure

```
src/
├── core/          # Base classes (always extends TyafeBase)
├── primitives/    # Basic types (string, number, etc.)
├── structural/    # Complex structures (object, array, etc.)
├── utility/       # Wrappers (optional, nullable, etc.)
├── special/       # Advanced patterns (union, intersection, etc.)
├── lib/           # Utility functions (copy, etc.)
├── constants.ts   # Error codes, regex patterns
├── types.ts       # Type definitions
├── errors.ts      # Error classes
└── schemas.ts     # Public API factory functions
```

### File Naming

- Schema files: `kebab-case.ts` (e.g., `string-validator.ts`)
- Test files: `schema-name.test.ts` (e.g., `string.test.ts`)
- Type files: `types.ts` (single file for all types)
- Constant files: `constants.ts` (single file for all constants)

## Quality Gates

### Before Submitting Changes

1. **Type Checking**: `npm run typecheck` must pass
2. **Linting**: `npm run lint` must have no errors
3. **Testing**: `npm test` must pass all tests
4. **Building**: `npm run build` must succeed
5. **Formatting**: Code must be properly formatted

### Single Test Development Workflow

```bash
# 1. Run specific test file repeatedly
npm test -- string.test.ts

# 2. Or run tests in watch mode
npm run test:watch

# 3. Focus on specific test pattern
npm test -- "string.*email"

# 4. Check only specific test
npm test -- --reporter=verbose --testNamePattern="email"
```

## Common Patterns

### Method Chaining Return Type

Always return `this` for method chaining:

```typescript
public min(length: number, config?: string | ValidatorConfig): this {
  // Implementation
  return this;  // Enables chaining
}
```

### Deep Copy Usage

Always use `deepCopy` for schema cloning:

```typescript
public override clone(): TyafeNewSchema {
  const newThis = new TyafeNewSchema();
  newThis._config = deepCopy(this._config);  // Required for immutability
  return newThis;
}
```

### Error Creation Pattern

```typescript
// Use buildIssue helper with proper error codes
const issue = this.buildIssue(
  ERROR_CODES.CATEGORY.SPECIFIC_CODE,
  "Human-readable error message",
  config  // string or ValidatorConfig with code, error, path
);
```

## Memory & Performance Guidelines

- Use `deepCopy` only when necessary (schema cloning, immutable returns)
- Prefer early returns in validation methods
- Use Set-based lookups for booleanish values (O(1) performance)
- Lazy evaluation for recursive schemas to prevent infinite loops

## AI-Specific Guidelines

When implementing features:

1. **Preserve existing patterns** - Don't refactor established patterns without discussion
2. **Maintain type safety** - Ensure TypeScript strict mode compliance
3. **Add comprehensive tests** - Cover success, failure, and edge cases
4. **Document complex logic** - Use JSDoc comments for non-obvious code
5. **Follow import order** - External → Types → Internal (alphabetical)

---

Following these guidelines ensures consistency with the existing codebase and maintains Tyafe's high standards for type safety, performance, and developer experience.
