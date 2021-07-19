import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Modal from 'components/Modal/Modal';
import UsersGroupIcon from 'components/Icons/UsersGroupIcon/UsersGroup';
import MailIcon from 'components/Icons/MailIcon/MailIcon';
import InfoIcon from 'components/Icons/InfoCircleIcon/InfoIcon';
import LinkIcon from 'components/Icons/LinkIcon/LinkIcon';
import CopyIcon from 'components/Icons/CopyIcon/CopyIcon';
import * as Styled from 'views/Teams/Teams.styles';
import Button from 'components/Buttons/Button';
import Input from 'components/Inputs/Input';
import { CV_DISTANT, TCV_WARM } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import UserInviteField from './UserInviteField';
import { encodeBase64, API_Provider, getSystemName } from 'helpers/helpers';
import { USERS_API, INVITE_USER } from 'constant/apiConstants';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const inviteUserAPI = API_Provider(USERS_API, INVITE_USER);

const GET_LINK = 'get-link';
const SEND_LINK = 'send-link';
const DEFAULT_INPUT_COUNT = 3;

const UserInviteDialog = ({ setIsInviteShown, isInviteShown, appId }) => {
  const { RVDic, GlobalUtilities } = useWindow();
  const [invileLink, setInviteLink] = useState(
    'https://cliqmind.ir/join/eigpylugn8f7'
  );
  const [currentContent, setCurrentContent] = useState(SEND_LINK);
  const [isSendDisabled, setSendDisabled] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [inviteValues, setInviteValues] = useState({});
  const [sendingIndecies, setSendingIndecies] = useState([]);
  const [inputCount, setInputCount] = useState(DEFAULT_INPUT_COUNT);

  const invitationCount = Object.keys(inviteValues)?.length;

  const { isTabletOrMobile } = DimensionHelper();
  const isMobileScreen = useMediaQuery({ query: '(max-width: 600px)' });

  const getModalWidth = () => {
    if (isMobileScreen) {
      return '95%';
    } else if (isTabletOrMobile) {
      return '75%';
    } else {
      return '50%';
    }
  };

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

  const handleFieldChange = (f) => {
    setInviteValues((v) => ({ ...v, [f.fieldIndex]: f }));

    setSendingIndecies((v) => [...new Set([...v, f.fieldIndex])]);

    if (!f.mail) {
      setInviteValues((v) => {
        delete v[f.fieldIndex];
        return v;
      });
      setSendingIndecies((v) => v.filter((item) => item !== f.fieldIndex));
    }
  };

  useEffect(() => {
    if (!!invitationCount) {
      if (
        Object.values(inviteValues).every((v) => v.validation.mail === true)
      ) {
        setSendDisabled(false);
      } else {
        setSendDisabled(true);
      }
    } else {
      setIsSending(false);
      setSendDisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteValues]);

  useEffect(() => {
    if (invitationCount >= DEFAULT_INPUT_COUNT) {
      setInputCount(invitationCount + 1);
    } else {
      setInputCount(DEFAULT_INPUT_COUNT);
    }
  }, [invitationCount]);

  useEffect(() => {
    if (!isSendDisabled) {
      if (!sendingIndecies.length) {
        setIsSending(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendingIndecies]);

  const inviteUser = (name = '', mail = '', fieldIndex) => {
    inviteUserAPI.fetch(
      {
        ApplicationID: appId,
        Email: encodeBase64(GlobalUtilities.secure_string(mail)),
        FullName: encodeBase64(GlobalUtilities.secure_string(name)),
      },
      (response) => {
        setSendingIndecies((v) => v.filter((item) => item !== fieldIndex));

        if (response.Succeed) {
          const successMessage = `دعوت به ایمیل ${mail} ارسال شد`;
          InfoToast({
            type: 'info',
            autoClose: 5000,
            message: successMessage,
            toastId: `send-invitation-${mail}`,
          });
        } else if (response.ErrorText) {
          const errorMessage =
            RVDic.MSG[response.ErrorText] || response.ErrorText;
          InfoToast({
            type: 'error',
            autoClose: 5000,
            message: errorMessage,
            toastId: `send-invitation-${mail}`,
          });
        }
      },
      (err) => {
        const errorMessage = RVDic.MSG[err] || err;
        InfoToast({
          type: 'error',
          autoClose: 5000,
          message: errorMessage,
          toastId: `send-invitation-${mail}`,
        });
      }
    );
  };

  const handleSendInvitations = () => {
    const fields = Object.values(inviteValues);
    if (!!fields.length) {
      setIsSending(true);
      fields.forEach((field) => {
        const { name, mail, fieldIndex } = field;
        inviteUser(name, mail, fieldIndex);
      });
    }
  };

  return (
    <Modal
      show={isInviteShown}
      onClose={handleCloseInvitation}
      contentWidth={getModalWidth()}
      contentClass="invite-modal-container"
      title={RVDic.InviteNewTeamMate}>
      <Styled.AddUserModalHeader>
        <Styled.AddUserPlusSign>+</Styled.AddUserPlusSign>
        <UsersGroupIcon size={40} />
      </Styled.AddUserModalHeader>
      <Styled.AddUserActionsWrapper>
        {/* <Button
          onClick={activateGetLink}
          type="primary-o"
          classes={currentContent === GET_LINK ? 'active-tab' : 'inactive-tab'}>
          <LinkIcon size={20} />
          <span style={{ margin: '0 0.5rem' }}>{RVDic.GetInvitationLink}</span>
        </Button> */}
        {/* <Button
          onClick={activateSendLink}
          type="primary-o"
          classes={
            currentContent === SEND_LINK ? 'active-tab' : 'inactive-tab'
          }>
          <MailIcon fill size={20} />
          <span style={{ margin: '0 0.5rem' }}>{RVDic.SendInvitations}</span>
        </Button> */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            fontSize: '1rem',
            fontWeight: '500',
            color: TCV_WARM,
          }}>
          <MailIcon fill size={20} />
          <span style={{ margin: '0 0.5rem' }}>{RVDic.SendInvitations}</span>
        </div>
      </Styled.AddUserActionsWrapper>
      {/* {currentContent === GET_LINK && (
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
      )} */}
      {/* {currentContent === SEND_LINK && ( */}
      <Styled.InviteContent>
        <Styled.GetLinkTitle>
          {RVDic.InviteYourTeamMatesToRaaiVan.replace(
            '[RaaiVan]',
            getSystemName()
          )}
        </Styled.GetLinkTitle>
        <Styled.GetLinkInfoWrapper>
          <InfoIcon color={CV_DISTANT} size={16} />
          <Styled.GetLinkInfoTitle>
            {RVDic.Checks.EnterYourNewTeamMateEmailToSendInvitation}
          </Styled.GetLinkInfoTitle>
        </Styled.GetLinkInfoWrapper>
        {[...Array(inputCount).keys()].map((count, key) => {
          return (
            <UserInviteField
              key={key}
              fieldIndex={count + 1}
              onFieldChange={handleFieldChange}
            />
          );
        })}
        <Button
          loading={isSending}
          onClick={handleSendInvitations}
          classes="send-invitation-button"
          disable={isSendDisabled}>
          {RVDic.Send}
        </Button>
      </Styled.InviteContent>
      {/* )} */}
    </Modal>
  );
};

export default UserInviteDialog;
