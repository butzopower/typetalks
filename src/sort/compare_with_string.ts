type digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type StrToNumber<X extends string> = _IsNumberString<X> extends true ? _StrToNumber<X, []> : never;
type _IsNumberString<X extends string> = X extends `${infer first}${infer rest}` ? first extends digit ? true : false : false;
type _StrToNumber<X extends string, Count extends unknown[]> =
  `${Count['length']}` extends X ? Count['length'] : _StrToNumber<X, [unknown, ...Count]>

type EqualTo<X, Y> = X extends Y ? Y extends X ? true : false : false;

type CountDigits<X extends string> = _CountDigits<X, []>
type _CountDigits<X extends string, Count extends unknown[]> =
  X extends `${infer front}${infer rest}` ?
    _CountDigits<rest, [...Count, unknown]> :
    [...Count, unknown]['length']

type GreaterThan<X extends number, Y extends number> = EqualTo<X, Y> extends true ? false : GreaterThanS<`${X}`, `${Y}`>

type GreaterThanS<X extends string, Y extends string> =
    EqualTo<CountDigits<X>, CountDigits<Y>> extends false ?
      _GreaterThan<CountDigits<X>, CountDigits<Y>, []> :
      _GreaterThanSameDigits<X, Y>

type _GreaterThan<X extends number, Y extends number, Count extends unknown[]> =
  Count['length'] extends Y ? true :
    Count['length'] extends X ? false :
      _GreaterThan<X, Y, [unknown, ...Count]>;

type _GreaterThanSameDigits<X extends string, Y extends string>
  = X extends `${infer x}${infer restX}` ? Y extends `${infer y}${infer restY}` ?
    EqualTo<x, y> extends true ?
      _GreaterThanSameDigits<restX, restY> :
      _GreaterThan<StrToNumber<x>, StrToNumber<y>, []>
  : never : never

export type LessThan<X extends number, Y extends number> = EqualTo<X, Y> extends true ? false : GreaterThan<X, Y> extends true ? false : true;

// tests
const zeroEqualsZero: EqualTo<0, 0> = true;
const numberEqualsNumber: EqualTo<number, number> = true;
const zeroDoesNotEqualOne: EqualTo<0, 1> = false;
const oneDoesNotEqualZero: EqualTo<0, 1> = false;
const numberDoesNotEqualZero: EqualTo<number, 0> = false;
const zeroDoesNotEqualNumber: EqualTo<0, number> = false;

const strToNumberString0IsZero: StrToNumber<'0'> = 0;
const strToNumberString1IsOne: StrToNumber<'1'> = 1;
const strToNumberString123IsOneHundredTwentyThree: StrToNumber<'123'> = 123;

const zeroNotGreaterThanZero: GreaterThan<0, 0> = false;
const tenGreaterThanOne: GreaterThan<10, 0> = true;
const tenMilGreaterThanOneMil: GreaterThan<10_000_000, 1_000_000> = true;
const oneMilNotGreaterThanTenMil: GreaterThan<1_000_000, 10_000_000> = false;
const _123457GT123456: GreaterThan<123457, 123456> = true;
const bigNumberComparison: GreaterThan<12345678901234567890, 1234567890123456789> = true;

const zeroNotLessThanZero: LessThan<0, 0> = false;
const oneNotLessThanZero: LessThan<1, 0> = false;
const zeroLessThanOne: LessThan<0, 1> = true;