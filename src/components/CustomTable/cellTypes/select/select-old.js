import { useState, useRef, useCallback, useEffect } from 'react';
import CaretIcon from 'components/Icons/ChevronIcons/Chevron';
import CancelIcon from 'components/Icons/CancelCircle';
import { CV_RED, TCV_DEFAULT } from 'constant/CssVariables';
import useOnClickOutside from 'hooks/useOnClickOutside';
import SelectOptions from './SelectOptions';
import * as Styled from './select.styles';

const SelectCell = (props) => {
  // console.log(props);
  const selectRef = useRef();
  const [showOptions, setShowOptions] = useState(false);
  const randomNumber = Math.floor(Math.random() * 5) + 1;
  const [selectedOptions, setSelectedOptions] = useState(
    !!props?.isNew ? [] : [`گزینه ${randomNumber} انتخاب شد`]
  );

  const handleSelectOption = useCallback((e) => {
    e.stopPropagation();
    const optionName = e.target.getAttribute('data-name');
    if (!!props?.multiSelect) {
      setSelectedOptions((oldValues) => [
        ...new Set([...oldValues, optionName]),
      ]);
    } else {
      setSelectedOptions([optionName]);
    }
    !props?.multiSelect && setShowOptions(false);
  }, []);

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

  const handleRemoveItemSelected = (e, selectedItem) => {
    e.stopPropagation();
    setSelectedOptions((oldValues) =>
      oldValues.filter((item) => item !== selectedItem)
    );
  };

  useEffect(() => {
    !selectedOptions.length && setShowOptions(true);
  }, [selectedOptions]);

  useOnClickOutside(selectRef, handleHideOptions);

  if (!props?.editable && !props?.isNew) {
    return selectedOptions[0];
  }

  if (!props?.header?.options?.editable) {
    return selectedOptions[0];
  }

  return (
    <Styled.SelectCellContainer
      isEmpty={!selectedOptions.length}
      ref={selectRef}
      onClick={handleShowOprtions}>
      <Styled.SelectedItemsWrapper>
        {!!selectedOptions.length &&
          selectedOptions.map((selected, index) => {
            return (
              <Styled.SelectedOption key={index}>
                {!!props?.multiSelect && (
                  <CancelIcon
                    onClick={(e) => handleRemoveItemSelected(e, selected)}
                    size={18}
                    color={CV_RED}
                    className="selected-option-cancel-icon"
                  />
                )}
                <span>{selected}</span>
              </Styled.SelectedOption>
            );
          })}
      </Styled.SelectedItemsWrapper>

      <CaretIcon
        onClick={handleClickArrow}
        size={20}
        color={TCV_DEFAULT}
        className="select-option-caret"
        dir={showOptions ? 'up' : 'down'}
      />
      {showOptions && (
        <SelectOptions
          selectedOptions={selectedOptions}
          handleSelectOption={handleSelectOption}
        />
      )}
    </Styled.SelectCellContainer>
  );
};

export default SelectCell;
