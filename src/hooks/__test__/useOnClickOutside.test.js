import { useRef } from 'react';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';

import useOnClickOutside from '../useOnClickOutside';

describe('useOnClickOtside', () => {
  let wrapper;
  const hookCallback = jest.fn();

  afterEach(cleanup);

  const renderHook = (hook) => {
    const HookWrapper = () => {
      const ref = useRef();
      hook(ref, hookCallback);

      return (
        <div ref={ref} data-testid="ref">
          Container to click outside
        </div>
      );
    };

    wrapper = render(<HookWrapper />);
  };

  it('matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('works', () => {
    renderHook(useOnClickOutside);

    const ref = screen.getByTestId('ref');

    fireEvent.mouseDown(ref);

    expect(hookCallback).not.toBeCalled();

    fireEvent.mouseDown(document);

    expect(hookCallback).toBeCalled();

    wrapper.debug();
  });
});
