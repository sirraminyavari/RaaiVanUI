import * as Styled from '../../../Teams.styles';

const DeleteConfirmMSG = (props) => {
  const { title, icon: Icon, question, warning } = props;
  return (
    <div style={{ margin: '0 2.5rem' }}>
      <Styled.ConfirmSpaceTitle>
        {Icon && <Icon size={22} color="#2B7BE4" />}
        <span style={{ margin: '0.5rem' }}>{title}</span>
      </Styled.ConfirmSpaceTitle>
      {question && <Styled.ConfirmQuestion>{question}</Styled.ConfirmQuestion>}
      {warning && <Styled.ConfirmWarning>{warning}</Styled.ConfirmWarning>}
    </div>
  );
};

export default DeleteConfirmMSG;
