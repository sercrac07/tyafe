# Contributing to Tyafe

Thank you for your interest in contributing to Tyafe! This guide will help you get started with development, understand the project structure, and submit high-quality contributions.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Schema Development Guidelines](#schema-development-guidelines)
- [Testing Requirements](#testing-requirements)
- [Type Safety Standards](#type-safety-standards)
- [Code Style Guidelines](#code-style-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Prerequisites

- **Node.js** >= 16.0.0
- **npm** or **yarn** or **bun**
- **Git** for version control
- Familiarity with **TypeScript** and its advanced type system

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/tyafe.git
cd tyafe

# Add the original repository as upstream
git remote add upstream https://github.com/sercrac07/tyafe.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Verify Setup

```bash
# Run tests to ensure everything works
npm test

# Run type checking
npm run typecheck

# Check linting
npm run lint
```

### 4. Start Development

```bash
# Run tests in watch mode for development
npm run test:watch
```

## Project Structure

```
tyafe/
├── src/
│   ├── core/                 # Base classes and core logic
│   │   └── base.ts           # Abstract base class for all schemas
│   ├── primitives/           # Basic type validations
│   │   ├── string.ts         # String validation with various methods
│   │   ├── number.ts         # Number validation
│   │   ├── bigint.ts         # BigInt validation
│   │   ├── boolean.ts        # Boolean validation
│   │   ├── date.ts           # Date validation
│   │   ├── file.ts           # File validation
│   │   ├── literal.ts        # Literal value validation
│   │   ├── symbol.ts         # Symbol validation
│   │   ├── null.ts           # Null value validation
│   │   └── undefined.ts      # Undefined value validation
│   ├── structural/           # Complex data structure validations
│   │   ├── array.ts          # Array validation
│   │   ├── object.ts         # Object validation with mapped types
│   │   ├── record.ts         # Record validation (string keys)
│   │   └── tuple.ts          # Tuple validation (fixed-length arrays)
│   ├── utility/              # Wrapper utilities for optional/nullable
│   │   ├── optional.ts       # Optional wrapper (allows undefined)
│   │   ├── nullable.ts       # Nullable wrapper (allows null)
│   │   └── nullish.ts        # Nullish wrapper (allows null/undefined)
│   ├── special/              # Advanced validation patterns
│   │   ├── any.ts            # Any type validation (escape hatch)
│   │   ├── booleanish.ts     # String to boolean conversion
│   │   ├── union.ts          # Union validation (first match wins)
│   │   ├── intersection.ts   # Intersection validation (all must succeed)
│   │   ├── lazy.ts           # Lazy evaluation for recursive schemas
│   │   └── mutate.ts         # Type transformation between schemas
│   ├── lib/                  # Utility functions
│   │   └── copy.ts           # Deep copying implementation
│   ├── constants.ts          # Error codes and regex patterns
│   ├── errors.ts             # Error classes (TyafeError, TyafeIssue)
│   ├── types.ts              # TypeScript type definitions
│   └── schemas.ts            # Public API factory functions
├── test/                     # Comprehensive test suite
│   ├── utils.ts              # Test utilities (Expect type helper)
│   ├── base.test.ts          # Core functionality tests
│   ├── string.test.ts        # String schema tests
│   ├── number.test.ts        # Number schema tests
│   ├── [schema].test.ts      # One test file per schema
├── biome.json                # Biome configuration for linting/formatting
├── tsconfig.json             # TypeScript configuration
├── tsdown.config.ts          # Build configuration
├── package.json              # Project metadata and scripts
└── README.md
```

## Development Workflow

### Available Scripts

```bash
# Development
npm run test             # Run all tests once
npm run test:watch       # Run tests in watch mode
npm run build            # Build the library

# Code Quality
npm run lint             # Check code style and potential issues
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Biome
npm run typecheck        # Run TypeScript compiler checks
npm run check            # Run every code quality script

# Release
npm run prepublishOnly   # Run all checks before publishing
npm run release          # Build, test, and publish to npm
```

### Development Flow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow [Schema Development Guidelines](#schema-development-guidelines)
   - Add comprehensive tests
   - Ensure type safety

3. **Run Quality Checks**
   ```bash
   npm run test          # All tests must pass
   npm run typecheck     # No TypeScript errors
   npm run lint          # No linting issues
   npm run build         # Build must succeed
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new validation method for string schema"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create Pull Request on GitHub
   ```

## Schema Development Guidelines

### Core Schema Pattern

All schemas must extend `TyafeBase<I, O, ExtraConfig>` with these required elements:

```typescript
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import { deepCopy } from "../lib/copy";
import type { ValidatorConfig } from "../types";

export class TyafeNewSchema extends TyafeBase<InputType, OutputType, { error: string }> {
  // Required: Schema identifier
  public override readonly kind: "newSchema" = "newSchema";

  // Optional: Schema-specific properties
  public readonly customProperty: CustomType;

  constructor(customParam: CustomType, error?: string) {
    super({
      default: undefined,
      fallback: undefined,
      validators: [],
      processors: [],
      preprocessors: [],
      error: error || "Invalid input type: newSchema was expected",
    });
    this.customProperty = customParam;
  }

  // Required: Synchronous parsing logic
  protected override parseFunction(input: unknown): OutputType {
    // 1. Type validation
    if (!isValidType(input)) {
      throw new TyafeIssue([this.buildIssue(ERROR_CODES.CORE.INVALID_TYPE, this._config.error)]);
    }

    // 2. Validation logic
    if (!isValidValue(input)) {
      throw new TyafeIssue([this.buildIssue(ERROR_CODES.NEW_SCHEMA.CUSTOM_ERROR, "Custom error message")]);
    }

    return transform(input);
  }

  // Required: Asynchronous parsing logic
  protected override async parseFunctionAsync(input: unknown): Promise<OutputType> {
    // Usually delegates to sync version, or implements async-specific logic
    return this.parseFunction(input);
  }

  // Required: Deep cloning
  public override clone(): TyafeNewSchema {
    const newThis = new TyafeNewSchema(this.customProperty);
    newThis._config = deepCopy(this._config);
    return newThis;
  }

  // Optional: Schema-specific validation methods
  public customValidation(config?: string | ValidatorConfig): this {
    const issue = this.buildIssue(
      ERROR_CODES.NEW_SCHEMA.CUSTOM_VALIDATION,
      "Custom validation failed",
      config,
    );

    this.validate((value) => (isValidCondition(value) ? null : issue));
    return this;
  }
}
```

### Type Safety Requirements

1. **Use Generic Type Inference**
   ```typescript
   // Preserve input/output types
   export class TyafeArray<T extends TyafeBase<any, any>> extends TyafeBase<
     Input<T>[],    // Array of input types
     Output<T>[]    // Array of output types
   >
   ```

2. **Proper Generic Constraints**
   ```typescript
   // Constrain generics appropriately
   Key extends TyafeBase<string, string>  // Keys must validate to string
   Value extends TyafeBase<any, any>     // Values can be any schema
   ```

3. **Maintain Type Consistency**
   ```typescript
   // Ensure input/output types make sense
   // Use mapped types for objects
   { [K in keyof T]: Output<T[K]> }  // Preserve property types
   ```

### Error Handling Standards

1. **Use Error Codes from Constants**
   ```typescript
   import { ERROR_CODES } from "../constants";
   
   // Use specific error codes
   ERROR_CODES.STRING.MIN
   ERROR_CODES.ARRAY.NON_EMPTY
   ERROR_CODES.CORE.INVALID_TYPE
   ```

2. **Proper Path Tracking for Nested Schemas**
   ```typescript
   // For arrays/objects, prepend index/key to path
   issues.push(
     ...parsed.issues.map((issue) => ({
       ...issue,
       path: [index, ...issue.path],  // Array
       // or path: [key, ...issue.path],  // Object
     })),
   );
   ```

3. **Use buildIssue Helper**
   ```typescript
   // Consistent error creation
   const issue = this.buildIssue(
     ERROR_CODES.CUSTOM.CODE,
     "Error message",
     config,  // string or Partial<Issue>
   );
   ```

### Async/Sync Consistency

Both `parseFunction` and `parseFunctionAsync` must have identical behavior:

```typescript
// Sync version
protected override parseFunction(input: unknown): OutputType {
  if (someAsyncCondition) {
    throw new TyafeError("Async operation must use parseAsync");
  }
  return syncLogic(input);
}

// Async version
protected override async parseFunctionAsync(input: unknown): Promise<OutputType> {
  if (someAsyncCondition) {
    return await asyncLogic(input);
  }
  return this.parseFunction(input);
}
```

## Testing Requirements

### Test Structure

1. **One Test File Per Schema**
   - Name: `[schema].test.ts`
   - Location: `test/` directory

2. **Comprehensive Coverage**
   Each schema test must include:
   - **Definition test**: Verify schema is defined
   - **Success cases**: Valid inputs parse correctly
   - **Failure cases**: Invalid inputs throw appropriate errors
   - **Type inference tests**: Verify TypeScript types
   - **Edge cases**: Boundary conditions and special values
   - **Pipeline tests**: Validate chaining works

### Test Template

```typescript
import { describe, expect, it } from "vitest";
import { type T, t } from "../src";
import type { Expect } from "./utils";

// Type inference tests (compile-time validation)
const _schema = t.newSchema();
const _input: Expect<T.Input<typeof _schema>, ExpectedInputType> = null as any;
const _output: Expect<T.Output<typeof _schema>, ExpectedOutputType> = null as any;

describe("newSchema schema", () => {
  it("should be defined", () => {
    expect(t.newSchema).toBeDefined();
  });

  it("should parse valid input", () => {
    expect(_schema.parse(validInput)).toBe(expectedOutput);
    expect(_schema.parse(validInput2)).toBe(expectedOutput2);
  });

  it("should not parse invalid input", () => {
    expect(() => _schema.parse(invalidInput)).toThrow();
    expect(() => _schema.parse(wrongType)).toThrow();
    expect(() => _schema.parse(boundaryValue)).toThrow();
  });

  it("should handle async validation", async () => {
    const schema = _schema.validate(async (value) => {
      await someAsyncCheck(value);
      return isValid(value) ? null : "Async validation failed";
    });

    expect(await schema.parseAsync(validInput)).toBe(expectedOutput);
    await expect(schema.parseAsync(invalidInput)).rejects.toThrow();
  });

  it("should clone properly", () => {
    const cloned = _schema.clone();
    expect(cloned).not.toBe(_schema);
    expect(cloned.parse(validInput)).toBe(expectedOutput);
  });

  // Pipeline method tests (if applicable)
  it("should support validation chaining", () => {
    const chained = _schema.customValidation();
    expect(chained.parse(validInput)).toBe(expectedOutput);
    expect(() => chained.parse(invalidInput)).toThrow();
  });
});
```

### Type Testing Utility

Use the `Expect<T, U>` utility for compile-time type validation:

```typescript
// Verify Input<T> matches expected type
const _input: Expect<T.Input<typeof _schema>, string> = null as any;

// Verify Output<T> matches expected type  
const _output: Expect<T.Output<typeof _schema>, string> = null as any;
```

### Test Categories

1. **Primitive Schemas**: Test all supported values and type restrictions
2. **Structural Schemas**: Test nested validation and error paths
3. **Utility Schemas**: Test wrapping behavior and null/undefined handling
4. **Special Schemas**: Test complex validation logic and edge cases

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test string.test.ts

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test -- --coverage
```

## Type Safety Standards

### TypeScript Configuration

The project uses strict TypeScript settings. Key requirements:

```json
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Type Development Guidelines

1. **Preserve Type Information**
   ```typescript
   // Good: Preserves specific types
   export type Output<T> = T extends TyafeBase<any, infer O> ? O : never;
   
   // Bad: Loses type information
   export type Output<T> = any;
   ```

2. **Use Conditional Types Appropriately**
   ```typescript
   // For complex type logic
   export type InputIntersection<T> = T extends [infer Head, ...infer Tail]
     ? Input<Head> & InputIntersection<Tail>
     : unknown;
   ```

3. **Provide Type Utilities**
   ```typescript
   // Helpful utility types for consumers
   export type Input<T> = T extends TyafeBase<infer I, any> ? I : never;
   export type Output<T> = T extends TyafeBase<any, infer O> ? O : never;
   ```

## Code Style Guidelines

### Formatting Standards

The project uses **Biome** for consistent formatting and linting:

```json
{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineEnding": "lf",
    "lineWidth": 80
  },
  "linter": {
    "rules": {
      "recommended": true
    }
  }
}
```

### Naming Conventions

| Element | Convention | Example |
| ------- | ---------- | ------- |
| Classes | `PascalCase` with `Tyafe` prefix | `TyafeString`, `TyafeObject` |
| Methods | `camelCase` | `parseFunction`, `validateInput` |
| Properties | `camelCase` | `schema`, `validators` |
| Constants | `UPPER_SNAKE_CASE` | `ERROR_CODES`, `REGEXES` |
| Files | `kebab-case` | `string-schema.ts`, `user-validation.ts` |
| Types | `PascalCase` | `Input<T>`, `Output<T>` |

### Documentation Standards

1. **JSDoc Comments for Public APIs**
   ```typescript
   /**
    * Ensures string length is at least `length`.
    * 
    * @example
    *
    * ```ts
    * const schema = t.string().min(5);
    * schema.parse("hello"); // ✅
    * schema.parse("hi");    // ❌ throws error
    * ```
    */
   public min(length: number, config?: string | ValidatorConfig): this
   ```

2. **Inline Comments for Complex Logic**
   ```typescript
   // Deep copy to prevent mutation of original input
   const result = deepCopy(input);
   
   // Prepend array index to error path for nested validation
   path: [index, ...issue.path]
   ```

### Import Organization

```typescript
// 1. External libraries
import { externalFunction } from "external-library";

// 2. Internal types (sorted alphabetically)
import type { Input, Output, ValidatorConfig } from "../types";

// 3. Internal modules (sorted alphabetically)
import { TyafeBase } from "../core/base";
import { TyafeIssue } from "../errors";
import { deepCopy } from "../lib/copy";
import { ERROR_CODES } from "../constants";
```

## Pull Request Process

### Pre-Submission Checklist

Before submitting a PR, ensure:

- [ ] All tests pass (`npm test`)
- [ ] Type checking succeeds (`npm run typecheck`)
- [ ] No linting errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation is updated (if applicable)
- [ ] Breaking changes are documented

### Pull Request Template

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Added tests for new functionality
- [ ] All existing tests still pass
- [ ] Manual testing performed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review of the code completed
- [ ] Documentation updated if needed
- [ ] TypeScript types are correct
```

### Commit Message Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring without functional changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(string): add UUID validation method
fix(array): handle empty arrays in intersection
docs(readme): update installation instructions
test(number): add infinity handling tests
```

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Minimal Reproduction Example**
   ```typescript
   const schema = t.string().min(5);
   schema.parse("abc"); // Should fail
   ```

2. **Expected vs Actual Behavior**
   - Expected: "Error about minimum length"
   - Actual: "No error thrown"

3. **Environment Information**
   - Node.js version
   - TypeScript version
   - Tyafe version
   - Operating system

4. **Additional Context**
   - Related errors or logs
   - Browser information (if applicable)

### Feature Requests

For feature requests, please include:

1. **Use Case Description**
   - Problem you're trying to solve
   - Current workaround (if any)

2. **Proposed Solution**
   - API design suggestion
   - Example usage

3. **Alternatives Considered**
   - Other approaches you've considered
   - Why they don't work as well

---

Thank you for contributing to Tyafe! Your help makes this project better for everyone. 🚀