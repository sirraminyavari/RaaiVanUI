import React from 'react';
import { render, screen } from '../../utils/TestUtils/TestUtils';
import Heading from './Heading';

test('testing Heading component', () => {
  render(<Heading type={'h1'}>{'Hello '}</Heading>);
  expect(screen.getByText('hello', { exact: false }));
  // screen.debug();
});
