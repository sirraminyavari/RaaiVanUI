import { render, cleanup, screen } from '@testing-library/react';
import PopupMenu from './PopupMenu';

beforeEach(() => {
  global.GlobalUtilities = {
    random_str: function (length) {
      return 'string' * length;
    },
  };
});

afterEach(() => {
  delete global.GlobalUtilities;
  cleanup();
});

describe('Popup Menu Component', () => {
  it('renders popup menu', () => {
    const wrapper = render(<PopupMenu trigger="click" />);

    expect(wrapper).toMatchSnapshot();

    wrapper.debug();
  });
});
