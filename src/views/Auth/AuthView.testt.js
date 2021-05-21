import React from 'react';
import { cleanup, render } from '../../utils/TestUtils/TestUtils';
import AuthView from './AuthView';

beforeEach(cleanup);

test('renders AuthView component', () => {
  render(<AuthView />);
});
