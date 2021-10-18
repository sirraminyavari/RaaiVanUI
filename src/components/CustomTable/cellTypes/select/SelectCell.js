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
    initialValues = !!TextValue
      ? decodeBase64(TextValue)
          .split('~')
          .map((value) => ({
            value: value.trim(),
            label: value.trim(),
          }))
      : [];
    options = Info?.Options?.map((opt) => ({
      value: decodeBase64(opt),
      label: decodeBase64(opt),
    }));
  } else {
    initialValues = !!TextValue ? [{ value: TextValue, label: TextValue }] : [];
    options = Info?.Options?.map((opt) => ({
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
