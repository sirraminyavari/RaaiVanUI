import { Fragment, useState } from 'react';
import TextType from './types/Text';
import DateType from './types/Date';
import SuggestType from './types/Suggest';
import RadioType from './types/Radio';
import * as Styled from './FormFilter.styles';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import UndoIcon from 'components/Icons/UndoIcon/Undo';
import FilterButton from 'components/Buttons/Button';

const FormFilter = (props) => {
  const { filters, onFilter } = props;

  const initState = filters.map((filter) => ({
    type: filter.Type,
    value: null,
  }));

  const [valuse, setvalues] = useState(initState);

  const handleOnChange = (value) => {
    setvalues((oldValues) =>
      oldValues.map((ov) => {
        if (ov.type === value.type) {
          return value;
        }
        return ov;
      })
    );
  };

  const handleOnFilterClick = () => {
    onFilter && onFilter(valuse);
  };

  return (
    <Styled.FormFilterContainer>
      <Styled.FormFilterHeader>
        <UndoIcon style={{ cursor: 'pointer' }} />
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
      <FilterButton
        onClick={handleOnFilterClick}
        style={{ width: '50%', margin: '3rem 0 0 0', fontSize: '1rem' }}
        type="primary-o">
        اعمال فیلتر
      </FilterButton>
    </Styled.FormFilterContainer>
  );
};

FormFilter.SuggestType = SuggestType;
FormFilter.TextType = TextType;
FormFilter.DateType = DateType;
FormFilter.RadioType = RadioType;

export default FormFilter;
