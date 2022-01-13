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

someNumber = 'some-string' // ⛔ fails to compile, string is not a number
```

---

## Literal types (cont.)

But the category of our types can be very specific, so specific they represent a single thing.

```typescript
let aSpecificNumber: 123 = 123
aSpecificNumber = 456 // !! - 456 is not 123

type UniversalPair = ['secret', 42]
let truth: UniversalPair = ['s3cr3t', 42] // ⛔ 's3cr3t' is not 'secret'
```

---

## Literal types (const.)

This also happens when we make constants.

```typescript
let aSpecificString = 'literally-this' as const // ✅ aSpecificString: 'literally-this'
const anotherSpecificString = 'literally-that'  // ✅ anotherSpecificString: 'literally-that'

let someString = 'i-can-be-anything'            // ✅ someString: string
```

---

## Template Literals

TypeScript 4.1 added template literals allowing us to broaden this category of single thing.

```typescript
let someAbstractQuantity: `${string}ful` = 'mouthful'
let invalidQuantity: `${string}ful` = 'mouth' // ⛔ mouth not assignable to ${string}ful

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
let invalid: `${SkiPrefix}${FulSuffix}` = 'skiful' // ⛔ skiful not assignable
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
const heroicVillian: Alignment = 'left-right' // ⛔ 'left-right' is not assignable to
                                              // 'top-left'    | 'top-center'    | 'top-right'    |
                                              // 'middle-left' | 'middle-center' | 'middle-right' |
                                              // 'bottom-left' | 'bottom-center' | 'bottom-right'
```

*Check out more here: https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html*

---

## Property types

A type's properties can be accessed like an object to get a specific property's underlying type.

```typescript
type GeneralUKLocation = {
  country: 'Wales' | 'Scotland' | 'Northern Ireland' | 'England'
  distanceFromLondon: number
  dateFounded: Date
}

let noOneKnowsReally: GeneralUKLocation['country'] = 'Wales'

// ⛔ string is not assignable to type number | Date
let someKindOfUnion: GeneralUKLocation['distanceFromLondon' | 'dateFounded'] = 'France'
```

---

## keyof

Similar to Object.keys we can also get a list of properties in a type using.

```typescript
type Color = {
  name: string
  red: number,
  blue: number,
  green: number
  alpha: number
}

const greenAttr: keyof Color = 'green'
const orangeAttr: keyof Color = 'orange' // ⛔ 'orange' not assignable to
                                         //    'name' | 'red' | 'blue' | 'green' | 'alpha'
```

---

## Generics

We can use generics to write code that doesn't care about all the types.

```typescript
type Greeter = { greet: () => string };

function combineWithGreeter<T, U>(from: T, into: U): Greeter & T & U {
  return Object.assign({greet: () => 'Hi there!'}, from, into);
}

const greetableFriend = combineWithGreeter({name: 'Bob'}, {job: 'Attorney'})
console.log(`${greetableFriend.name} says: ${greetableFriend.greet()}`); // Bob says: Hi there!

console.log(`${greetableFriend.lastName}`) // ⛔ Property 'lastName' does not exist on type
                                           //    'Greeter & { name: string; } & { job: string; }'.
```

Note that `T` and `U` can be inferred, we do not have to call:

```typescript
combineWithGreeter<{ name: string }, { job: string }>({name: 'Bob'}, {job: 'Attorney'})
```

---

## Mapped types
