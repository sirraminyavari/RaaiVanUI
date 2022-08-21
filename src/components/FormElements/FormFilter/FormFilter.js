/**
 * Renders a filter form elements.
 */
import { Fragment, useState, Children } from 'react';
import PropTypes from 'prop-types';
import TextType from './types/text/TextType';
import DateType from './types/date/DateType';
import CheckboxType from './types/checkbox/CheckboxType';
import NumericType from './types/numeric/NumericType';
import UserType from './types/user/UserType';
import NodeType from './types/node/NodeType';
import FileType from './types/file/FileType';
import BinaryType from './types/binary/BinaryType';
import FormType from './types/form/FormType';
import MultiLevelType from './types/multiLevel/MultiLevelType';
import * as Styled from './FormFilter.styles';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import UndoIcon from 'components/Icons/UndoIcon/Undo';
import FilterButton from 'components/Buttons/Button';
import { C_DISTANT, C_RED } from 'constant/Colors';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';

/**
 * @typedef PropType
 * @type {Object}
 * @property {array} filters - A list of filters.
 * @property {string} formName - The title of the form.
 * @property {function} onFilter - A callback function that fires on filter click.
 * @property {function} onCloseFilter - A callback function that fires on close button click.
 * @property {Object} filterValues - The value for each filter type.
 * @property {Object} containerStyles - The styles for form container.
 */

/**
 *  @description Renders form filter elements component.
 * @component
 * @param {PropType} props -Props that are passed to component.
 */

//TODO: Update RVDic object dictionary
const FormFilter = (props) => {
  const {
    filters,
    onFilter,
    children,
    onCloseFilter,
    formName,
    filterValues,
    containerStyles,
  } = props;

  const [values, setValues] = useState(filterValues || {});

  //! Calls on every filter type change.
  const handleOnChange = (filter) => {
    setValues((oldValues) => ({ ...oldValues, [filter?.id]: filter?.value }));
  };

  //! Clalls when user clicks on filter button.
  const handleOnFilterClick = () => {
    console.clear();
    console.log({ values });
    onFilter &&
      onFilter(
        values
        // {
        //   'aa4c4953-8f6f-820f-a87a-a055b7ac5b12': {
        //     Data: { From: '1401/5/22', To: '1401/5/31' },
        //     DateFrom: '1401/5/22',
        //     DateTo: '1401/5/31',
        //     JSONValue: { DateFrom: '1401/5/22', DateTo: '1401/5/31' },
        //     Type: 'date',
        //   },
        // }
      );
  };

  //! clear the filter form.
  const clearFilter = () => {
    setValues({});
  };

  //! Close form filter.
  const closeFormFilter = () => {
    onCloseFilter && onCloseFilter();
    handleOnFilterClick();
  };

  return (
    <>
      {children ? (
        <div>{Children.only(children({ onChange: handleOnChange }))}</div>
      ) : (
        <Styled.FormFilterContainer style={containerStyles}>
          {!!formName && (
            <Styled.FormFilterHeader>
              <UndoIcon
                style={{ cursor: 'pointer', transform: 'scaleX(-1)' }}
                onClick={clearFilter}
                className={C_DISTANT}
                size={16}
              />
              <Styled.FormFilterTitle>{formName}</Styled.FormFilterTitle>
              <CloseIcon
                size={16}
                style={{ cursor: 'pointer' }}
                onClick={closeFormFilter}
                className={C_RED}
              />
            </Styled.FormFilterHeader>
          )}
          <ScrollBarProvider style={{ padding: '1.5rem', width: '100%' }}>
            {filters.map((filter, key) => {
              if (!FormFilter[filter.Type]) return null;
              const FormFilterComponent = FormFilter[filter.Type];
              return (
                <FormFilterComponent
                  key={key}
                  onChange={handleOnChange}
                  data={filter}
                  value={values[filter.ElementID]}
                />
              );
            })}
          </ScrollBarProvider>
          <Styled.FilterButtonWrapper>
            <FilterButton
              onClick={handleOnFilterClick}
              style={{ width: '50%', fontSize: '1rem' }}
              type="primary-o"
            >
              اعمال فیلتر
            </FilterButton>
          </Styled.FilterButtonWrapper>
        </Styled.FormFilterContainer>
      )}
    </>
  );
};

FormFilter.Checkbox = CheckboxType;
FormFilter.Text = TextType;
FormFilter.Date = DateType;
FormFilter.Select = CheckboxType;
FormFilter.Numeric = NumericType;
FormFilter.User = UserType;
FormFilter.Node = NodeType;
FormFilter.Binary = BinaryType;
FormFilter.File = FileType;
FormFilter.Form = FormType;
FormFilter.MultiLevel = MultiLevelType;

FormFilter.propTypes = {
  filters: PropTypes.array,
  formName: PropTypes.string,
  filterValues: PropTypes.object,
  onFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  containerStyles: PropTypes.object,
};

FormFilter.displayName = 'FilterFormElements';

export default FormFilter;
