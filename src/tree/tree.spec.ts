import { describe, it } from 'mocha';
import * as fc from "fast-check";
import { expect } from 'chai';

type Branch<T> = {left: Tree<T>, right: Tree<T>}
type Tree<T> = null | T | Branch<T>

function isBranch<T>(tree: Tree<T>): tree is Branch<T> {
  return !!tree &&
    typeof tree === 'object' &&
    (tree as object).hasOwnProperty('left') &&
    (tree as object).hasOwnProperty('right');
}

function toList<T>(tree: Tree<T>): (T | null)[] {
  if (tree === null) {
    return [];
  }

  return isBranch(tree) ?
    [...toList<T>(tree.left), ...toList<T>(tree.right)] :
    [tree];
}

describe('an all left tree', () => {
  it('maps from bottom to top', () => {
    fc.assert(fc.property(fc.array(fc.anything()), list => {
      const tree = (list.length === 0) ?
        null :
        [...list].reverse().reduce((currentTree, item) => ({left: item, right: currentTree}));

      expect(toList(tree)).to.be.eql(list)
    }));
  });
});