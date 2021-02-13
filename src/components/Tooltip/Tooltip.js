import { useState, useLayoutEffect, useRef } from 'react';
import * as Styled from './Tooltip.styles';

const Tooltip = (props) => {
  const {
    offsetX = 0,
    offsetY = 0,
    position = 'bottom',
    delay = 400,
    content: Content,
    children,
  } = props;
  let timeout;
  const node = useRef();
  const tip = useRef();
  const { GlobalUtilities } = window;

  const [active, setActive] = useState(false);
  const [nodeRec, setNodeRec] = useState({});
  const [tipRec, setTipRec] = useState({});

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay);
  };

  const hideTip = () => {
    clearTimeout(timeout);
    setActive(false);
  };

  const getZIndex = () => GlobalUtilities.zindex.tooltip();

  useLayoutEffect(() => {
    setNodeRec(node.current.getBoundingClientRect());
    setTipRec(active && tip.current.getBoundingClientRect());
    // console.log(node.current.getBoundingClientRect());
    // console.log(active && tip.current.getBoundingClientRect());
  }, [active]);

  console.log(typeof content);

  return (
    <Styled.TooltipContainer onMouseEnter={showTip} onMouseLeave={hideTip}>
      <div ref={node}>{children}</div>
      {active && (
        <Styled.Tooltip
          ref={tip}
          zIndex={getZIndex()}
          position={position}
          dimension={{
            height: nodeRec.height,
            width: nodeRec.width,
            left: tipRec.left < nodeRec.width / 2 ? nodeRec.left + 100 : 50,
            right: tipRec.left < nodeRec.width / 2 ? nodeRec.left + 100 : 50,
            offsetX,
            offsetY,
          }}>
          {typeof Content === 'string' ? Content : <Content />}
        </Styled.Tooltip>
      )}
    </Styled.TooltipContainer>
  );
};

export default Tooltip;
