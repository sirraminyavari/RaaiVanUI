import { Component, cloneElement, Children } from 'react';
import TextType from './types/Text';
import DateType from './types/Date';

class FormFilter extends Component {
  static TextType = TextType;
  static DateType = DateType;

  handleOnChange = (value) => {
    console.log(value);
  };

  #getChild = (type) => {
    return Children.map(this.props.children, (child) => {
      if (child.type.name !== type) return null;
      return cloneElement(child, { onChange: this.handleOnChange });
    });
  };

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {this.#getChild('DateType')}
        {this.#getChild('TextType')}
      </div>
    );
  }
}

export default FormFilter;
