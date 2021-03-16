import { render, cleanup, fireEvent } from '@testing-library/react';

import useKeypress from '../useKeypress';

describe('useKeypress Test', () => {
  afterEach(cleanup);
  let wrapper;

  const renderHook = (hook, targetKey, testKey, toBe) => {
    let result;

    const HookWrapper = () => {
      result = hook(testKey);
      return null;
    };

    wrapper = render(<HookWrapper />);
    fireEvent.keyDown(window, { key: targetKey, code: targetKey });

    expect(result).toBe(toBe);

    return result;
  };

  it('matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('works and catches correct key press', () => {
    const result = renderHook(useKeypress, 'Enter', 'Enter', true);

    console.log(result);
    wrapper.debug();
  });

  it('works and does not catche incorrect key press', () => {
    const result = renderHook(useKeypress, 'Escape', 'Enter', false);

    console.log(result);
    wrapper.debug();
  });
});
