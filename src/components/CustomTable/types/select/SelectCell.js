import { useState, useRef } from 'react';
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

  const handleSelectOption = (e) => {
    e.stopPropagation();
    const optionName = e.target.getAttribute('data-name');
    if (!!props?.multiSelect) {
      setSelectedOptions((oldValues) => [...oldValues, optionName]);
    } else {
      setSelectedOptions([optionName]);
    }
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

  if (!props?.editable && !props?.isNew) {
    return selectedOptions[0];
  }

  if (!props?.header?.options?.editable) {
    return selectedOptions[0];
  }

  return (
    <Styled.SelectCellContainer ref={selectRef} onClick={handleShowOprtions}>
      <div
        style={{
          width: '90%',
          height: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        {!!selectedOptions.length &&
          selectedOptions.map((selected, index) => {
            return (
              <Styled.SelectedOption key={index}>
                {!!props?.multiSelect && (
                  <CancelIcon
                    size={18}
                    color={CV_RED}
                    style={{
                      position: 'absolute',
                      top: '-0.3rem',
                      right: '-0.3rem',
                      cursor: 'pointer',
                    }}
                  />
                )}
                <span>{selected}</span>
              </Styled.SelectedOption>
            );
          })}
      </div>

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
