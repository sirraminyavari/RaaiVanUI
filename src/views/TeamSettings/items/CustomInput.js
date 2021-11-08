import React from 'react';
import * as Styled from './CustomInputStyle';

const CustomInput = React.forwardRef(
  ({ light = false, ...props }, forwardedRef) => {
    return (
      <Styled.CustomInputContainer>
        <Styled.CustomInput ref={forwardedRef} {...props} light={light} />
      </Styled.CustomInputContainer>
    );
  }
);
export default CustomInput;
