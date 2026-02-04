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

  protected override parseFunction(input: unknown): OutputType {
    if (!isValidType(input)) {
      throw new TyafeIssue([
        this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error)
      ]);
    }
    return transform(input);
  }

  protected override async parseFunctionAsync(input: unknown): Promise<OutputType> {
    return this.parseFunction(input);
  }

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
    path: [index, ...issue.path]
  }))
);
```

## Testing Standards

### Test File Structure

```typescript
import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

const _schema = t.newSchema();
const _input: Expect<T.Input<typeof _schema>, ExpectedInputType> = null as any;
const _output: Expect<T.Output<typeof _schema>, ExpectedOutputType> = null as any;

describe("newSchema schema", () => {
  it("should be defined", () => {
    expect(t.newSchema).toBeDefined();
  });

  it("should parse valid input", () => {
    expect(_schema.parse(validInput)).toBe(expectedOutput);
  });

  it("should throw on invalid input", () => {
    expect(() => _schema.parse(invalidInput)).toThrow();
  });
});
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

## Quality Gates

Before submitting changes:
1. **Type Checking**: `npm run typecheck` must pass
2. **Linting**: `npm run lint` must have no errors  
3. **Testing**: `npm test` must pass all tests
4. **Building**: `npm run build` must succeed
5. **Formatting**: Code must be properly formatted

## AI-Specific Guidelines

When implementing features:
1. **Preserve existing patterns** - Don't refactor established patterns without discussion
2. **Maintain type safety** - Ensure TypeScript strict mode compliance
3. **Add comprehensive tests** - Cover success, failure, and edge cases
4. **Document complex logic** - Use JSDoc comments for non-obvious code
5. **Follow import order** - External → Types → Internal (alphabetical)

---

Following these guidelines ensures consistency with the existing codebase and maintains Tyafe's high standards for type safety, performance, and developer experience.
