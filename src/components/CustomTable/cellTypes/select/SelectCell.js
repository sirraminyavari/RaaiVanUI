import { useRef, useState } from 'react';
import * as Styled from './Select.styles';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import { decodeBase64 } from 'helpers/helpers';
import { useCellProps } from 'components/CustomTable/tableUtils';
import useOnClickOutside from 'hooks/useOnClickOutside';

const SelectCell = (props) => {
  const {
    value,
    onCellChange,
    rowId,
    columnId,
    isNewRow,
    canEdit,
    multiSelect,
    setSelectedCell,
    isSelectedCell,
  } = useCellProps(props);

  const selectRef = useRef();

  const handleClickOutside = () => {
    if (isSelectedCell) {
      handleUpdateCell();
      setSelectedCell(null);
    }
  };

  useOnClickOutside(selectRef, handleClickOutside);

  const { Info, TextValue } = value || {};
  const { Options } = Info || {};

  let options, initialValues;

  //! Prepare options and initial values if any!
  if (!!multiSelect) {
    initialValues = !!TextValue
      ? decodeBase64(TextValue)
          .split('~')
          .map((value) => ({
            value: value.trim(),
            label: value.trim(),
          }))
      : [];
    options = Options?.map((opt) => ({
      value: decodeBase64(opt),
      label: decodeBase64(opt),
    }));
  } else {
    initialValues = !!TextValue ? [{ value: TextValue, label: TextValue }] : [];
    options = Options?.map((opt) => ({
      value: decodeBase64(opt),
      label: decodeBase64(opt),
    }));
  }

  const [defaultValues, setDefaultValues] = useState(
    !!isNewRow ? [] : initialValues
  );
  const originalValueRef = useRef(TextValue);

  const handleSelectChange = (values) => {
    setDefaultValues(values);
  };

  const handleUpdateCell = () => {
    const textValue = !!multiSelect
      ? defaultValues?.map((x) => x.value).join(' ~ ')
      : defaultValues.value;

    if (originalValueRef.current === textValue || !textValue) return;

    let selectCell = {
      ...value,
      TextValue: textValue,
    };

    onCellChange(rowId, columnId, selectCell, textValue);
  };

  if (!canEdit) {
    return (
      <div>
        {initialValues?.map((x) => x?.label)?.length ? (
          initialValues
            ?.map((x) => x?.label)
            .map((item, key) => (
              <Styled.SelectedItem type="h4" key={key}>
                {item}
              </Styled.SelectedItem>
            ))
        ) : (
          <Styled.EmptyCellView></Styled.EmptyCellView>
        )}
      </div>
    );
  }

  return (
    <Styled.SelectWrapper ref={selectRef}>
      <CustomSelect
        defaultValue={initialValues}
        isMulti={!!multiSelect}
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        isClearable={false}
        isSearchable={true}
        placeholder="انتخاب کنید"
        options={options}
        onChange={handleSelectChange}
        // onMenuClose={handleUpdateCell}
        styles={Styled.selectStyles}
        menuPortalTarget={document.body}
        menuShouldScrollIntoView={false}
        noOptionsMessage={() => 'موردی یافت نشد'}
      />
    </Styled.SelectWrapper>
  );
};

export default SelectCell;
