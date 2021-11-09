import * as Styled from './AnimatedTextAreaStyle';
import { useEffect, useRef, useState } from 'react';

/**
 * @description Custom text area by floating label
 * @param rtl direction state
 * @param label Label of textarea
 * @param placeholder Placeholder of textarea
 * @param rows initial height of the textarea
 * @param autoresize
 * @param value
 * @param onChange Callback function on textarea change state
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const AnimatedTextArea = ({
  rtl,
  label,
  placeholder = ' ',
  rows = 5,
  autoresize = false,
  value = '',
  onChange,
  ...props
}) => {
  const [text, setText] = useState(value);
  const [wrapperHeight, setWrapperHeight] = useState(`auto`);
  const [textAreaHeight, setTextAreaHeight] = useState(`auto`);
  const textareaRef = useRef(null);

  /**
   * @description handle the size change of text area
   * @param e
   */
  const changeHandler = (e) => {
    if (autoresize) {
      setTextAreaHeight('auto');
      setWrapperHeight(`${textareaRef?.current?.scrollHeight}px`);
    }

    setText(e?.target?.value);

    if (onChange) {
      onChange(e);
    }
  };

  useEffect(() => {
    if (autoresize) {
      setTextAreaHeight(`${textareaRef?.current?.scrollHeight}px`);
      setWrapperHeight(`${textareaRef?.current?.scrollHeight}px`);
    }
  }, [text]);

  return (
    <Styled.TextAreaWrapper height={wrapperHeight}>
      <Styled.TextAreaInput
        ref={textareaRef}
        height={textAreaHeight}
        placeholder={placeholder}
        rtl={rtl}
        value={text}
        rows={rows}
        onChange={(e) => changeHandler(e)}
        {...props}
      />

      {label && (
        <Styled.TextAreaLabel
          rtl={rtl}
          onClick={() => textareaRef?.current?.focus()}>
          {label}
        </Styled.TextAreaLabel>
      )}
    </Styled.TextAreaWrapper>
  );
};

export default AnimatedTextArea;
