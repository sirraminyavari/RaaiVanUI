/**
 * Renders a resizable component.
 */
import { useRef } from 'react';
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
    resizerClass,
    resizableStyles,
  } = props;

  let prevX;
  let prevY;

  const containerRef = useRef();
  const currentResizer = useRef(null);

  let newHeight;
  let newWidth;

  const onMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const resizerID = currentResizer.current.id;

    //! User grabs the north {n} resizer.
    if (resizerID === 'n') {
      newHeight = rect.height + (prevY - e.clientY);
      newWidth = rect.width;
      containerRef.current.style.height = `${newHeight}px`;
    }

    //! User grabs the west {w} resizer.
    if (resizerID === 'w') {
      newWidth = rect.width + (prevX - e.clientX);
      newHeight = rect.height;
      containerRef.current.style.width = `${newWidth}px`;
    }

    //! User grabs the south {s} resizer.
    if (resizerID === 's') {
      newHeight = rect.height - (prevY - e.clientY);
      newWidth = rect.width;
      containerRef.current.style.height = `${newHeight}px`;
    }

    //! User grabs the east {e} resizer.
    if (resizerID === 'e') {
      newWidth = rect.width - (prevX - e.clientX);
      newHeight = rect.height;
      containerRef.current.style.width = `${newWidth}px`;
    }

    //! Calls on resizing.
    onResizing && onResizing({ width: newWidth, height: newHeight });

    //! Update mouse position.
    prevX = e.clientX;
    prevY = e.clientY;
  };

  const onMouseUp = (e) => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);

    //! Calls at the end of resizing.
    onResizeEnd && onResizeEnd({ width: newWidth, height: newHeight });
  };

  //! On mouse down user grabs the resizer and begins the resizing operation.
  const onMouseDown = (e) => {
    //! Store mouse position.
    prevX = e.clientX;
    prevY = e.clientY;

    currentResizer.current = e.target; //! The current resizer that user is using.
    const rect = containerRef.current.getBoundingClientRect();

    //! Calls at the begining of resizing.
    onResizeStart && onResizeStart({ width: rect.width, height: rect.height });

    //! Add mouse move and mouse up events to window.
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <Styled.ResizableConatiner
      minW={minConstraints?.width}
      maxW={maxConstraints?.width}
      minH={minConstraints?.height}
      maxH={maxConstraints?.height}
      ref={containerRef}
      size={size}
      style={resizableStyles}>
      {resizeHandles.map((handle, index) => {
        return (
          <Resizer
            onMouseDown={onMouseDown}
            id={handle}
            handle={handle}
            resizerClass={resizerClass}
            key={index}
          />
        );
      })}
      {children}
    </Styled.ResizableConatiner>
  );
};

export default Resizable;
