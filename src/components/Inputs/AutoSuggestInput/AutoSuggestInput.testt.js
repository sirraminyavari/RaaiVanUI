import ReactDOM from 'react-dom';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import AutoSuggestInput from './AutoSuggestInput';

describe('AutoSuggest Input Component Test', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = render(
      <>
        <script
          type="text/javascript"
          src="%PUBLIC_URL%/load/scripts/GlobalUtilities.js?v=29"
        ></script>
        <AutoSuggestInput />
      </>
    );
  });

  afterEach(cleanup);

  it('renders', () => {
    expect(wrapper).not.toBeNull();
    // wrapper.debug();
  });
});
