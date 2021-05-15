import { Component, Children } from 'react';
import TextType from './types/Text';
import DateType from './types/Date';

class FormEdit extends Component {
  static TextType = TextType;
  static DateType = DateType;

  handleOnChange = (value) => {
    console.log(value);
  };

  render() {
    return (
      <div>
        {Children.only(this.props.children({ onChange: this.handleOnChange }))}
      </div>
    );
  }
}

export default FormEdit;
