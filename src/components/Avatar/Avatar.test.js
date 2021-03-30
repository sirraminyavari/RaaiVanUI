import ReactDOM from 'react-dom';
import { render, cleanup, screen } from '@testing-library/react';
import Avatar from './Avatar';

describe('User Avatar Component Test', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = render(<Avatar />);
  });

  afterEach(cleanup);

  it('matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders', () => {
    expect(wrapper).not.toBeNull();
  });

  it('renders without crashing', () => {
    const container = document.createElement('div');
    ReactDOM.render(<Avatar />, container);
    ReactDOM.unmountComponentAtNode(container);
  });

  it('renders avatar default icon', () => {
    const iconElement = screen.getByTestId('avatar-icon');
    expect(iconElement).toBeInTheDocument();

    // wrapper.debug();
  });

  it('renders avatar image', () => {
    wrapper = render(<Avatar userImage="url/image" />);

    const imgElement = screen.getByTestId('avatar-image');
    expect(imgElement).toBeInTheDocument();

    // wrapper.debug();
  });
});
