import { cloneElement, Children } from 'react';
import TextType from './types/Text';
import DateType from './types/Date';

const FormFilter = (props) => {
  const handleOnChange = (value) => {
    console.log(value);
  };

  const getChild = (type) => {
    return Children.map(props.children, (child) => {
      if (child.type?.name !== type) return null;
      return cloneElement(child, { onChange: handleOnChange });
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {getChild('DateType')}
      {getChild('TextType')}
    </div>
  );
};

FormFilter.TextType = TextType;
FormFilter.DateType = DateType;

export default FormFilter;
