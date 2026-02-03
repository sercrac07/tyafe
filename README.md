<div align="center">

  # Tyafe

  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?colorA=313244&colorB=74c7ec&style=for-the-badge)
  ![Bundle Size](https://img.shields.io/bundlephobia/minzip/tyafe?colorA=313244&colorB=94e2d5&style=for-the-badge)
  ![Tests](https://img.shields.io/badge/tests-passing-green?colorA=313244&colorB=a6e3a1&style=for-the-badge)
  ![License](https://img.shields.io/badge/License-MIT-green?colorA=313244&colorB=f9e2af&style=for-the-badge)

  A lightweight, type-first validation library for TypeScript with zero dependencies.

</div>


## Why Tyafe?

`Tyafe` provides runtime validation with full TypeScript type inference. Define your schemas once and get both validation and type safety automatically.

```ts
import { t } from "tyafe";

const userSchema = t.object({
  username: t.string(),
  age: t.number(),
});

const input = {
  username: "john_doe",
  age: 25,
};

const data = userSchema.parse(input);
// Data is fully typed: { username: string; age: number }

console.log(data.username); // TypeScript knows this is a string
```

## Features

- **Zero dependencies** - Lightweight and fast
- **Type-first** - Full TypeScript inference out of the box
- **Minimal API** - Simple and intuitive to use
- **Functional** - Composable validation schemas

## Installation

```bash
npm install tyafe
```

## Quick Start

```ts
import { t } from "tyafe";

// Define schemas
const userSchema = t.object({
  username: t.string().min(3).max(20),
  email: t.string().email(),
  age: t.number().min(18).positive(),
  preferences: t.optional(t.object({
    theme: t.union([t.literal("light"), t.literal("dark")]),
    notifications: t.boolean(),
  })),
  createdAt: t.date().max(new Date()),
});

// Parse input
const result = userSchema.parse(userInput);
// Fully typed result: { username: string; email: string; age: number; preferences?: { theme: "light" | "dark"; notifications: boolean }; createdAt: Date }
```

## API Reference

### Schemas

#### Primitives

- `t.string()` - String validation
- `t.number()` - Number validation
- `t.bigint()` - BigInt validation
- `t.boolean()` - Boolean validation
- `t.date()` - Date validation
- `t.symbol()` - Symbol validation
- `t.literal()` - Literal value validation
- `t.null()` - Null value validation
- `t.undefined()` - Undefined value validation

#### Structural

- `t.array()` - Array validation
- `t.object()` - Object validation
- `t.record()` - Record validation
- `t.tuple()` - Tuple validation

#### Utilities

- `t.optional()` - Optional values
- `t.nullable()` - Nullable values
- `t.nullish()` - Nullish values

#### Special

- `t.union()` - Union validation
- `t.intersection()` - Intersection validation
- `t.lazy()` - Lazy evaluation
- `t.mutate()` - Type transformation
- `t.booleanish()` - String boolean mapping
- `t.any()` - Any type validation

### Methods

#### `parse(input)`

Parses input and returns the output type. Throws `TyafeIssue` if validation fails.

```ts
const data = schema.parse(input);
```

#### `parseAsync(input)`

Asynchronously parses input. Supports async validators/processors.

```ts
const data = await schema.parseAsync(input);
```

#### `safeParse(input)`

Safely parses input and returns a `Result` instead of throwing.

```ts
const result = schema.safeParse(input);

if (result.success) {
  console.log(result.data);
} else {
  console.log(result.issues);
}
```

### Pipeline Methods

```ts
schema
  .default(value)  // Default value
  .fallback(value) // Fallback on failure
  .validate(fn)    // Custom validator
  .process(fn)     // Data transformation
  .preprocess(fn)  // Input preprocessing
```

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for detailed information on:

- Development setup and workflow
- Code style and testing requirements  
- Schema development guidelines
- Pull request process

### Quick Start

```bash
# Clone your fork
git clone https://github.com/your-username/tyafe.git
cd tyafe

# Install dependencies
npm install

# Run tests to verify setup
npm test

# Start development (watch mode)
npm run test:watch
```

### Reporting Issues

- Use [GitHub Issues](https://github.com/sercrac07/tyafe/issues) for bug reports
- Provide minimal reproduction examples
- Include TypeScript version and environment details

## License

MIT

## Author

[Sergio Casado](https://github.com/sercrac07)
