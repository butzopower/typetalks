type digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type StrToNumber<X extends string> = _IsNumberString<X> extends true ? _StrToNumber<X, []> : never;
type _IsNumberString<X extends string> = X extends `${infer first}${infer rest}` ? first extends digit ? true : false : false;
type _StrToNumber<X extends string, Count extends unknown[]> =
  `${Count['length']}` extends X ? Count['length'] : _StrToNumber<X, [unknown, ...Count]>

export type EqualTo<X extends number, Y extends number> = X extends Y ?  Y extends X ? true : false : false;

export type IsNegative<X extends number> = `${X}` extends `-${infer rest}` ? true : false;
export type Abs<X extends number> = `${X}` extends `-${infer rest}` ? StrToNumber<rest> : X;

export type GreaterThan<X extends number, Y extends number> = EqualTo<X, Y> extends true ? false :
  IsNegative<X> extends true ?
    IsNegative<Y> extends true ? GreaterThan<Abs<Y>, Abs<X>> : false :
    IsNegative<Y> extends true ? true : _GreaterThan<X, Y, []>;

type _GreaterThan<X extends number, Y extends number, Count extends unknown[]> =
  Count['length'] extends Y ? true :
    Count['length'] extends X ? false :
      _GreaterThan<X, Y, [unknown, ...Count]>;

export type LessThan<X extends number, Y extends number> = EqualTo<X, Y> extends true ? false : GreaterThan<X, Y> extends true ? false : true;

// tests
const zeroEqualsZero: EqualTo<0, 0> = true;
const numberEqualsNumber: EqualTo<number, number> = true;
const zeroDoesNotEqualOne: EqualTo<0, 1> = false;
const oneDoesNotEqualZero: EqualTo<0, 1> = false;
const numberDoesNotEqualZero: EqualTo<number, 0> = false;
const zeroDoesNotEqualNumber: EqualTo<0, number> = false;

const isNegativeIsFalseForZero: IsNegative<0> = false;
const isNegativeIsFalseForOne: IsNegative<1> = false;
const isNegativeIsTrueForNegativeOne: IsNegative<-1> = true;

const strToNumberString0IsZero: StrToNumber<'0'> = 0;
const strToNumberString1IsOne: StrToNumber<'1'> = 1;
const strToNumberString123IsOneHundredTwentyThree: StrToNumber<'123'> = 123;
let strToNumberForFooIsNever: StrToNumber<'foo'>;

const absZeroIsZero: Abs<0> = 0;
const absOneIsOne: Abs<1> = 1;
const absNegativeOneIsOne: Abs<-1> = 1;

const zeroNotGreaterThanZero: GreaterThan<0, 0> = false;
const oneGreaterThanZero: GreaterThan<1, 0> = true;
const zeroNotGreaterThanOne: GreaterThan<0, 1> = false;
const negativeOneNotGreaterThanZero: GreaterThan<-1, 0> = false;
const zeroGreaterThanNegativeOne: GreaterThan<0, -1> = true;
const negativeOneGreaterThanNegativeTwo: GreaterThan<-1, -2> = true;

const zeroNotLessThanZero: LessThan<0, 0> = false;
const oneNotLessThanZero: LessThan<1, 0> = false;
const zeroLessThanOne: LessThan<0, 1> = true;