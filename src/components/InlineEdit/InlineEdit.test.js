import ReactDOM from 'react-dom';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import InlineEdit from './InlineEdit';

describe('Inline Edit Component Test', () => {
  const onSetText = jest.fn();
  let wrapper;

  beforeEach(() => {
    wrapper = render(<InlineEdit text="text prop" onSetText={onSetText} />);
  });

  afterEach(cleanup);

  const inputSetup = () => {
    const spanElement = wrapper.getByTestId('inline-edit-span');
    fireEvent.click(spanElement);
    const inputElement = screen.getByTestId('inline-edit-input');

    return inputElement;
  };

  it('matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders', () => {
    expect(wrapper).not.toBeNull();
    // wrapper.debug();
  });

  it('renders without crashing', () => {
    const container = document.createElement('div');
    ReactDOM.render(<InlineEdit onSetText={onSetText} />, container);
    ReactDOM.unmountComponentAtNode(container);
  });

  it.skip('shows "default text" in span tag without "text" prop', () => {
    expect(screen.getByTestId('inline-edit-span')).toHaveTextContent(
      'default text'
    );
  });

  it('shows text prop inside component', () => {
    expect(screen.getByTestId('inline-edit-span')).toHaveTextContent(
      'text prop'
    );
    // wrapper.debug();
  });

  it('shows input  on click span', () => {
    const spanElement = wrapper.getByTestId('inline-edit-span');
    fireEvent.click(spanElement);
    const inputElement = screen.getByTestId('inline-edit-input');

    expect(inputElement).toBeInTheDocument();
    expect(inputElement.value).toBe('text prop');

    // wrapper.debug();
  });

  it('should allow to be able to change input value', () => {
    const inputElement = inputSetup();
    fireEvent.change(inputElement, { target: { value: 'new value' } });
    expect(inputElement.value).toBe('new value');

    // wrapper.debug();
  });

  it('should show span on press enter', () => {
    const inputElement = inputSetup();
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    const spanElement = screen.getByTestId('inline-edit-span');

    expect(inputElement).not.toBeInTheDocument();
    expect(spanElement).toBeInTheDocument();

    // wrapper.debug();
  });

  it('should show span on press escape', () => {
    const inputElement = inputSetup();
    fireEvent.keyDown(inputElement, { key: 'Escape', code: 'Escape' });

    const spanElement = screen.getByTestId('inline-edit-span');

    expect(inputElement).not.toBeInTheDocument();
    expect(spanElement).toBeInTheDocument();

    // wrapper.debug();
  });

  it('calls "onSetText" on press enter', () => {
    const inputElement = inputSetup();
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(onSetText).toBeCalled();
  });

  it('reverts the text and close the editor', () => {
    const inputElement = inputSetup();
    fireEvent.change(inputElement, { target: { value: 'new value' } });
    fireEvent.keyDown(inputElement, { key: 'Escape', code: 'Escape' });

    const spanElement = screen.getByTestId('inline-edit-span');

    expect(spanElement).not.toHaveTextContent('new value');
    expect(spanElement).toHaveTextContent('text prop');
  });

  it('should close the editor on click away input', () => {
    const inputElement = inputSetup();
    // wrapper.debug();

    fireEvent.mouseDown(document);
    expect(onSetText).toBeCalled();
    expect(inputElement).not.toBeInTheDocument();
    // wrapper.debug();
  });

  it('should not close the editor on click inside input', () => {
    const inputElement = inputSetup();
    fireEvent.mouseDown(inputElement);

    expect(inputElement).toBeInTheDocument();
  });
});
