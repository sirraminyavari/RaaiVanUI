import React from 'react';
import {
  cleanup,
  render,
  screen,
  fireEvent,
} from '../../utils/TestUtils/TestUtils';
import Input from './Input';

beforeEach(cleanup);

test('renders input component', () => {
  render(
    <Input
      type="text"
      placeholder={'hi input'}
      onChange={(value) => console.log(value, 'value')}
    />
  );
  const input = screen.getByPlaceholderText('hi input');

  fireEvent.change(input, { target: { value: '123' } });
  expect(input.value).toBe('123');
});
