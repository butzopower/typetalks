type normalize<s extends string> =
  s extends `${infer start}_${infer next}${infer rest}` ?
    normalize<`${start}${Uppercase<next>}${rest}`> :
    s;

export type Normalized<T extends object> = {
  [Property in keyof T as normalize<string & Property>]: T[Property]
}

// tests

const stringType: normalize<string> = '' as string;
const alreadyNormal: normalize<"normal"> = "normal";
const singleUnderscore: normalize<"not_normal"> = "notNormal";
const doubleUnderscore: normalize<"more_not_normal"> = "moreNotNormal";
const sentenceUnderscore: normalize<"four_score_and_twenty_years_ago"> = "fourScoreAndTwentyYearsAgo";