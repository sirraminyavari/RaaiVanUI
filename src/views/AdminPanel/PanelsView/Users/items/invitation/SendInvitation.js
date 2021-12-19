import * as Styled from './InvitaionStyle';
import InfoCircleIcon from 'components/Icons/InfoCircleIcon/InfoIcon';
import UserInvitationForm from './UserInvitationForm';
import styled from 'styled-components';
import Button from 'components/Buttons/Button';

const SendInvitation = () => {
  return (
    <>
      <Styled.Title>
        {'هم‌تیمی های خود را به کلیک‌مایند دعوت کنید!'}
      </Styled.Title>
      <Styled.SubtitleContainer>
        <InfoCircleIcon size={16} />
        <Styled.SubTitle>
          {'برای ارسال دعوت‌نامه به هم‌تیمی جدید، ایمیل او را وارد کنید'}
        </Styled.SubTitle>
      </Styled.SubtitleContainer>

      <form>
        <UserInvitationForm></UserInvitationForm>
        <UserInvitationForm></UserInvitationForm>
        <UserInvitationForm></UserInvitationForm>
      </form>

      <ActionBar>
        <Button
          style={{
            height: '3rem',
            width: '8.25rem',
          }}
          disable={true}>
          ارسال
        </Button>
      </ActionBar>
    </>
  );
};

const ActionBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 3rem;
`;
export default SendInvitation;
