import { Fragment, useState, useContext } from 'react';
import { WindowContext } from 'context/WindowProvider';
import TextType from './types/text/TextType';
import DateType from './types/date/DateType';
import SuggestType from './types/SuggestType';
import SelectType from './types/select/SelectType';
import NumericType from './types/numeric/NumericType';
import * as Styled from './FormFilter.styles';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import UndoIcon from 'components/Icons/UndoIcon/Undo';
import FilterButton from 'components/Buttons/Button';
import ToggleButton from 'components/Buttons/Toggle/Toggle';

const FormFilter = (props) => {
  const { filters, onFilter } = props;
  const { RVDic } = useContext(WindowContext);

  const initState = filters.reduce((state, filter) => {
    return { ...state, [filter.Type]: null };
  }, {});

  const [values, setvalues] = useState(initState);

  //! Calls on every filter type change.
  const handleOnChange = (filter) => {
    setvalues((oldValues) => ({ ...oldValues, [filter.type]: filter.value }));
  };
  console.table(values);

  //! Clalls when user clicks on filter button.
  const handleOnFilterClick = () => {
    onFilter && onFilter(values);
  };

  //! clear the filter form.
  const clearFilter = () => {
    setvalues(initState);
  };

  return (
    <Styled.FormFilterContainer>
      <Styled.FormFilterHeader>
        <UndoIcon style={{ cursor: 'pointer' }} onClick={clearFilter} />
        <Styled.FormFilterTitle>فیلترهای پیشرفته</Styled.FormFilterTitle>
        <CloseIcon color="red" size={18} style={{ cursor: 'pointer' }} />
      </Styled.FormFilterHeader>
      {filters.map((filter, key) => {
        return (
          <Fragment key={key}>
            {FormFilter[filter.Type] && //! Check if this type of filter component exists.
              FormFilter[filter.Type]({
                onChange: handleOnChange,
                data: filter,
              })}
          </Fragment>
        );
      })}
      <Styled.FilterToggleContainer>
        <Styled.FilterToggleTitle>{RVDic.ExactSearch}</Styled.FilterToggleTitle>
        <ToggleButton onToggle={(v) => console.log(v)} />
      </Styled.FilterToggleContainer>
      <FilterButton
        onClick={handleOnFilterClick}
        style={{ width: '50%', margin: '1rem 0 0 0', fontSize: '1rem' }}
        type="primary-o">
        اعمال فیلتر
      </FilterButton>
    </Styled.FormFilterContainer>
  );
};

FormFilter.Checkbox = SuggestType;
FormFilter.Text = TextType;
FormFilter.Date = DateType;
FormFilter.Select = SelectType;
FormFilter.Numeric = NumericType;

export default FormFilter;
