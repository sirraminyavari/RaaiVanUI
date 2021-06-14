import { TC_DEFAULT } from 'constant/Colors';
import * as Styled from 'views/Teams/Teams.styles';

const DeleteConfirmMSG = (props) => {
  const { title, icon: Icon, question, warning } = props;
  return (
    <Styled.ConfirmSpaceWrapper>
      <Styled.ConfirmSpaceTitle>
        {Icon && <Icon size={22} className={TC_DEFAULT} />}
        <span style={{ margin: '0.5rem' }}>{title}</span>
      </Styled.ConfirmSpaceTitle>
      {question && <Styled.ConfirmQuestion>{question}</Styled.ConfirmQuestion>}
      {warning && <Styled.ConfirmWarning>{warning}</Styled.ConfirmWarning>}
    </Styled.ConfirmSpaceWrapper>
  );
};

export default DeleteConfirmMSG;
