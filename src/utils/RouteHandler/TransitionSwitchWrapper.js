import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Switch, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

/**
 * @component Transition Switch Wrapper
 * This component can be used best as a nested routing system within each `src/Views/*` default exported file
 *
 * @param {number} [props.timeout=1000] - Route change transition duration
 * @return {JSX.Element}
 */
const TransitionSwitchWrapper = ({ timeout, children }) => {
  const location = useLocation();

  return (
    <>
      <Wrapper>
        <TransitionGroup className="transition-group">
          <CSSTransition
            key={location?.key}
            classNames="fade"
            timeout={timeout}>
            <Switch location={location}>{children}</Switch>
          </CSSTransition>
        </TransitionGroup>
      </Wrapper>
    </>
  );
};
TransitionSwitchWrapper.defaultProps = {
  timeout: 1000,
};
TransitionSwitchWrapper.propTypes = {
  timeout: PropTypes.number,
  children: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element])
  ),
};

export default TransitionSwitchWrapper;

const toRight = keyframes`
  from {
    left: 0rem;

  }

  to {
    left:100%;

  }
`;
const fromLeft = keyframes`
  from {
    left: -100%;

  }

  to {
   left:0rem;

  }
`;
const time = 1;
export const Wrapper = styled.div`
  div.transition-group {
    position: relative;
    > div {
      width: 100%;
    }
  }
  .fade-enter {
    opacity: 0;
    animation: ${fromLeft} ${time}s;
    position: absolute;
  }

  .fade-enter.fade-enter-active {
    opacity: 1;
    position: absolute;
    transition: opacity ${time}s, min-height ${time}s;
  }

  .fade-exit {
    opacity: 1;
    animation: ${toRight} ${time}s;
    position: absolute;
  }

  .fade-exit.fade-exit-active {
    opacity: 0;
    position: absolute;
    transition: opacity ${time}s, min-height ${time}s;
  }
`;
