import { GreaterThan } from './compare';

type SwapPositionWithNext<List extends unknown[], I extends number> =
  List extends [next: infer X, nextNext: infer Y, ...rest: infer Rest] ?
    _SwapPositionWithNext<I, Rest, X, Y, []>
    : List;

type _SwapPositionWithNext<
  I extends number,
  Remaining extends unknown[],
  Next extends unknown,
  NextNext extends unknown,
  Swapped extends unknown[]
> =
  Swapped['length'] extends I ?
    [...Swapped, NextNext, Next, ...Remaining] :
      Remaining extends [newNextNext: infer NewNextNext, ...rest: infer Rest] ?
        _SwapPositionWithNext<I, Rest, NextNext, NewNextNext, [...Swapped, Next]>
    : never
  ;

type BubbleSort<List extends number[]> = List extends [] ? [] : _BubbleSort<List, List['length'], [], [unknown], []>;
type _BubbleSort<List extends number[], N extends number, I extends unknown[], IPlusOne extends unknown[], J extends unknown[]> =
  IPlusOne['length'] extends N ?
    J['length'] extends N ? List :
      _BubbleSort<List, N, [], [unknown], [...J, unknown]> :
    GreaterThan<List[IPlusOne['length']], List[I['length']]> extends true ?
      _BubbleSort<List, N, [...I, unknown], [...IPlusOne, unknown], J> :
      _BubbleSort<SwapPositionWithNext<List, I['length']>, N, [...I, unknown], [...IPlusOne, unknown], J>
;

// tests

const emptySortedIsEmpty: BubbleSort<[]> = [];
const allZeroesSortedIsAllZeroes: BubbleSort<[0,0]> = [0,0];
const oneTwoSortedIsOneTwo: BubbleSort<[1,2]> = [1,2];
const twoOneSortedIsOneTwo: BubbleSort<[2,1]> = [1,2];
const oneTwoThreeSortedIsOneTwoThree: BubbleSort<[1,2,3]> = [1,2,3];
const unOrderedSortedIsOrdered: BubbleSort<[5,4,3,2,1]> = [1,2,3,4,5];
const negativeAlreadySorted: BubbleSort<[-5,-4,-3,-2,-1]> = [-5,-4,-3,-2,-1];
const negativeNotYetSorted: BubbleSort<[-1,-2,-3,-4,-5]> = [-5,-4,-3,-2,-1];

const swapFirstTwo: SwapPositionWithNext<[2,1], 0> = [1,2];
const swapLastTwo: SwapPositionWithNext<[3,2,1], 1> = [3,1,2];
const swapMiddle: SwapPositionWithNext<[1,2,3,4,5,6], 3> = [1, 2, 3, 5, 4, 6];