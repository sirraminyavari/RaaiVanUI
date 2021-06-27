import { useState, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';
import { createSelector } from 'reselect';
import * as Styled from 'views/Teams/Teams.styles';
import Avatar from 'components/Avatar/Avatar';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import Badge from 'components/Badge/Badge';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import { decodeBase64, getURL } from 'helpers/helpers';
import DeleteConfirm from 'components/Modal/Confirm';
import DeleteConfirmMSG from './DeleteConfirmMSG';
import UndoToast from 'components/toasts/undo-toast/UndoToast';
import {
  removeApplication,
  recycleApplication,
  selectApplication,
  modifyApplication,
  unsubscribeFromApplication,
  removeUserFromApplication,
} from 'store/actions/applications/ApplicationsAction';
import useWindow from 'hooks/useWindowContext';
import TeamPatternDefault from 'assets/images/intersection-2.svg';
import SortHandle from './SortHandle';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import InlineEdit from 'components/InlineEdit/InlineEdit';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import ExitIcon from 'components/Icons/ExitIcon/ExitIcon';
import Modal from 'components/Modal/Modal';
import { CV_DISTANT, CV_FREEZED, CV_RED } from 'constant/CssVariables';
import { BO_RADIUS_QUARTER } from 'constant/constants';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';

const selectingApp = createSelector(
  (state) => state.applications,
  (applications) => applications.selectingApp
);

const ActiveTeam = forwardRef(({ team, isDragging }, ref) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isSelecting, selectingAppId } = useSelector(selectingApp);
  const { RVDic, RV_Float, RV_RevFloat, RV_RTL } = useWindow();
  const [isConfirmShown, setIsConfirmShown] = useState(false);
  const [isModalShown, setIsModalShown] = useState(false);
  const isMobileScreen = useMediaQuery({
    query: '(max-width: 970px)',
  });

  const {
    Title,
    Description: appDescription,
    Users: appUsers,
    IconURL: appIcon,
    ApplicationID: appId,
    Removable: isRemovable,
    Editable: isEditable,
  } = team;
  const { TotalCount: totalUsers, Users: usersList } = appUsers;

  const [appTitle, setAppTitle] = useState(() => decodeBase64(Title));

  //TODO: fix bug
  if (usersList.length !== totalUsers) {
    console.log(usersList.length, totalUsers);
  }

  const handleEditTeam = (title) => {
    setAppTitle(title);
    dispatch(modifyApplication(appId, title));
  };

  const onTrashClick = (e) => {
    e.stopPropagation();
    handleTeamDelete();
    // setIsConfirmShown(true);
  };

  const onExitTeamClick = (e) => {
    e.stopPropagation();
    !isRemovable && dispatch(unsubscribeFromApplication(appId));
  };

  const handleCancelDelete = () => {
    if (isConfirmShown) {
      setIsConfirmShown(false);
    }
  };

  //! Undo team delete.
  const undoTeamDelete = (appId) => {
    dispatch(recycleApplication(appId, console.log));
  };

  //! Toastify user on team delete.
  const onRemoveDone = (removedAppId) => {
    const deleteMSG = 'تیم حذف خواهد شد';
    UndoToast({
      type: 'error',
      autoClose: 5000,
      message: deleteMSG,
      onUndo: () => undoTeamDelete(removedAppId),
      toastId: `delete-${removedAppId}`,
    });
  };

  //! Inform user on team remove error.
  const onRemoveError = (error) => {
    const toastOptions = {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    };
    toast(RVDic.MSG[error] || error, toastOptions);
  };

  //! Delete team with api on server.
  const handleTeamDelete = () => {
    dispatch(removeApplication(appId, onRemoveDone, onRemoveError));
    setIsConfirmShown(false);
  };

  const onSelectDone = () => {
    const homeURL = getURL('Home');
    history.push(homeURL);
  };

  //TODO: error handling
  const onSelectError = () => {};

  //! Select a team.
  const handleTeamSelect = (e) => {
    if (e.target.id === 'inline-edit') return;
    dispatch(selectApplication(appId, onSelectDone, onSelectError));
  };

  const openTeamUsers = (e) => {
    e.stopPropagation();
    setIsModalShown(true);
  };

  const handleCloseModal = () => {
    setIsModalShown(false);
  };

  const handleRemoveUser = (userId) => {
    dispatch(removeUserFromApplication(appId, userId));
  };

  return (
    <Styled.TeamConatiner
      ref={ref}
      isDragging={isDragging}
      isMobile={isMobileScreen}
      dir={RV_Float}
      revDir={RV_RevFloat}
      style={{ cursor: 'pointer' }}
      onClick={handleTeamSelect}>
      <DeleteConfirm
        title="حذف تیم "
        show={isConfirmShown}
        onCancel={handleCancelDelete}
        onClose={handleCancelDelete}
        onConfirm={handleTeamDelete}
        confirmText="حذف دایمی"
        cancelText={RVDic.Return}>
        <DeleteConfirmMSG
          title={appTitle}
          question="آیا از حذف تیم اطمینان دارید؟"
        />
      </DeleteConfirm>
      <Modal
        show={isModalShown}
        onClose={handleCloseModal}
        contentWidth="70%"
        title="هم تیمی ها">
        <div style={{ textAlign: 'center' }}>
          <div>{appTitle}</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.2rem',
              marginTop: '1rem',
            }}>
            {usersList.map((user) => {
              const isAuthUser =
                ((window.RVGlobal || {}).CurrentUser || {}).UserID ===
                user.UserID;
              const fullName = `${decodeBase64(user.FirstName)} ${decodeBase64(
                user.LastName
              )}`;
              const userName = decodeBase64(user.UserName);
              return (
                <Styled.ExtraUserItem
                  key={user.UserID}
                  className={BO_RADIUS_QUARTER}
                  style={{
                    border: `1px solid ${CV_DISTANT}`,
                    padding: '0.2rem 0.5rem',
                  }}>
                  <Avatar userImage={user.ProfileImageURL} radius={25} />
                  <Styled.ExtraUserTitle>{fullName}</Styled.ExtraUserTitle>
                  <Styled.ExtraUserTitle
                    className={BO_RADIUS_QUARTER}
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      backgroundColor: CV_FREEZED,
                      padding: '0.3rem',
                    }}>
                    {userName}
                  </Styled.ExtraUserTitle>
                  {isRemovable && !isAuthUser && (
                    <CloseIcon
                      onClick={() => handleRemoveUser(user.UserID)}
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
            })}
          </div>
        </div>
      </Modal>
      <SortHandle />
      <Styled.TeamPattern
        dir={RV_RevFloat}
        rtl={RV_RTL}
        src={TeamPatternDefault}
        alt="team-pattern"
      />
      {isSelecting && selectingAppId === appId ? (
        <LogoLoader style={{ marginTop: '2.5rem' }} />
      ) : (
        <Styled.TeamContentWrapper isDragging={isDragging}>
          <Styled.TeamDescription>
            <div>
              <Avatar
                radius={45}
                style={{ width: '50px' }}
                userImage={appIcon}
              />
            </div>
            {isEditable ? (
              <Styled.TeamTitle>
                <InlineEdit text={appTitle} onSetText={handleEditTeam} />
              </Styled.TeamTitle>
            ) : (
              <Styled.TeamTitle>{appTitle}</Styled.TeamTitle>
            )}

            <Styled.TeamExcerpt>
              {decodeBase64(appDescription)}
            </Styled.TeamExcerpt>
          </Styled.TeamDescription>
          <Styled.TeamFooterConatiner>
            <Styled.TeamAvatarsWrapper onClick={openTeamUsers}>
              {usersList
                ?.filter((_, index) => index < 4)
                .map((user, index) => {
                  return (
                    <Avatar
                      key={index}
                      userImage={user.ProfileImageURL}
                      radius={32}
                      style={{
                        position: 'relative',
                        [RV_Float]: `${-index * 9}px`,
                        zIndex: 10 - index,
                      }}
                      imageStyles={{ minWidth: '2.1rem' }}
                    />
                  );
                })}
              {usersList.length > 4 && (
                <PopupMenu
                  trigger="hover"
                  align="top"
                  arrowClass="hidden-arrow"
                  menuClass="extra-users-popup">
                  <Styled.ExtraUsersWrapper dir={RV_RevFloat}>
                    <Badge
                      showText={`${usersList.length - 4}+`}
                      className="team-extra-users"
                    />
                  </Styled.ExtraUsersWrapper>
                  {/* <div className="scroll"> */}
                  <PerfectScrollbar className="scroll">
                    {usersList
                      ?.filter((user, index) => index > 3 && user)
                      .map((user) => {
                        const fullName = `${decodeBase64(
                          user.FirstName
                        )} ${decodeBase64(user.LastName)}`;
                        return (
                          <Styled.ExtraUserItem key={user.UserID}>
                            <Avatar
                              userImage={user.ProfileImageURL}
                              radius={25}
                            />
                            <Styled.ExtraUserTitle>
                              {fullName}
                            </Styled.ExtraUserTitle>
                          </Styled.ExtraUserItem>
                        );
                      })}
                  </PerfectScrollbar>
                  {/* </div> */}
                </PopupMenu>
              )}
            </Styled.TeamAvatarsWrapper>
            {isRemovable && (
              <Styled.TeamTrashWrapper onClick={onTrashClick}>
                <TrashIcon />
              </Styled.TeamTrashWrapper>
            )}
            {!isRemovable && (
              <Styled.TeamExitWrapper onClick={onExitTeamClick}>
                <ExitIcon size={22} />
              </Styled.TeamExitWrapper>
            )}
          </Styled.TeamFooterConatiner>
        </Styled.TeamContentWrapper>
      )}
    </Styled.TeamConatiner>
  );
});

export default ActiveTeam;
