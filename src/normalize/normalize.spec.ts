import { describe, it } from 'mocha';
import { expect } from 'chai';
import { normalize } from './normalize';

describe('normalize', () => {
  it('does nothing to something already normalized', () => {
    const alreadyNormalized = {
      id: 1,
      parentId: 2,
      firstName: 'Max',
      lastName: 'Mustermann'
    };

    const normalized = normalize(alreadyNormalized);

    expect(normalized).to.eql(alreadyNormalized);
  });
});