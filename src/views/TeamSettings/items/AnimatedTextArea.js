import * as Styled from './AnimatedTextAreaStyle';
import { useEffect, useRef } from 'react';

const AnimatedTextArea = ({
  rtl,
  label,
  placeholder = ' ',
  rows = 3,
  ...props
}) => {
  const wrapper = useRef(null);
  const textarea = useRef(null);

  useEffect(() => {
    if (textarea) {
      textarea.current.addEventListener('resize', (e) => {
        console.log(e);
      });
    }
  }, [textarea]);
  return (
    <Styled.TextAreaWrapper ref={wrapper}>
      <Styled.TextAreaInput
        ref={textarea}
        placeholder={placeholder}
        rtl={rtl}
      />

      {label && (
        <Styled.TextAreaLabel
          rtl={rtl}
          onClick={() => textarea.current.focus()}>
          {' '}
          {label}
        </Styled.TextAreaLabel>
      )}
    </Styled.TextAreaWrapper>
  );
};

export default AnimatedTextArea;
