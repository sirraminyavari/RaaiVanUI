import React from 'react';
import { render } from '@testing-library/react';

import ItemProducerHandler from './ItemProducerHandler';

describe('Heading', () => {
  test('renders Heading component', () => {
    render(
      <ItemProducerHandler
        type={'text'}
        isDragDisabled={true}
        onItems={(value) => console.log(value, 'value')}
      />
    );
    // screen.debug();
  });
});
