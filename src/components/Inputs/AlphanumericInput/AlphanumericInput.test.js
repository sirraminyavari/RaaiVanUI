import { useState } from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import AlphanumericInput from './AlphanumericInput';

const WrapperComponent = () => {
  const [value, setValue] = useState('');
  return <AlphanumericInput inputValue={value} onInputChange={setValue} />;
};

describe('Alphanumeric Input Component Test', () => {
  const onInputChange = jest.fn();
  let wrapper;

  beforeEach(() => {
    wrapper = render(
      <AlphanumericInput
        inputValue="input value"
        onInputChange={onInputChange}
      />
    );
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
    ReactDOM.render(
      <AlphanumericInput
        inputValue="input value"
        onInputChange={onInputChange}
      />,
      container
    );
    ReactDOM.unmountComponentAtNode(container);
  });

  it('calls callback function when input value changes', () => {
    wrapper.rerender(<WrapperComponent />);
    const inputElement = screen.getByTestId('alphanumeric-input');

    fireEvent.change(inputElement, { target: { value: 'changed' } });

    expect(inputElement.value).toBe('changed');

    // wrapper.debug();
  });

  it('calls "onInputChange" when input value changes', () => {
    const inputElement = screen.getByTestId('alphanumeric-input');
    fireEvent.change(inputElement, { target: { value: 'changed' } });

    expect(onInputChange).toBeCalled();
  });

  it('accepts only numbers', () => {
    wrapper.rerender(
      <AlphanumericInput
        isNumber={true}
        inputValue="input value"
        onInputChange={onInputChange}
      />
    );
    const inputElement = screen.getByTestId('alphanumeric-input');

    expect(inputElement.getAttribute('pattern')).toBe('[0-9]*');

    fireEvent.change(inputElement, { target: { value: 'changed' } });

    expect(onInputChange).not.toBeCalled();

    fireEvent.change(inputElement, { target: { value: 123 } });

    expect(onInputChange).toBeCalled();

    // wrapper.debug();
  });

  it('accepts integer numbers and not float', () => {
    wrapper.rerender(
      <AlphanumericInput
        isNumber={true}
        inputValue="input value"
        onInputChange={onInputChange}
      />
    );
    const inputElement = screen.getByTestId('alphanumeric-input');

    fireEvent.change(inputElement, { target: { value: 123.45 } });

    expect(onInputChange).not.toBeCalled();

    fireEvent.change(inputElement, { target: { value: 12345 } });

    expect(onInputChange).toBeCalled();

    // wrapper.debug();
  });

  it('accepts float numbers too', () => {
    wrapper.rerender(
      <AlphanumericInput
        isFloat={true}
        isNumber={true}
        inputValue="input value"
        onInputChange={onInputChange}
      />
    );

    const inputElement = screen.getByTestId('alphanumeric-input');

    expect(inputElement.getAttribute('pattern')).toBe('^\\d*(\\.\\d*)?$');

    fireEvent.change(inputElement, { target: { value: 123.45 } });

    expect(onInputChange).toBeCalled();

    // wrapper.debug();
  });

  it('accepts numbers but with boundries', () => {
    wrapper.rerender(
      <AlphanumericInput
        maxLength={5}
        maxDecimal={2}
        isFloat={true}
        isNumber={true}
        inputValue="input value"
        onInputChange={onInputChange}
      />
    );
    const inputElement = screen.getByTestId('alphanumeric-input');

    fireEvent.change(inputElement, { target: { value: 123456 } });

    expect(onInputChange).not.toBeCalled();

    fireEvent.change(inputElement, { target: { value: 1234 } });

    expect(onInputChange).toBeCalled();

    fireEvent.change(inputElement, { target: { value: 12345.678 } });

    expect(onInputChange).toBeCalledTimes(1);

    fireEvent.change(inputElement, { target: { value: 12345.67 } });

    expect(onInputChange).toBeCalledTimes(2);

    wrapper.debug();
  });
});
