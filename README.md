# Tyafe

A lightweight, type-first validation library for TypeScript with zero dependencies.

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

[Sergio Casado](https://github.com/sercrac07)
