import ReactDOM from 'react-dom';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import AutoSuggestInput from './AutoSuggestInput';

describe('AutoSuggest Input Component Test', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = render(<AutoSuggestInput />);
  });

  afterEach(cleanup);

  it('renders', () => {
    expect(wrapper).not.toBeNull();
    // wrapper.debug();
  });
});
