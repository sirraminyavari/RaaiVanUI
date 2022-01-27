import React, { useLayoutEffect, useRef, forwardRef } from 'react';
import * as Styled from './NumberInput.styles';

/**
 * @component - Number Input component
 * based on RxInput component
 *
 *
 * @param {HTMLInputElement} props - NumberInput component accepts all attributes supported by
 * HTML5 input element (except [type] attribute)
 * @param {ref} ref - forwarded React Ref attribute from input element itself
 * @return {JSX.Element}
 *
 * example:
 *
 * ```js
 * <NumberInput min={-10} step={10} value={controlledState} onChange={someValueUpdater} {...} />
 *```
 */
const NumberInput = forwardRef((props, ref) => {
  const innerRef = useRef(null);

  useLayoutEffect(() => {
    if (ref) ref.current = innerRef.current;
  }, [ref]);

  return (
    <Styled.InputWrapper>
      <Styled.AddIconButton
        role="button"
        onClick={() => innerRef.current?.stepUp()}
      />
      <Styled.CustomInput ref={innerRef} {...props} />
      <Styled.RemoveIconButton
        role="button"
        onClick={() => innerRef.current?.stepDown()}
      />
    </Styled.InputWrapper>
  );
});
NumberInput.displayName = 'NumberInput';
export default NumberInput;
