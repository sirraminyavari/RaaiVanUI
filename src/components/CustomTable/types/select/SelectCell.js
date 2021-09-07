import { TCV_DEFAULT, TCV_VERY_SOFT } from 'constant/CssVariables';
import { useState } from 'react';
import Select from 'react-select';
import * as Styled from './select.styles';

const SelectCell = (props) => {
  // console.log('select cell ', props);
  const [selectedOptions, setSelectedOptions] = useState(
    !!props?.isNew
      ? []
      : props?.value?.defaultValues?.map((x) => x?.label) || []
  );

  const handleSelectChange = (values) => {
    setSelectedOptions(values);
  };

  const handleOnMenuClose = () => {
    //! Call api.
    console.log(selectedOptions);
  };

  if (!props?.editable && !props?.isNew) {
    return selectedOptions?.[0].label;
  }

  if (!props?.header?.options?.editable) {
    return (
      <>
        {selectedOptions.map((item, key) => (
          <span
            key={key}
            style={{
              display: 'inline-block',
              backgroundColor: TCV_VERY_SOFT,
              padding: '0.3rem',
              margin: '0.2rem',
              width: 'auto',
              borderRadius: '0.2rem',
            }}>
            {item}
          </span>
        ))}
      </>
    );
  }

  return (
    <Styled.SelectContainer>
      <Select
        defaultValue={props?.value?.defaultValues}
        isMulti={!!props?.multiSelect}
        hideSelectedOptions={!!props?.binary || !!props?.multiSelect}
        closeMenuOnSelect={!props?.multiSelect}
        isClearable={false}
        isSearchable={true}
        name={props?.header?.title}
        options={props?.value?.options}
        onChange={handleSelectChange}
        onMenuClose={handleOnMenuClose}
        styles={Styled.selectStyles}
      />
    </Styled.SelectContainer>
  );
};

export default SelectCell;
