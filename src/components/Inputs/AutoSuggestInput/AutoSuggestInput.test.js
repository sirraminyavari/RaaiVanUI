import { cleanup, render, screen, fireEvent } from 'utils/TestUtils/TestUtils';
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
