import useWindowContext from 'hooks/useWindowContext';
import * as Styled from './UsersStyle';
import styled from 'styled-components';
import { CV_DISTANT, CV_WHITE } from 'constant/CssVariables';
import UsersGroupIcon from 'components/Icons/UsersGroupIcon/UsersGroup';
import { useState } from 'react';
import InvitationTypeButton from './items/invitation/InvitationTypeButton';
import MailIcon from 'components/Icons/MailIcon/MailIcon';
import LinkIcon from 'components/Icons/LinkIcon/LinkIcon';
import InvitationLink from './items/invitation/InvitaionLink';
import SendInvitation from './items/invitation/SendInvitation';

const UsersInvitation = ({ onClose }) => {
  const { RV_RTL, RVDic } = useWindowContext();
  const [getLink, setGetLink] = useState(false);

  const breadCrumbItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: '',
    },
    {
      id: 2,
      title: RVDic?.UserManagement,
      linkTo: '',
    },
    {
      id: 3,
      title: RVDic?.InviteNewTeamMate,
      linkTo: '',
    },
  ];

  return (
    <>
      <Styled.BreadCrumbWrapper items={breadCrumbItems} rtl={RV_RTL} />
      <Styled.HeadingWrapper>{RVDic.InviteNewTeamMate}</Styled.HeadingWrapper>
      <Styled.ReturnButtonWrapper rtl={RV_RTL}>
        <Styled.ReturnButton onClick={onClose}>
          {RVDic?.Return}
        </Styled.ReturnButton>
      </Styled.ReturnButtonWrapper>

      <IconContainer>
        <UsersGroupIcon size={64} />
      </IconContainer>

      <InvitationTypeAction>
        <InvitationTypeButton
          disabled
          selected={getLink}
          render={<LinkIcon size={14} />}
          onClick={() => setGetLink(true)}
        >
          {` `}
        </InvitationTypeButton>

        <InvitationTypeButton
          selected={!getLink}
          render={<MailIcon size={14} fill={true} />}
          onClick={() => setGetLink(false)}
        >
          {'ارسال دعوت‌نامه'}
        </InvitationTypeButton>
      </InvitationTypeAction>

      <InvitationBox linkType={getLink}>
        {getLink ? <InvitationLink /> : <SendInvitation />}
      </InvitationBox>
    </>
  );
};

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 8rem;
  height: 8rem;
  background-color: ${CV_WHITE};
  color: ${CV_DISTANT};
  border-radius: 100%;
  margin: 2rem auto;
`;
IconContainer.displayName = 'IconContainer';

const InvitationTypeAction = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
`;
InvitationTypeAction.displayName = 'InvitationTypeAction';

const InvitationBox = styled.div`
  background-color: ${CV_WHITE};
  border-radius: 0.8rem;
  border: 1px solid ${CV_DISTANT};
  padding: 2.4rem;
  width: 100%;
  margin: 1.5rem auto 6rem auto;
  transition: all 0.3s ease-out;
  max-width: ${({ linkType }) => (linkType ? '34rem' : '60rem')};
  height: ${({ linkType }) => (linkType ? '12rem' : '27rem')};
`;
InvitationBox.displayName = 'InvitationBox';
export default UsersInvitation;
