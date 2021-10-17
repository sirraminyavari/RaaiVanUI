import { useState } from 'react';
import * as Styled from './Select.styles';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import { CV_DISTANT } from 'constant/CssVariables';
import Heading from 'components/Heading/Heading';
import { decodeBase64, toJSON } from 'helpers/helpers';

const SelectCell = (props) => {
  // console.log('select cell ', props);
  const {
    value,
    row,
    column,
    onCellChange,
    editable: isTableEditable,
    editingRow,
    isNew,
    header,
    multiSelect,
  } = props;

  const { Info, TextValue } = value || {};

  let options, initialValues;

  //! Prepare options and initial values if any!
  if (!!multiSelect) {
    const checkboxInfo = toJSON(decodeBase64(Info));
    const checkboxValue = decodeBase64(TextValue);
    initialValues = !!checkboxValue
      ? decodeBase64(checkboxValue)
          .split('~')
          .map((value) => ({
            value: value.trim(),
            label: decodeBase64(value.trim()),
          }))
      : [];
    options = checkboxInfo?.Options?.map((opt) => ({
      value: decodeBase64(opt),
      label: decodeBase64(opt),
    }));
  } else {
    const selectInfo = toJSON(decodeBase64(Info));
    const selectValue = decodeBase64(TextValue);
    initialValues = !!selectValue
      ? [{ value: decodeBase64(selectValue), label: decodeBase64(selectValue) }]
      : [];
    options = selectInfo?.Options?.map((opt) => ({
      value: decodeBase64(opt),
      label: decodeBase64(opt),
    }));
  }

  const [defaultValues, setDefaultValues] = useState(
    !!isNew ? [] : initialValues
  );

  const rowId = row?.original?.id;
  const columnId = column?.id;

  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  const handleSelectChange = (values) => {
    // console.log(values);
    setDefaultValues(values);
  };

  const handleOnMenuClose = () => {
    //! Call api.
    console.log(defaultValues);
  };

  if (isNew) {
    return <div>new select</div>;
  }

  if (!isTableEditable || !isCellEditable || !isRowEditing) {
    return (
      <>
        {defaultValues?.map((x) => x?.label).length ? (
          defaultValues
            ?.map((x) => x?.label)
            .map((item, key) => (
              <Styled.SelectedItemWrapper key={key}>
                {item}
              </Styled.SelectedItemWrapper>
            ))
        ) : (
          <Heading style={{ color: CV_DISTANT }} type="h6">
            انتخاب کنید
          </Heading>
        )}
      </>
    );
  }

  return (
    <CustomSelect
      defaultValue={defaultValues}
      isMulti={!!multiSelect}
      hideSelectedOptions={false}
      closeMenuOnSelect={false}
      isClearable={false}
      isSearchable={true}
      placeholder="انتخاب کنید"
      selectName={header?.title}
      selectOptions={options}
      onChange={handleSelectChange}
      onMenuClose={handleOnMenuClose}
      selectStyles={Styled.selectStyles}
    />
  );
};

export default SelectCell;
