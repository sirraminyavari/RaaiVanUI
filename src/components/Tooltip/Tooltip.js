import { useState } from 'react';
import './Tooltip.css';

const Tooltip = (props) => {
  let timeout;
  const [active, setActive] = useState(false);
  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, props.delay || 400);
  };
  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };
  return (
    <div
      className="Tooltip-Wrapper"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}>
      {props.children}
      {active && (
        <div className={`Tooltip-Tip ${props.direction || 'top'}`}>
          {props.content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
