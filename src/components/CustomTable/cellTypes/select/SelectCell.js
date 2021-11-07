import { useRef, useState } from 'react';
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
    editingRowId,
    header,
    multiSelect,
    data,
    selectedCell,
    tempRowId,
  } = props;

  const rowId = row?.original?.id;
  const columnId = column?.id;
  const selectedRowId = selectedCell?.row?.original?.id;
  const selectedColumnId = selectedCell?.column?.id;
  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRowId;
  const isCellEditing =
    rowId === selectedRowId && columnId === selectedColumnId;
  const isNewRow = tempRowId === rowId;

  const canEdit =
    (isTableEditable && isCellEditable && (isRowEditing || isCellEditing)) ||
    isNewRow;

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
    !!isNewRow ? [] : initialValues
  );
  const originalValueRef = useRef(TextValue);

  const handleSelectChange = (values) => {
    // console.log(values);
    setDefaultValues(values);
  };

  const handleOnMenuClose = () => {
    let id = isNewRow ? tempRowId : rowId;

    const textValue = !!multiSelect
      ? defaultValues.map((x) => x.value).join(' ~ ')
      : defaultValues.value;

    if (originalValueRef.current === textValue) return;

    let selectCell = {
      ...value,
      TextValue: textValue,
    };

    onCellChange(id, columnId, selectCell, textValue);
  };

  if (!canEdit) {
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
    <Styled.SelectWrapper>
      <CustomSelect
        defaultValue={defaultValues}
        isMulti={!!multiSelect}
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        isClearable={false}
        isSearchable={true}
        placeholder="انتخاب کنید"
        selectName={header?.title}
        options={options}
        onChange={handleSelectChange}
        onMenuClose={handleOnMenuClose}
        styles={Styled.selectStyles}
        menuPortalTarget={document.body}
        menuShouldScrollIntoView={false}
        noOptionsMessage={() => 'موردی یافت نشد'}
      />
    </Styled.SelectWrapper>
  );
};

export default SelectCell;
