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

  it('converts leading underscores to capitalize the next letter', () => {
    const toBeNormalized = {
      id: 1,
      parent_id: 2,
      first_name: 'Max',
      last_name: 'Mustermann'
    };

    const normalized = normalize(toBeNormalized);

    expect(normalized).to.eql(
      {
        id: 1,
        parentId: 2,
        firstName: 'Max',
        lastName: 'Mustermann',
      }
    );
  });
});