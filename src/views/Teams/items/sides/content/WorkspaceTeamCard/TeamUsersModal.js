import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'components/Modal/Modal';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import * as Styled from './WorkspaceTeamCard.styles';
import Avatar from 'components/Avatar/Avatar';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { decodeBase64 } from 'helpers/helpers';
import { CV_DISTANT, CV_FREEZED, CV_RED } from 'constant/CssVariables';
import { BO_RADIUS_QUARTER } from 'constant/constants';
import { removeUserFromApplication } from 'store/actions/applications/ApplicationsAction';
import TeamConfirm from '../TeamConfirm';
import useWindow from 'hooks/useWindowContext';

const TeamUsersModal = ({
  appTitle,
  users,
  isRemovable,
  setUsers,
  appId,
  isModalShown,
  setIsModalShown,
}) => {
  const dispatch = useDispatch();
  const { RVDic, RVGlobal, GlobalUtilities } = useWindow();

  const [confirm, setConfirm] = useState({
    user: null,
    message: '',
    title: '',
    isOpen: false,
  });

  //! RVDic i18n variables
  const RVDicTeamMates = RVDic.TeamMates;
  const RVDicTitle = RVDic.RemoveUserFromTheTeam;

  const resetConfirm = () =>
    setConfirm({ user: null, message: '', title: '', isOpen: false });

  const handleCloseModal = () => {
    setIsModalShown(false);
  };

  const handleRemoveUser = (user) => {
    const fullName = `${decodeBase64(user.FirstName)} ${decodeBase64(
      user.LastName
    )}`;
    const message = RVDic.Confirms.DoYouWantToRemoveN.replace(
      '[n]',
      `"${fullName}"`
    );
    setConfirm({ user, message, title: RVDicTitle, isOpen: true });
  };

  const handleConfirmation = () => {
    dispatch(removeUserFromApplication(appId, confirm?.user?.UserID));
    setUsers((oldUsers) =>
      oldUsers.filter((user) => user?.UserID !== confirm?.user?.UserID)
    );
    resetConfirm();
  };

  const handleCancelConfirmation = () => {
    resetConfirm();
  };

  return (
    <Modal
      show={isModalShown}
      onClose={handleCloseModal}
      contentWidth="40%"
      title={RVDicTeamMates}
    >
      <TeamConfirm
        isOpen={confirm.isOpen}
        onConfirm={handleConfirmation}
        onCancel={handleCancelConfirmation}
        message={confirm.message}
        title={confirm.title}
      />
      <div style={{ textAlign: 'center' }}>
        {appTitle}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '0.2rem',
            marginTop: '1rem',
          }}
        >
          {!users.length ? (
            <LogoLoader />
          ) : (
            users?.map((user) => {
              const isAuthUser =
                ((RVGlobal || {}).CurrentUser || {}).UserID === user?.UserID;
              const fullName = `${decodeBase64(user?.FirstName)} ${decodeBase64(
                user?.LastName
              )}`;
              const userName = decodeBase64(user?.UserName);
              return (
                <Styled.ExtraUserItem
                  key={user?.UserID}
                  className={BO_RADIUS_QUARTER}
                  style={{
                    border: `1px solid ${CV_DISTANT}`,
                    padding: '0.2rem 0.5rem',
                  }}
                >
                  <Avatar
                    userImage={GlobalUtilities.add_timestamp(
                      user?.ProfileImageURL
                    )}
                    radius={25}
                  />
                  <Styled.ExtraUserTitle>{fullName}</Styled.ExtraUserTitle>
                  <Styled.ExtraUserTitle
                    className={BO_RADIUS_QUARTER}
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      backgroundColor: CV_FREEZED,
                      padding: '0.3rem',
                    }}
                  >
                    {userName}
                  </Styled.ExtraUserTitle>
                  {isRemovable && !isAuthUser && (
                    <CloseIcon
                      onClick={() => handleRemoveUser(user)}
                      color={CV_RED}
                      style={{
                        position: 'absolute',
                        left: '0.5rem',
                        cursor: 'pointer',
                      }}
                    />
                  )}
                </Styled.ExtraUserItem>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TeamUsersModal;
