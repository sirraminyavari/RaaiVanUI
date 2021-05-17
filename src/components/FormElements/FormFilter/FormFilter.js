import { Fragment, useState, useContext } from 'react';
import { WindowContext } from 'context/WindowProvider';
import TextType from './types/TextType';
import DateType from './types/DateType';
import SuggestType from './types/SuggestType';
import RadioType from './types/RadioType';
import * as Styled from './FormFilter.styles';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import UndoIcon from 'components/Icons/UndoIcon/Undo';
import FilterButton from 'components/Buttons/Button';
import ToggleButton from 'components/Buttons/Toggle/Toggle';

const FormFilter = (props) => {
  const { filters, onFilter } = props;
  const { RVDic } = useContext(WindowContext);

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

FormFilter.SuggestType = SuggestType;
FormFilter.TextType = TextType;
FormFilter.DateType = DateType;
FormFilter.RadioType = RadioType;

export default FormFilter;
