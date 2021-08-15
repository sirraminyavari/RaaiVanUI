import React, { useState, useRef } from 'react';

import { Wrapper, StyledTextArea, Beautifier } from './TextArea.style';

const TextArea = () => {
  const [value, setValue] = useState('');
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

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
      <Beautifier ref={ref} textContent={value} />
      <StyledTextArea
        className="rv-input"
        height={height}
        onChange={(e) => updateValue(e.target.value)}
      />
    </Wrapper>
  );
};

export default TextArea;
