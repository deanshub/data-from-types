# Data From Types
This thing generates data from TypeScript types

<!-- ## Install
`npm install -S -D data-from-types` -->

## Usage
you have the file:

```ts
// test-file.ts

export interface Person {
  firstName: string;
  lastName: string;
  age: number;
}
```

you want to generate data based on the interfaces

```ts
// my.spec.ts

import * as DataFromTypes from "data-from-types";

const generatedData = DataFromTypes.getData('./test-file.ts')

expect(generatedData).toHaveProperty("Person");
expect(generatedData.Person).toHavePropertyOfType("firstName", "string");
expect(generatedData.Person).toHavePropertyOfType("lastName", "string");
expect(generatedData.Person).toHavePropertyOfType("age", "number");
```
