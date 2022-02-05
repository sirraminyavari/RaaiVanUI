import { useRef, memo } from 'react';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import usePreventScroll from 'hooks/usePreventScroll';
import * as Styled from './Select.styles';

const fakeoptions = [...Array(5).keys()].map(
  (item) => `گزینه ${item + 1} انتخاب شد`
);

const SelectOptions = ({ handleSelectOption, selectedOptions, options }) => {
  const containerRef = useRef();

  usePreventScroll(containerRef);

  return (
    <Styled.SelectOptionsContainer
      rowCount={Math.ceil(selectedOptions.length / 2)}
      ref={containerRef}>
      <ScrollBarProvider
        style={{ maxHeight: '7rem' }}
        className="table-select-options-scroll">
        {fakeoptions
          .filter((opt) => !selectedOptions.some((s) => opt === s))
          .map((x, index) => (
            <Styled.SelectOptionWrapper
              data-name={x}
              data-value={index}
              key={index}
              onClick={handleSelectOption}>
              {x}
            </Styled.SelectOptionWrapper>
          ))}
      </ScrollBarProvider>
    </Styled.SelectOptionsContainer>
  );
};

export default memo(SelectOptions);
