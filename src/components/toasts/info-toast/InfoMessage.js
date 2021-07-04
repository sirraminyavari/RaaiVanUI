import * as Styled from './InfoToast.styles';
import InfoIcon from 'components/Icons/InfoCircleIcon/InfoIcon';

const InfoMessage = (props) => {
  const { message } = props;

  return (
    <Styled.ToastMessageContainer>
      <Styled.InfoIconWrapper>
        <InfoIcon size={20} color="#000" />
      </Styled.InfoIconWrapper>
      <span
        style={{
          flexGrow: 1,
          justifySelf: 'start',
          padding: '0.5rem',
        }}>
        {message}
      </span>
    </Styled.ToastMessageContainer>
  );
};

export default InfoMessage;
