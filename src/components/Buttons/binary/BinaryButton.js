import * as Styled from './BinaryButton.styles';

/**
 * @typedef PropType
 * @type {Object}
 * @property {boolean} isChecked - The initial value.
 * @property {string[]} options - The button options.
 */

/**
 *  @description Renders an 'binary' button component.
 * @component
 * @param {PropType} props -Props that pass to button.
 */
const BinaryButton = (props) => {
  const { isChecked, options, className } = props;

  return (
    <Styled.ButtonContainer>
      <Styled.OptionWrapper isChecked={isChecked} classes={className}>
        {options[0]}
      </Styled.OptionWrapper>
      <Styled.OptionWrapper isChecked={!isChecked} classes={className}>
        {options[1]}
      </Styled.OptionWrapper>
    </Styled.ButtonContainer>
  );
};

export default BinaryButton;
