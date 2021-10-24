import { useState } from 'react';
import * as Styled from './Select.styles';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import { CV_DISTANT } from 'constant/CssVariables';
import Heading from 'components/Heading/Heading';
import { decodeBase64 } from 'helpers/helpers';

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
    data,
  } = props;

  const rowId = row?.original?.id;
  const columnId = column?.id;

  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  //! Get info for new row.
  const columnInfo = data?.[0]?.[columnId]?.Info;

  //! Get info for existing row.
  const { Info, TextValue } = value || {};
  const { Options } = Info || columnInfo || {};

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
    !!isNew ? [] : initialValues
  );

  const handleSelectChange = (values) => {
    // console.log(values);
    setDefaultValues(values);
  };

  const handleOnMenuClose = () => {
    const textValue = !!multiSelect
      ? defaultValues.map((x) => x.value).join(' ~ ')
      : defaultValues.value;
    const selectCell = {
      ...value,
      TextValue: textValue,
    };

    if (isNew) {
      //! Add new row.
    } else {
      onCellChange(rowId, columnId, selectCell, textValue);
    }
  };

  if ((!isTableEditable || !isCellEditable || !isRowEditing) && !isNew) {
    return (
      <>
        {defaultValues?.map((x) => x?.label).length ? (
          defaultValues
            ?.map((x) => x?.label)
            .map((item, key) => (
              <Styled.SelectedItem type="h4" key={key}>
                {item}
              </Styled.SelectedItem>
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
