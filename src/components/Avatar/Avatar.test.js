import { render, cleanup, screen } from '@testing-library/react';
import Avatar from './Avatar';

beforeEach(() => {
  global.GlobalUtilities = {
    random_str: function () {
      return 'string';
    },
  };
});

afterEach(() => {
  delete global.GlobalUtilities;
  cleanup();
});

describe('User Avatar Component', () => {
  it('renders without crashing', () => {
    render(<Avatar />);
  });

  it('renders avatar image', () => {
    const wrapper = render(<Avatar userImage="url/image" />);

    expect(wrapper).toMatchSnapshot();

    const imgElement = screen.getByTestId('avatar-image');
    expect(imgElement).toBeInTheDocument();

    wrapper.debug();
  });

  it('renders avatar default icon', () => {
    const wrapper = render(<Avatar />);

    expect(wrapper).toMatchSnapshot();

    const iconElement = screen.getByTestId('avatar-icon');
    expect(iconElement).toBeInTheDocument();

    wrapper.debug();
  });
});
