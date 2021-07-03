import { cleanup, render, screen, fireEvent } from 'utils/TestUtils/TestUtils';
import ProgressBar from './ProgressBar';

describe('Progress Bar Component Test', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = render(<ProgressBar />);
  });

  afterEach(cleanup);

  it('matches snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders', () => {
    expect(wrapper).not.toBeNull();
    // wrapper.debug();
  });

  it('sets {label} prop on component', () => {
    const label = 'progress bar';
    const { container, debug } = render(<ProgressBar label={label} />);

    expect(container).toHaveTextContent(label);
    // debug();
  });

  it('updates {label} prop on component when it changes', () => {
    const label = 'label';
    const changed = 'changed';

    const { container, rerender, debug } = render(
      <ProgressBar label={label} />
    );
    expect(container).toHaveTextContent(label);
    // debug();

    rerender(<ProgressBar label={changed} />);
    expect(container).toHaveTextContent(changed);
    // debug();
  });

  it('sets {progress} prop on component', () => {
    const progress = 10;
    const { container, debug } = render(<ProgressBar progress={progress} />);

    expect(container).toHaveTextContent(`% ${progress}`);
    // debug();
  });

  it('sets {progress} prop on component and shows icon', () => {
    const progress = 100;
    const { container, debug } = render(<ProgressBar progress={progress} />);

    const icon = container.querySelector('svg');

    expect(icon).toBeInTheDocument();
    // debug();
  });

  it('does not show approval icon when {progress} prop is less than 100', () => {
    const progress = 10;
    const { container, debug } = render(<ProgressBar progress={progress} />);

    const icon = container.querySelector('svg');

    expect(icon).not.toBeInTheDocument();
    // debug();
  });

  it('updates {progress} prop on component when it changes', () => {
    const progress = 10;
    const changed = 100;
    const { container, debug, rerender } = render(
      <ProgressBar progress={progress} />
    );

    expect(container.querySelector('svg')).not.toBeInTheDocument();
    // debug();

    rerender(<ProgressBar progress={changed} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    // debug();
  });

  it('accepts {progress} prop as string too', () => {
    const progress = '100';
    const { container, debug } = render(<ProgressBar progress={progress} />);

    expect(container.querySelector('svg')).toBeInTheDocument();
    // debug();
  });

  it('updates progress style when ever {progress} prop changes', () => {
    const progress = 11;
    wrapper.rerender(<ProgressBar progress={progress} />);

    const ProgressBarClass = ProgressBar({}).type.styledComponentId;

    const ProgressBarRoots = document.getElementsByClassName(ProgressBarClass);
    const Bar = ProgressBarRoots[0].querySelectorAll('div');
    const style = window.getComputedStyle(Bar[2]);

    expect(style.width).toBe('11%');
    wrapper.debug();
  });
});
