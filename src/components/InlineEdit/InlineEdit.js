import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import useKeypress from 'hooks/useKeypress';
import useOnClickOutside from 'hooks/useOnClickOutside';
import * as Styled from './InlineEdit.styles';
import useWindow from 'hooks/useWindowContext';

/**
 * @typedef PropType
 * @property {string} text -The editable text.
 * @property {boolean} [isActive] -Determines if input is active or not.
 * @property {function} onSetText -A function that fires on text edit.
 * @property {function} onChange -A function that fires on text change.
 * @property {Object} styles -An Object of styles for input and text.
 * @property {string} textClasses -Classes for text.
 * @property {string} inputClasses -Classes for input.
 * @property {string} inputPlaceholder -Plceholder for input.
 * @property {string} containerClasses -Classes for component container.
 * @property {string} type -The type of the input.
 * @property {boolean} multiline -If exists, will render textarea instead of input.
 */

/**
 *  @description Renders an inline editable text.
 * @component
 * @param {PropType} props
 */
const InlineEdit = (props) => {
  const {
    text,
    onSetText,
    onChange,
    isActive,
    styles,
    textClasses,
    inputClasses,
    textareaClasses,
    inputPlaceholder,
    multiline,
    containerClasses,
    type,
  } = props;

  //! If true, Shows input, Otherwise, Shows text.
  const [isInputActive, setIsInputActive] = useState(!!isActive);
  //! Input value default to initial text passed to it.
  const [inputValue, setInputValue] = useState(text);
  const [hasInputError, setHasInputError] = useState(false);
  const { GlobalUtilities, RVDic } = useWindow();

  const emailErrorMSG = RVDic.MSG.EmailIsNotValid;

  const initialValue = useRef(text);

  const wrapperRef = useRef(null);
  const textRef = useRef(null);
  const inputRef = useRef(null);

  const enter = useKeypress('Enter');
  const esc = useKeypress('Escape');

  useEffect(() => {
    setInputValue(text);
  }, [text]);

  //! Check to see if the user clicked outside of this component
  useOnClickOutside(wrapperRef, () => {
    if (isInputActive) {
      if (inputValue) {
        if (!hasInputError) {
          onSetText(inputValue);
        } else {
          type === 'email' &&
            onChange &&
            onChange({ value: initialValue.current, error: emailErrorMSG });
        }
        setIsInputActive(false);
      } else {
        setInputValue(initialValue.current);
        onChange && onChange({ value: initialValue.current, error: null });
        if (initialValue.current) {
          setIsInputActive(false);
        } else {
          setIsInputActive(true);
        }
      }
    }
  });

  const onEnter = useCallback(() => {
    if (enter) {
      if (inputValue) {
        if (!hasInputError) {
          onSetText(inputValue);
        }
      } else {
        setInputValue(initialValue.current);
      }
      setIsInputActive(false);
    }
  }, [enter, inputValue, onSetText]);

  const onEscape = useCallback(() => {
    if (esc) {
      setInputValue(initialValue.current);
      setIsInputActive(false);
      onChange && onChange({ value: initialValue.current, error: null });
    }
  }, [esc]);

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
  }, [onEnter, onEscape, isInputActive, inputValue]); //! watch the Enter and Escape key presses

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      const isEmailValid = GlobalUtilities.is_valid_email(value);

      if (type === 'email') {
        if (!isEmailValid) {
          setHasInputError(true);
          onChange && onChange({ value, error: emailErrorMSG });
        } else {
          setHasInputError(false);
          onChange && onChange({ value, error: null });
        }
      }

      //! Sanitize the input value
      setInputValue(DOMPurify.sanitize(value));
    },
    [setInputValue]
  );

  //! Activates edit mode when span has been clicked.
  const handleSpanClick = useCallback(() => {
    setIsInputActive(true);
  }, [setIsInputActive]);

  return (
    <Styled.InlineEditContainer className={containerClasses} ref={wrapperRef}>
      {isInputActive || !inputValue ? (
        multiline ? (
          <Styled.TextAreaInput
            className={textareaClasses}
            style={styles.textareaStyle}
            data-testid="inline-edit-input"
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={inputPlaceholder}
            rows={!!inputValue ? 5 : 1}
          />
        ) : (
          <Styled.Input
            className={inputClasses}
            style={styles.inputStyle}
            data-testid="inline-edit-input"
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={inputPlaceholder}
            onFocus={handleSpanClick}
          />
        )
      ) : (
        <Styled.SpanText
          className={textClasses}
          style={styles.textStyle}
          data-testid="inline-edit-span"
          id="inline-edit"
          ref={textRef}
          onClick={handleSpanClick}>
          {inputValue}
        </Styled.SpanText>
      )}
    </Styled.InlineEditContainer>
  );
};

InlineEdit.propTypes = {
  text: PropTypes.string.isRequired,
  onSetText: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  isActive: PropTypes.bool,
  styles: PropTypes.shape({
    textStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    textareaStyle: PropTypes.object,
  }),
  textClasses: PropTypes.string,
  textareaClasses: PropTypes.string,
  inputClasses: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  containerClasses: PropTypes.string,
  type: PropTypes.string,
};

InlineEdit.defaultProps = {
  text: 'default text',
  isActive: false,
  styles: {},
  inputPlaceholder: '',
  multiline: false,
  type: '',
};

InlineEdit.displayName = 'InlineEditComponent';

export default InlineEdit;
