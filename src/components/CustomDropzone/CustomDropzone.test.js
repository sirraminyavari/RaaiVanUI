import ReactDOM from 'react-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import CustomDropzone from './CustomDropzone';

describe('Custom Dropzone Component Test', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = render(<CustomDropzone />);
  });

  afterEach(cleanup);

  it('matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders', () => {
    expect(wrapper).not.toBeNull();
    // wrapper.debug();
  });

  it('renders without crashing', () => {
    const container = document.createElement('div');
    ReactDOM.render(<CustomDropzone />, container);
    ReactDOM.unmountComponentAtNode(container);
  });

  it('sets {accept} prop on the <input>', () => {
    const accept = 'image/jpeg';
    const { container, debug } = render(<CustomDropzone accept={accept} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('accept', accept);
    // debug();
  });

  it('updates {accept} prop on the <input> when it changes', () => {
    const { container, rerender, debug } = render(
      <CustomDropzone accept="image/jpeg" />
    );

    expect(container.querySelector('input')).toHaveAttribute(
      'accept',
      'image/jpeg'
    );
    // debug();

    rerender(<CustomDropzone accept="image/png" />);

    expect(container.querySelector('input')).toHaveAttribute(
      'accept',
      'image/png'
    );
    // debug();
  });

  it('sets {multiple} prop on the <input>', () => {
    const input = wrapper.container.querySelector('input');
    expect(input).toHaveAttribute('multiple');
    // wrapper.debug();
  });

  it('sets any props passed to the input props getter on the <input>', () => {
    const name = 'dropzone-input';
    const { container, debug } = render(
      <CustomDropzone inputProps={{ name }} />
    );

    const input = container.querySelector('input');
    expect(input).toHaveAttribute('name', name);

    // debug();
  });

  it('sets any props passed to the root props getter on the root node', () => {
    const ariaLabel = 'Dropzone area';
    const { container, debug } = render(
      <CustomDropzone containerProps={{ 'aria-label': ariaLabel }} />
    );

    const dropzone = container.querySelector('div');

    expect(dropzone).toHaveAttribute('aria-label', ariaLabel);

    debug();
  });

  it('runs the onClick callback handler provided to the root props getter', () => {
    const rootProps = {
      onClick: jest.fn(),
    };

    const { container } = render(<CustomDropzone containerProps={rootProps} />);

    const dropzone = container.querySelector('div');

    fireEvent.click(dropzone);
    expect(rootProps.onClick).toHaveBeenCalled();
  });
});
