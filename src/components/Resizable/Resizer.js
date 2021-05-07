import { forwardRef } from 'react';
import * as Styled from './Resizable.styles';

const Resizer = forwardRef((props, ref) => {
  const { position, id } = props;
  return (
    <Styled.Resizer id={id} ref={ref} position={position}></Styled.Resizer>
  );
});

export default Resizer;
