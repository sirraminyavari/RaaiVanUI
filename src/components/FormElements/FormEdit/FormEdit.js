import { Children } from 'react';
import TextType from './types/Text';
import DateType from './types/Date';

const FormEdit = (props) => {
  const { children } = props;
  const handleOnChange = (value) => {
    console.log(value);
  };

  return <div>{Children.only(children({ onChange: handleOnChange }))}</div>;
};

FormEdit.TextType = TextType;
FormEdit.DateType = DateType;

export default FormEdit;
