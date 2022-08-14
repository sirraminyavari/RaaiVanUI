/**
 * Renders a checkbox filter.
 */
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Styled from '../types.styles';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import Checkbox from 'components/Inputs/checkbox/Checkbox';
import ExactFilter from 'components/FormElements/FormFilter/items/ExactToggle';
import OrFilter from 'components/FormElements/FormFilter/items/OrAndToggle';
import Select from 'react-select';
import useWindow from 'hooks/useWindowContext';
import { CV_FREEZED, CV_GRAY, CV_WHITE, TCV_WARM } from 'constant/CssVariables';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Object} value - Value of component.
 * @property {Object} data - Meta data needed for component.
 * @property {function} onChange - A callback function that fires when value changes.
 */

/**
 *  @description Renders a checkbox type component.
 * @component
 * @param {PropType} props -Props that are passed to component.
 */
const CheckboxType = (props) => {
  const { onChange, data, value } = props;
  const { ElementID, Title, Info } = data; //! Meta data to feed component.

  const [items, setItems] = useState(value ? value?.TextItems : []);
  const [exact, setExact] = useState(value ? value?.Exact : false);
  const [or, setOr] = useState(value ? value?.Or : true);

  const { GlobalUtilities, RVDic } = useWindow();

  const { Options } = GlobalUtilities.to_json(decodeBase64(Info)) || {};

  //! Checkbox options.
  const options = (Options || []).map((option) => ({
    value: decodeBase64(option),
    label: decodeBase64(option),
    group: 'checkbox-filter',
  }));

  //! Fires on checkbox value change.
  const handleOnItemSelect = useCallback((items) => {
    // if (!item?.isChecked) {
    //   setItems((oldItems) => oldItems.filter((c) => c !== item?.value));
    // } else {
    //   setItems((oldItems) => [...oldItems, item?.value]);
    // }
    setItems(
      items.map((item) => {
        return item.value;
      })
    );
  }, []);

  //! Fires on 'Exact' toggle change.
  const handleExactFilter = (exactValue) => {
    setExact(exactValue);
  };

  //! Fires on 'OrAnd' toggle change.
  const handleOrFilter = (orValue) => {
    setOr(orValue);
  };

  useEffect(() => {
    const id = ElementID;
    const textItems = items?.map((item) => encodeBase64(item));
    const JSONValue = {
      TextItems: textItems,
      Exact: exact,
      Or: or,
    };

    //! Send back value to parent on check.
    onChange({
      id,
      value: {
        Type: 'checkbox',
        TextItems: items,
        Exact: exact,
        Or: or,
        JSONValue: !items?.length ? null : JSONValue,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, exact, or]);

  //! Clear component value.
  useEffect(() => {
    if (value === undefined) {
      setItems([]);
    }
  }, [value]);

  return (
    <Styled.FilterContainer>
      <Styled.FilterTitle>{decodeBase64(Title)}</Styled.FilterTitle>
      {/* <Checkbox
        options={options}
        onSelect={handleOnItemSelect}
        selecteds={value?.TextItems}
      /> */}
      <Select
        onBlur={() => {
          // save(elementId);
          // setIsFocused(false);
        }}
        options={options}
        // value={}
        isMulti
        isClearable={false}
        closeMenuOnSelect={false}
        styles={customStyles}
        onChange={handleOnItemSelect}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder={RVDic.Select}
      />
      {/* <Styled.ExactOrFiltersWrapper>
        <OrFilter isChecked={or} onToggle={handleOrFilter} />
        <ExactFilter onToggle={handleExactFilter} isChecked={exact} />
      </Styled.ExactOrFiltersWrapper> */}
    </Styled.FilterContainer>
  );
};

CheckboxType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

CheckboxType.displayName = 'FilterCheckboxComponent';

export default CheckboxType;

const customStyles = {
  option: (
    styles,
    { data, isDisabled, isFocused, isSelected },
    provided,
    state
  ) => ({
    ...provided,
    color: isSelected ? TCV_WARM : CV_GRAY,
    margin: '0.35rem 0.5rem 0.35rem 0.5rem',
    padding: '0.2rem 0.2rem 0.2rem 0.2rem',
    backgroundColor: isFocused && CV_FREEZED,
    ':hover': {
      color: TCV_WARM,
      backgroundColor: CV_FREEZED,
      padding: '0.2rem 0.2rem 0.2rem 0.2rem',
    },
  }),
  control: (provided) => ({
    // none of react-select's styles are passed to <Control />
    ...provided,
    minWidth: '13rem',
    borderColor: CV_WHITE,
    backgroundColor: CV_WHITE,
    ':focus': {
      borderWidth: 0,
    },
    ':hover': {},
  }),
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: '#e6f4f1',
      borderRadius: '0.5rem',
      padding: '0.3rem',
    };
  },
  multiValueRemove: (styles, { data }) => {
    return {
      ...styles,
    };
  },
  menu: (provided) => ({
    ...provided,
    borderColor: '#e6f4f1',
    ':hover': {
      borderWidth: 0,
    },
  }),
};
