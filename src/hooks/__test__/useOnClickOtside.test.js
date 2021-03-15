import { render, cleanup } from '@testing-library/react';

import useOnClickOtside from '../useOnClickOtside';

describe('useOnClickOtside', () => {
  afterEach(cleanup);

  const renderHook = (hook) => {
    let results;
    const HookWrapper = () => {
      results = hook();
      return null;
    };
    render(<HookWrapper />);
    return results;
  };

  it('works', () => {
    const results = renderHook(useOnClickOtside);
  });
});
