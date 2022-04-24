import * as Styled from './BinaryButton.styles';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Boolean | null} isChecked - The initial value.
 * @property {String[]} options - The button options.
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
      <Styled.OptionWrapper
        isChecked={isChecked === null ? null : isChecked}
        classes={className}
      >
        {options?.yes}
      </Styled.OptionWrapper>
      <Styled.OptionWrapper
        isChecked={isChecked === null ? null : !isChecked}
        classes={className}
      >
        {options?.no}
      </Styled.OptionWrapper>
    </Styled.ButtonContainer>
  );
};

export default BinaryButton;
