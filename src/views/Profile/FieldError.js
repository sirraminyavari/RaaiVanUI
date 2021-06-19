import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import * as Styled from './Profile.styles';

const FieldError = ({ error }) => {
  return (
    <Styled.ErrorContainer>
      <Styled.ErrorIconWrapper>
        <CloseIcon size={10} color="#fff" />
      </Styled.ErrorIconWrapper>
      <Styled.ErrorMessage>{error}</Styled.ErrorMessage>
    </Styled.ErrorContainer>
  );
};

export default FieldError;
