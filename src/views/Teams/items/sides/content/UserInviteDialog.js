import { useCallback, useEffect, useState } from 'react';
import Modal from 'components/Modal/Modal';
import useWindow from 'hooks/useWindowContext';
import Button from 'components/Buttons/Button';
import AnimatedInpit from 'components/Inputs/AnimatedInput';
import { encodeBase64, API_Provider } from 'helpers/helpers';
import { USERS_API, INVITE_USER } from 'constant/apiConstants';

const inviteUserAPI = API_Provider(USERS_API, INVITE_USER);

const UserInviteDialog = ({ setIsInviteShown, isInviteShown, appId }) => {
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [isInviteActive, setInviteActive] = useState(false);

  const { RVDic, GlobalUtilities } = useWindow();

  const handleCloseInvitation = () => {
    setIsInviteShown(false);
    setInviteName('');
    setInviteEmail('');
    setInviteMessage('');
  };

  const handleNameValue = useCallback((value) => {
    setInviteName(value);
  }, []);

  const handleEmailValue = (value) => {
    setInviteEmail(value);
  };

  const handleInviteMessage = (e) => {
    setInviteMessage(e.target.value);
  };

  const inviteUser = () => {
    inviteUserAPI.fetch(
      {
        ApplicationID: appId,
        Email: encodeBase64(GlobalUtilities.secure_string(inviteEmail)),
        FullName: encodeBase64(GlobalUtilities.secure_string(inviteName)),
        MessageText: encodeBase64(GlobalUtilities.secure_string(inviteMessage)),
      },
      (response) => {
        if (response.Succeed) {
          setIsInviteShown(false);
        }
      },
      (err) => console.log(err)
    );
  };

  useEffect(() => {
    if (!!inviteName && !!inviteEmail) {
      setInviteActive(true);
    } else {
      setInviteActive(false);
    }
  }, [inviteName, inviteEmail]);

  return (
    <Modal
      show={isInviteShown}
      onClose={handleCloseInvitation}
      contentWidth="60%"
      title="دعوت از دوستان">
      <AnimatedInpit
        value={inviteName}
        placeholder={RVDic.Name}
        onChange={handleNameValue}
        style={{ marginBottom: '1.5rem' }}
      />
      <AnimatedInpit
        value={inviteEmail}
        placeholder={RVDic.EMail}
        onChange={handleEmailValue}
        style={{ marginBottom: '1.5rem' }}
      />
      <textarea
        rows="5"
        placeholder={RVDic.MessageText}
        value={inviteMessage}
        style={{ width: '100%', padding: '1rem' }}
        onChange={handleInviteMessage}
      />
      <Button disable={!isInviteActive} onClick={inviteUser}>
        {RVDic.Invite}
      </Button>
    </Modal>
  );
};

export default UserInviteDialog;
