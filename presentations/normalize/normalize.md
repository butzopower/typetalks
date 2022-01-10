---
theme: default
---

# Type Talks: Normalize

Brian Butz

---

## Literal types

We normally think of types as categorical.

```typescript
let someNumber: number = 123
someNumber = 345

someNumber = 'some-string' // fails to compile, string is not a number
```

---

## Literal types (cont.)

But the category of our types can be very specific, so specific they represent a single thing.

```typescript
let aSpecificNumber: 123 = 123
aSpecificNumber = 456 // !! - 456 is not 123

type UniversalPair = ['secret', 42]
let truth: UniversalPair = ['s3cr3t', 42] // !! - 's3cr3t' is not 'secret'
```

---

## Literal types (const.)

This also happens when we make constants.

```typescript
let aSpecificString = 'literally-this' as const // aSpecificString: 'literally-this'
const anotherSpecificString = 'literally-that'  // anotherSpecificString: 'literally-that'

let someString = 'i-can-be-anything'            // someString: string
```

---

## Template Literals

TypeScript 4.1 added template literals allowing us to broaden this category of single thing.

```typescript
let someAbstractQuantity: `${string}ful` = 'mouthful'
let invalidQuantity: `${string}ful` = 'mouth' // !! - mouth not assignable to ${string}ful

let ski: `ski${string}` = 'ski-ball'

let numericalQuantity: `exactly-${number}-hens` = 'exactly-3-hens'
let numericalQuantity: `exactly-${number}-hens` = 'exactly-2.89204-hens'
```

---

## Template Literals (cont.)

Template literals can also be combined inside template literals.

```typescript
type SkiPrefix = `ski${string}`
type FulSuffix = `${string}ful`


let valid: `${SkiPrefix}${FulSuffix}` = 'skillful'
let invalid: `${SkiPrefix}${FulSuffix}` = 'skiful' // !! - skiful not assignable
                                                   // to `ski${string}${string}ful`

```

---

## Template Literals (other cool stuff)

There's all kinds of neat things you can do with template literals.

```typescript
type VerticalAlignment = "top" | "middle" | "bottom"
type HorizontalAlignment = "left" | "center" | "right"

type Alignment = `${VerticalAlignment}-${HorizontalAlignment}`

const chaoticNeutral: Alignment = 'bottom-center'
const heroicVillian: Alignment = 'left-right' // !! - 'left-right' is not assignable to
                                              // 'top-left'    | 'top-center'    | 'top-right'    |
                                              // 'middle-left' | 'middle-center' | 'middle-right' |
                                              // 'bottom-left' | 'bottom-center' | 'bottom-right'
```

*Check out more here: https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html*

---

## keyof
