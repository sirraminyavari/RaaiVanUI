import { useState } from 'react';
import * as Styled from './Select.styles';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import { CV_DISTANT } from 'constant/CssVariables';
import Heading from 'components/Heading/Heading';

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

  const [defaultValues, setDefaultValues] = useState(
    !!isNew ? [] : value?.defaultValues
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
      selectOptions={value?.options}
      onChange={handleSelectChange}
      onMenuClose={handleOnMenuClose}
      selectStyles={Styled.selectStyles}
    />
  );
};

export default SelectCell;
