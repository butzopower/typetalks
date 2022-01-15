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
let alsoNumericalQuantity: `exactly-${number}-hens` = 'exactly-2.89204-hens'
```

---

## Template Literals (cont.)

Template literals can also be combined inside template literals.

```typescript
type SkiPrefix = `ski${string}`
type FulSuffix = `${string}ful`
```

```typescript
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
```

```typescript
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
```

```typescript
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

We can use generics to write code that doesn't care about specific types.

```typescript
type Greeter = { greet: () => string };

function combineWithGreeter<T, U>(from: T, into: U): Greeter & T & U {
  return Object.assign({greet: () => 'Hi there!'}, from, into);
}
```

```typescript
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

## Exclusive Generics

Our generic types don't have to be totally generic:

```typescript
function combineWithGreeter<T, U>(from: T, into: U): Greeter & T & U {
  return Object.assign({greet: () => 'Hi there!'}, from, into);
}
```

```typescript
combineWithGreeter('uh', 'what'); // ✅ compiles, ⚠️ but error at runtime
                                  // Uncaught TypeError: Cannot assign to read only property '0' of object '[object String]'
```

We can use `extends` to limit the allowed types to a subset of types.

```typescript
function combineWithGreeter<T extends object, U extends object>(from: T, into: U): Greeter & T & U {
  return Object.assign({greet: () => 'Hi there!'}, from, into);
}
```

```typescript
combineWithGreeter('uh', 'what'); // ⛔ does not compile
                                  // Argument of type 'string' is not assignable to parameter of type 'object'.
```

---

## Generic types

Generics aren't limited to functions, we can use generics to create types as well.

```typescript
type Gemini<T> = [T, T]
type GreekGod = 'Zeus' | 'Hera' | 'Poseidon' | 'Demeter' | 'Hades'
```

```typescript
const twins: Gemini<string> = ['a', 'b']
const pantheon: Gemini<Gemini<GreekGod>> = [['Zeus', 'Hera'], ['Hades', 'Zeus']]
```

We use generics a lot in the wild (sometimes as interfaces instead of raw types)

```typescript
const promiseMe: Promise<string> = Promise.resolve('forever and ever');
const lostMap: Map<Location, Treasure> = new Map<Location, Treasure>()
const someOf: Partial<{must: string, have: string}> = {} // ✅ compiles as 'must' and 'have' are now optional
```

---

## Mapped types

We can create types based on the properties of other types using `[__ in keyof __]: __`

```typescript
// turns all properties of T into strings
type BallOfYarn<T extends object> = {
  [P in keyof T]: string
}
```

```typescript
const person: {age: number, dob: Date} = {age: 52, dob: new Date()}

const strungOut: BallOfYarn<typeof person> = {age: '174', dob: '08-11-1847'}
```

---

## Mapped types (cont.)

We can even remap the names of keys of a type using `as` and template types

```typescript
type Contrarian<T extends object> = {
  [Property in keyof T as `not_${Property & string}`]: T[Property]
}
```

```typescript
type Person = {
  age: number
  name: string
}

const unPerson: Contrarian<Person> = {
  not_name: 'Bob',
  not_age: 1234
}
```

---

## Conditional types

---

## Conditional types (infer)

---

## Recursion