import { useLayoutEffect, useRef } from 'react';
import * as Styled from './Resizable.styles';
import Resizer from './Resizer';

const Resizable = (props) => {
  const {
    children,
    size,
    resizeHandles,
    onResizeStart,
    onResizing,
    onResizeEnd,
    minConstraints,
    maxConstraints,
  } = props;

  let prevX;
  let prevY;

  const containerRef = useRef();

  const currentResizer = useRef(null);

  const upRef = useRef();
  const downRef = useRef();
  const leftRef = useRef();
  const rightRef = useRef();

  const getRef = (handle) => {
    switch (handle) {
      case 'n':
        return upRef;
      case 's':
        return downRef;
      case 'e':
        return rightRef;
      default:
        return leftRef;
    }
  };

  let newHeight;
  let newWidth;

  const onMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const resizerID = currentResizer.current.id;

    if (resizerID === 'n') {
      newHeight = rect.height + (prevY - e.clientY);
      newWidth = rect.width;
      containerRef.current.style.height = `${newHeight}px`;
    }

    if (resizerID === 'w') {
      newWidth = rect.width + (prevX - e.clientX);
      newHeight = rect.height;
      containerRef.current.style.width = `${newWidth}px`;
    }

    if (resizerID === 's') {
      newHeight = rect.height - (prevY - e.clientY);
      newWidth = rect.width;
      containerRef.current.style.height = `${newHeight}px`;
    }

    if (resizerID === 'e') {
      newWidth = rect.width - (prevX - e.clientX);
      newHeight = rect.height;
      containerRef.current.style.width = `${newWidth}px`;
    }

    onResizing({ width: newWidth, height: newHeight });

    prevX = e.clientX;
    prevY = e.clientY;
  };

  const onMouseUp = (e) => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    onResizeEnd({ width: newWidth, height: newHeight });
  };

  const onMouseDown = (e) => {
    prevX = e.clientX;
    prevY = e.clientY;

    currentResizer.current = e.target;
    const rect = containerRef.current.getBoundingClientRect();

    onResizeStart({ width: rect.width, height: rect.height });

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  useLayoutEffect(() => {
    upRef.current.addEventListener('mousedown', onMouseDown);
    downRef.current.addEventListener('mousedown', onMouseDown);
    leftRef.current.addEventListener('mousedown', onMouseDown);
    rightRef.current.addEventListener('mousedown', onMouseDown);
  }, []);

  return (
    <Styled.ResizableConatiner
      minW={minConstraints?.width}
      maxW={maxConstraints?.width}
      minH={minConstraints?.height}
      maxH={minConstraints?.height}
      ref={containerRef}
      size={size}>
      {resizeHandles.map((handle, index) => {
        return (
          <Resizer
            id={handle}
            ref={getRef(handle)}
            position={handle}
            key={index}
          />
        );
      })}
      {children}
    </Styled.ResizableConatiner>
  );
};

export default Resizable;
