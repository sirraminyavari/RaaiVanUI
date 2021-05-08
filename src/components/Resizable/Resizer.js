import { forwardRef } from 'react';
import * as Styled from './Resizable.styles';

const Resizer = forwardRef((props, ref) => {
  const { handle, id, onMouseDown, resizerClass } = props;
  return (
    <Styled.Resizer
      onMouseDown={onMouseDown}
      id={id}
      ref={ref}
      handle={handle}
      className={resizerClass}
    />
  );
});

export default Resizer;
