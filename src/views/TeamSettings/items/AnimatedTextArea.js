import * as Styled from './AnimatedTextAreaStyle';
import { useEffect, useRef, useState } from 'react';

const AnimatedTextArea = ({
  rtl,
  label,
  placeholder = ' ',
  rows = 5,
  autoresize = false,
  disabled = false,
  value = '',
  onChange,
  ...props
}) => {
  const [text, setText] = useState(value);
  const [wrapperHeight, setWrapperHeight] = useState(`auto`);
  const [textAreaHeight, setTextAreaHeight] = useState(`auto`);

  const textareaRef = useRef(null);

  const changeHandler = (e) => {
    if (autoresize) {
      setTextAreaHeight('auto');
      setWrapperHeight(`${textareaRef.current.scrollHeight}px`);
    }

    setText(e.target.value);

    if (onChange) {
      onChange(e);
    }
  };

  useEffect(() => {
    if (autoresize) {
      setTextAreaHeight(`${textareaRef.current.scrollHeight}px`);
      setWrapperHeight(`${textareaRef.current.scrollHeight}px`);
    }
  }, [text]);

  return (
    <Styled.TextAreaWrapper height={wrapperHeight}>
      <Styled.TextAreaInput
        ref={textareaRef}
        height={textAreaHeight}
        placeholder={placeholder}
        rtl={rtl}
        disabled={disabled}
        value={text}
        rows={rows}
        onChange={(e) => changeHandler(e)}
      />

      {label && (
        <Styled.TextAreaLabel
          rtl={rtl}
          onClick={() => textareaRef.current.focus()}>
          {label}
        </Styled.TextAreaLabel>
      )}
    </Styled.TextAreaWrapper>
  );
};

export default AnimatedTextArea;
