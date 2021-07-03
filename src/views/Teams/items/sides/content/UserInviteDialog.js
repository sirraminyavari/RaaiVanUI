import { useState } from 'react';
import Modal from 'components/Modal/Modal';
import UsersGroupIcon from 'components/Icons/UsersGroupIcon/UsersGroup';
import MailIcon from 'components/Icons/MailIcon/MailIcon';
import InfoIcon from 'components/Icons/InfoCircleIcon/InfoIcon';
import LinkIcon from 'components/Icons/LinkIcon/LinkIcon';
import CopyIcon from 'components/Icons/CopyIcon/CopyIcon';
import * as Styled from 'views/Teams/Teams.styles';
import Button from 'components/Buttons/Button';
import Input from 'components/Inputs/Input';
import { CV_DISTANT } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';

const GET_LINK = 'get-link';
const SEND_LINK = 'send-link';

const UserInviteDialog = ({ setIsInviteShown, isInviteShown }) => {
  const { RVDic } = useWindow();
  const [invileLink, setInviteLink] = useState(
    'https://cliqmind.ir/join/eigpylugn8f7'
  );
  const [currentContent, setCurrentContent] = useState(GET_LINK);

  const handleCloseInvitation = () => {
    setIsInviteShown(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invileLink);
  };

  const activateGetLink = () => {
    setCurrentContent(GET_LINK);
  };

  const activateSendLink = () => {
    setCurrentContent(SEND_LINK);
  };

  return (
    <Modal
      show={isInviteShown}
      onClose={handleCloseInvitation}
      contentWidth="50%"
      title="دعوت هم تیمی جدید">
      <Styled.AddUserModalHeader>
        <Styled.AddUserPlusSign>+</Styled.AddUserPlusSign>
        <UsersGroupIcon size={40} />
      </Styled.AddUserModalHeader>
      <Styled.AddUserActionsWrapper>
        <Button
          onClick={activateGetLink}
          type="primary-o"
          classes={currentContent === GET_LINK ? 'active-tab' : 'inactive-tab'}>
          <LinkIcon size={20} />
          <span style={{ margin: '0 0.5rem' }}>دریافت لینک دعوت</span>
        </Button>
        <Button
          onClick={activateSendLink}
          type="primary-o"
          classes={
            currentContent === SEND_LINK ? 'active-tab' : 'inactive-tab'
          }>
          <MailIcon fill size={20} />
          <span style={{ margin: '0 0.5rem' }}>ارسال دعوتنامه</span>
        </Button>
      </Styled.AddUserActionsWrapper>
      {currentContent === GET_LINK && (
        <Styled.InviteContent>
          <Styled.GetLinkTitle>
            لینک زیر را برای هم تیمی جدید خود بفرستید
          </Styled.GetLinkTitle>
          <Styled.GetLinkInfoWrapper>
            <InfoIcon color={CV_DISTANT} size={16} />
            <Styled.GetLinkInfoTitle>
              با لینک زیر هرکسی می‌تواند عضو تیم شود، عضویت کاربر به مدیر اطلاع
              داده می‌شود
            </Styled.GetLinkInfoTitle>
          </Styled.GetLinkInfoWrapper>
          <Styled.GetLinkFieldWrapper>
            <Button onClick={copyToClipboard}>
              <CopyIcon size={20} />
              <span style={{ margin: '0 0.5rem' }}>{RVDic.Copy}</span>
            </Button>
            <Input className="get-link-input" value={invileLink} readOnly />
          </Styled.GetLinkFieldWrapper>
        </Styled.InviteContent>
      )}
      {currentContent === SEND_LINK && (
        <Styled.InviteContent>
          <Styled.GetLinkTitle>
            هم‌تیمی های خود را به کلیک‌مایند دعوت کنید
          </Styled.GetLinkTitle>
          <Styled.GetLinkInfoWrapper>
            <InfoIcon color={CV_DISTANT} size={16} />
            <Styled.GetLinkInfoTitle>
              برای ارسال دعوت‌نامه به هم‌تیمی جدید، ایمیل او را وارد کنید
            </Styled.GetLinkInfoTitle>
          </Styled.GetLinkInfoWrapper>
        </Styled.InviteContent>
      )}
    </Modal>
  );
};

export default UserInviteDialog;
