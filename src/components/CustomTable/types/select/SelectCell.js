import { useState, useRef } from 'react';
import CaretIcon from 'components/Icons/ChevronIcons/Chevron';
import { TCV_DEFAULT } from 'constant/CssVariables';
import useOnClickOutside from 'hooks/useOnClickOutside';
import SelectOptions from './SelectOptions';
import * as Styled from './select.styles';

const SelectCell = (props) => {
  // console.log(props);
  const selectRef = useRef();
  const [showOptions, setShowOptions] = useState(false);
  const randomNumber = Math.floor(Math.random() * 5) + 1;
  const [selectedOption, setSelectedOption] = useState(
    `گزینه ${randomNumber} انتخاب شد`
  );

  const handleSelectOption = (e) => {
    e.stopPropagation();
    const optionName = e.target.getAttribute('data-name');
    setSelectedOption(optionName);
    setShowOptions(false);
  };

  const handleShowOprtions = () => {
    setShowOptions(true);
  };

  const handleHideOptions = () => {
    setShowOptions(false);
  };

  const handleClickArrow = (e) => {
    e.stopPropagation();
    setShowOptions((opt) => !opt);
  };

  useOnClickOutside(selectRef, handleHideOptions);

  if (!props?.header?.options?.editable) {
    return props.value;
  }

  return (
    <Styled.SelectCellContainer ref={selectRef} onClick={handleShowOprtions}>
      {!!selectedOption && (
        <Styled.SelectedOption>{selectedOption}</Styled.SelectedOption>
      )}
      <CaretIcon
        onClick={handleClickArrow}
        size={20}
        color={TCV_DEFAULT}
        className="select-option-caret"
        dir={showOptions ? 'up' : 'down'}
      />
      {showOptions && <SelectOptions handleSelectOption={handleSelectOption} />}
    </Styled.SelectCellContainer>
  );
};

export default SelectCell;
