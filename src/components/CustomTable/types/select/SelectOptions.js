import { useRef } from 'react';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import usePreventScroll from 'hooks/usePreventScroll';
import * as Styled from './select.styles';

const SelectOptions = ({ handleSelectOption, options }) => {
  const containerRef = useRef();

  usePreventScroll(containerRef);

  return (
    <Styled.SelectOptionsContainer ref={containerRef}>
      <PerfectScrollbar
        style={{ maxHeight: '7rem' }}
        className="table-select-options-scroll">
        {[...Array(5).keys()].map((item) => (
          <Styled.SelectOptionWrapper
            data-name={`گزینه ${item + 1} انتخاب شد`}
            data-value={item}
            key={item}
            onClick={handleSelectOption}>
            {`گزینه ${item + 1} انتخاب شد`}
          </Styled.SelectOptionWrapper>
        ))}
      </PerfectScrollbar>
    </Styled.SelectOptionsContainer>
  );
};

export default SelectOptions;
