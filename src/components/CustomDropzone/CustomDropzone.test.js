import ReactDOM from 'react-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import CustomDropzone from './CustomDropzone';
import { useDropzone } from 'react-dropzone';
import { renderHook } from '@testing-library/react-hooks';
import {
  flushPromises,
  createDataTransferWithFiles,
  createFile,
} from './testUtils';

describe('Custom Dropzone Component Test', () => {
  let wrapper;
  let files;

  beforeEach(() => {
    global.URL.createObjectURL = jest.fn();

    files = [createFile('file.pdf', 1024, 'application/pdf')];
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

  it('runs the custom callback handlers provided to the root props getter', async () => {
    const event = createDataTransferWithFiles(files);

    const rootProps = {
      onClick: jest.fn(),
      onDrop: jest.fn(),
    };

    const ui = <CustomDropzone containerProps={rootProps} />;

    const { container, rerender } = render(ui);

    const dropzone = container.querySelector('div');

    fireEvent.click(dropzone);
    expect(rootProps.onClick).toHaveBeenCalled();

    //TODO: window.GlobalUtilities problem here.
    // fireEvent.drop(dropzone, event);
    // await flushPromises(rerender, ui);
    // expect(rootProps.onDrop).toHaveBeenCalled();
  });

  it('runs the custom callback handlers provided to the input props getter', async () => {
    const inputProps = {
      onClick: jest.fn(),
      onChange: jest.fn(),
    };

    const ui = <CustomDropzone inputProps={inputProps} />;

    const { container, rerender } = render(ui);

    const input = container.querySelector('input');

    fireEvent.click(input);
    await flushPromises(rerender, ui);
    expect(inputProps.onClick).toHaveBeenCalled();

    fireEvent.change(input);
    await flushPromises(rerender, ui);
    expect(inputProps.onChange).toHaveBeenCalled();
  });

  it('runs no callback handlers if {disabled} is true', () => {
    const rootProps = {
      onClick: jest.fn(),
      onKeyDown: jest.fn(),
      onFocus: jest.fn(),
      onBlur: jest.fn(),
    };

    const inputProps = {
      onClick: jest.fn(),
      onChange: jest.fn(),
    };

    const { container, debug } = render(
      <CustomDropzone
        disabled
        inputProps={inputProps}
        containerProps={rootProps}
      />
    );

    const dropzone = container.querySelector('div');

    fireEvent.click(dropzone);
    expect(rootProps.onClick).not.toHaveBeenCalled();

    fireEvent.focus(dropzone);
    fireEvent.keyDown(dropzone);
    expect(rootProps.onFocus).not.toHaveBeenCalled();
    expect(rootProps.onKeyDown).not.toHaveBeenCalled();

    fireEvent.blur(dropzone);
    expect(rootProps.onBlur).not.toHaveBeenCalled();

    const input = container.querySelector('input');

    fireEvent.click(input);
    expect(inputProps.onClick).not.toHaveBeenCalled();

    fireEvent.change(input);
    expect(inputProps.onChange).not.toHaveBeenCalled();

    // debug();
  });

  test('{rootRef, inputRef} are exposed', () => {
    const { result } = renderHook(() => useDropzone());
    const { rootRef, inputRef, getRootProps, getInputProps } = result.current;

    const { container } = render(
      <div {...getRootProps()}>
        <input {...getInputProps()} />
      </div>
    );

    expect(container.querySelector('div')).toEqual(rootRef.current);
    expect(container.querySelector('input')).toEqual(inputRef.current);
  });

  test('{tabindex} is 0 if {disabled} is false', () => {
    const { container, debug } = render(<CustomDropzone />);
    expect(container.querySelector('div')).toHaveAttribute('tabindex', '0');

    // debug();
  });

  test('{tabindex} is not set if {disabled} is true', () => {
    const { container, rerender, debug } = render(<CustomDropzone />);

    expect(container.querySelector('div')).toHaveAttribute('tabindex', '0');

    // debug();

    rerender(<CustomDropzone disabled />);

    expect(container.querySelector('div')).not.toHaveAttribute('tabindex');

    // debug();
  });
});
