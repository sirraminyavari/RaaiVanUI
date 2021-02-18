import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import useKeypress from '../../hooks/useKeypress';
import useOnClickOutside from '../../hooks/useOnClickOtside';
import * as Styled from './InlineEdit.styles';

const InlineEdit = ({ text, onSetText }) => {
  const [isInputActive, setIsInputActive] = useState(false);
  const [inputValue, setInputValue] = useState(text);

  const wrapperRef = useRef(null);
  const textRef = useRef(null);
  const inputRef = useRef(null);

  const enter = useKeypress('Enter');
  const esc = useKeypress('Escape');

  //! Check to see if the user clicked outside of this component
  useOnClickOutside(wrapperRef, () => {
    if (isInputActive) {
      onSetText(inputValue);
      setIsInputActive(false);
    }
  });

  const onEnter = useCallback(() => {
    if (enter) {
      onSetText(inputValue);
      setIsInputActive(false);
    }
  }, [enter, inputValue, onSetText]);

  const onEscape = useCallback(() => {
    if (esc) {
      setInputValue(text);
      setIsInputActive(false);
    }
  }, [esc, text]);

  //! Focus the cursor in the input field on edit start
  useEffect(() => {
    if (isInputActive) {
      inputRef.current.focus();
    }
  }, [isInputActive]);

  useEffect(() => {
    if (isInputActive) {
      //! If Enter is pressed, save the text and close the editor
      onEnter();
      //! If Escape is pressed, revert the text and close the editor
      onEscape();
    }
  }, [onEnter, onEscape, isInputActive]); //! watch the Enter and Escape key presses

  const handleInputChange = useCallback(
    (e) => {
      //! Sanitize the input value
      setInputValue(DOMPurify.sanitize(e.target.value));
    },
    [setInputValue]
  );

  const handleSpanClick = useCallback(() => {
    setIsInputActive(true);
  }, [setIsInputActive]);

  return (
    <span ref={wrapperRef}>
      <Styled.SpanText
        ref={textRef}
        onClick={handleSpanClick}
        isInputActive={isInputActive}>
        {text}
      </Styled.SpanText>
      <Styled.Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        isInputActive={isInputActive}
      />
    </span>
  );
};

InlineEdit.propTypes = {
  text: PropTypes.string,
  onSetText: PropTypes.func,
};

export default InlineEdit;
