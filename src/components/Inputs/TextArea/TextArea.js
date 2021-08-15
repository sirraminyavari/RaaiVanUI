import React, { useState, useRef } from 'react';

import { Wrapper, StyledTextArea, Beautifier } from './TextArea.style';

const TextArea = ({
  initialValue,
  simpleMode = false,
  getValue,
  placeholder = '',
}) => {
  const [value, setValue] = useState(initialValue ?? '');
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  const handleOnBlur = () => {
    getValue && getValue(value);
  };

  const outerHeight = (domElem) => {
    var elmHeight, elmMargin;

    elmHeight = parseInt(
      document.defaultView
        .getComputedStyle(domElem, '')
        .getPropertyValue('height')
    );

    elmMargin =
      parseInt(
        document.defaultView
          .getComputedStyle(domElem, '')
          .getPropertyValue('margin-top')
      ) +
      parseInt(
        document.defaultView
          .getComputedStyle(domElem, '')
          .getPropertyValue('margin-bottom')
      );

    return elmHeight + elmMargin;
  };

  const updateValue = (val) => {
    setValue(val);
    if (ref?.current) setHeight(outerHeight(ref.current));
  };

  return (
    <Wrapper>
      <Beautifier
        ref={ref}
        textContent={value + '&shy;'}
        afterChange={() => {
          if (ref?.current) setHeight(outerHeight(ref.current));
        }}
      />
      <StyledTextArea
        placeholder={placeholder}
        className={simpleMode ? 'rv-input-simple' : 'rv-input'}
        height={height}
        value={value}
        onBlur={handleOnBlur}
        onChange={(e) => setValue(e.target.value)}
      />
    </Wrapper>
  );
};

export default TextArea;
