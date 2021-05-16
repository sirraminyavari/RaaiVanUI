import { Fragment } from 'react';
import TextType from './types/Text';
import DateType from './types/Date';
import SuggestType from './types/Suggest';
import RadioType from './types/Radio';
import * as Styled from './FormFilter.styles';

const FormFilter = (props) => {
  const { filters } = props;

  const handleOnChange = (value) => {
    console.log(value);
  };

  return (
    <Styled.FormFilterContainer>
      <div>فیلترهای پیشرفته</div>
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
    </Styled.FormFilterContainer>
  );
};

FormFilter.SuggestType = SuggestType;
FormFilter.TextType = TextType;
FormFilter.DateType = DateType;
FormFilter.RadioType = RadioType;

export default FormFilter;
