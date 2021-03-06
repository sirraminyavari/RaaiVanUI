/**
 * Renders a filter form elements.
 */
import { Fragment, useState, Children } from 'react';
import PropTypes from 'prop-types';
import TextType from './types/text/TextType';
import DateType from './types/date/DateType';
import CheckboxType from './types/checkbox/CheckboxType';
import SelectType from './types/select/SelectType';
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
import PerfectScrollBar from 'components/ScrollBarProvider/ScrollBarProvider';

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
    setValues((oldValues) => ({ ...oldValues, [filter.id]: filter.value }));
  };

  //! Clalls when user clicks on filter button.
  const handleOnFilterClick = () => {
    onFilter && onFilter(values);
  };

  //! clear the filter form.
  const clearFilter = () => {
    setValues({});
  };

  //! Close form filter.
  const closeFormFilter = () => {
    onCloseFilter();
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
          <PerfectScrollBar style={{ padding: '1.5rem', width: '100%' }}>
            {/* <Styled.FiltersWrapper> */}
            {filters.map((filter, key) => {
              return (
                <Fragment key={key}>
                  {FormFilter[filter.Type] && //! Check if this type of filter component exists.
                    FormFilter[filter.Type]({
                      onChange: handleOnChange,
                      data: filter,
                      value: values[filter.ElementID],
                    })}
                </Fragment>
              );
            })}
            {/* </Styled.FiltersWrapper> */}
          </PerfectScrollBar>
          <Styled.FilterButtonWrapper>
            <FilterButton
              onClick={handleOnFilterClick}
              style={{ width: '50%', fontSize: '1rem' }}
              type="primary-o">
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
FormFilter.Select = SelectType;
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
