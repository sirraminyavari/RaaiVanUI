import { useState, forwardRef, useEffect } from 'react';
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
import UndoToast from 'components/toasts/undo-toast/UndoToast';
import {
  removeApplication,
  recycleApplication,
  selectApplication,
  modifyApplication,
  unsubscribeFromApplication,
  getApplicationUsers,
} from 'store/actions/applications/ApplicationsAction';
import useWindow from 'hooks/useWindowContext';
import TeamPatternDefault from 'assets/images/intersection-2.svg';
import SortHandle from './SortHandle';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import InlineEdit from 'components/InlineEdit/InlineEdit';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import ExitIcon from 'components/Icons/ExitIcon/ExitIcon';
import TeamUsersModal from './TeamUsersModal';
import UserInvitationDialog from './UserInviteDialog';
import UserPlusIcon from 'components/Icons/UserPlusIcon/UserPlus';
import { CV_RED, TCV_DEFAULT } from 'constant/CssVariables';
import LoadingIconCircle from 'components/Icons/LoadingIcons/LoadingIconCircle';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { INTRO_ONBOARD } from 'constant/constants';
import TeamConfirm from './TeamConfirm';
import ToolTip from 'components/Tooltip/react-tooltip/Tooltip';

const EXIT_TEAM_CONFIRM = 'exit-team';
const DELETE_TEAM_CONFIRM = 'remove-team';

const selectingApp = createSelector(
  (state) => state?.applications,
  (applications) => applications?.selectingApp
);

const selecteOnboardingName = createSelector(
  (state) => state?.onboarding,
  (onboarding) => onboarding?.name
);

const ActiveTeam = forwardRef(({ team, isDragging }, ref) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isSelecting, selectingAppId } = useSelector(selectingApp);
  const onboardingName = useSelector(selecteOnboardingName);
  const { RVDic, RV_Float, RV_RevFloat, RV_RTL } = useWindow();
  const [isModalShown, setIsModalShown] = useState(false);
  const [isInviteShown, setIsInviteShown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirm, setConfirm] = useState({
    type: '',
    message: '',
    title: '',
    isOpen: false,
  });

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
  const [users, setUsers] = useState(usersList);

  const resetConfirm = () =>
    setConfirm({ type: '', message: '', title: '', isOpen: false });

  const handleEditTeam = (title) => {
    setAppTitle(title);
    dispatch(modifyApplication(appId, title));
  };

  const closeUndoToast = (toastId) => {
    toast.dismiss(toastId);
  };

  //! Inform user on team delete.
  const onRemoveDone = (removedAppId) => {
    const deleteMSG = 'تیم حذف خواهد شد';
    UndoToast({
      autoClose: 7000,
      message: deleteMSG,
      onUndo: () => undoTeamDelete(removedAppId),
      toastId: `delete-${removedAppId}`,
      closeButton: (
        <CloseIcon
          onClick={() => closeUndoToast(`delete-${removedAppId}`)}
          color={CV_RED}
        />
      ),
    });
    setIsDeleting(false);
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
    setIsDeleting(false);
  };

  //! Delete team.
  const handleTeamDelete = (e) => {
    e.stopPropagation();
    const message = RVDic.Confirms.DoYouWantToRemoveN.replace(
      '[n]',
      `"${decodeBase64(Title)}"`
    );
    const title = RVDic.RemoveN.replace('[n]', RVDic.Team);
    setConfirm({ type: DELETE_TEAM_CONFIRM, message, title, isOpen: true });
  };

  //! Exit from team.
  const onExitTeamClick = (e) => {
    e.stopPropagation();
    const message = RVDic.Confirms.DoYouWantToLeaveN.replace(
      '[n]',
      `"${decodeBase64(Title)}"`
    );
    const title = 'خروج از تیم';
    setConfirm({ type: EXIT_TEAM_CONFIRM, message, title, isOpen: true });
  };

  //! Undo team delete.
  const undoTeamDelete = (appId) => {
    dispatch(recycleApplication(appId, () => {}, true));
  };

  const onSelectDone = () => {
    const homeURL = getURL('Home');
    const classesURL = getURL('Classes');
    if (!!onboardingName && onboardingName === INTRO_ONBOARD) {
      history.push(classesURL);
    } else {
      history.push(homeURL);
    }
  };

  const onSelectError = () => {};

  //! Select a team.
  const handleTeamSelect = (e) => {
    if (e.target.id === 'inline-edit') return;
    if (isDeleting) return;
    dispatch(selectApplication(appId, onSelectDone, onSelectError));
  };

  const openTeamUsers = (e) => {
    e.stopPropagation();
    if (isDeleting) return;
    setIsModalShown(true);
  };

  const onGetUsers = (users) => {
    setUsers(users);
  };

  const handleInviteUser = (e) => {
    e.stopPropagation();
    if (isDeleting) return;
    setIsInviteShown(true);
  };

  const handleConfirmation = () => {
    switch (confirm.type) {
      case EXIT_TEAM_CONFIRM:
        !isRemovable && dispatch(unsubscribeFromApplication(appId));
        resetConfirm();
        break;
      case DELETE_TEAM_CONFIRM:
        setIsDeleting(true);
        dispatch(removeApplication(appId, onRemoveDone, onRemoveError));
        resetConfirm();
        break;

      default:
        resetConfirm();
        break;
    }
  };
  const handleCancelConfirmation = () => {
    resetConfirm();
  };

  useEffect(() => {
    dispatch(getApplicationUsers(appId, '', onGetUsers));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Styled.TeamConatiner
      ref={ref}
      isDragging={isDragging}
      isMobile={isMobileScreen}
      dir={RV_Float}
      revDir={RV_RevFloat}
      style={{ cursor: 'pointer' }}
      onClick={handleTeamSelect}>
      <TeamConfirm
        isOpen={confirm.isOpen}
        onConfirm={handleConfirmation}
        onCancel={handleCancelConfirmation}
        message={confirm.message}
        title={confirm.title}
      />
      {!isDeleting && (
        <TeamUsersModal
          appId={appId}
          appTitle={appTitle}
          isModalShown={isModalShown}
          isRemovable={isRemovable}
          setIsModalShown={setIsModalShown}
          setUsers={setUsers}
          users={users}
        />
      )}
      {!isDeleting && (
        <UserInvitationDialog
          appId={appId}
          isInviteShown={isInviteShown}
          setIsInviteShown={setIsInviteShown}
        />
      )}
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
            {!isDeleting && isEditable ? (
              <Styled.TeamTitle>
                <InlineEdit
                  text={appTitle}
                  onSetText={handleEditTeam}
                  textClasses="inline-edit-truncate"
                />
              </Styled.TeamTitle>
            ) : (
              <Styled.TeamTitle>{appTitle}</Styled.TeamTitle>
            )}

            <Styled.TeamExcerpt>
              {decodeBase64(appDescription)}
            </Styled.TeamExcerpt>
          </Styled.TeamDescription>
          <Styled.TeamFooterConatiner>
            <Styled.TeamAvatarsWrapper>
              {users
                ?.filter((_, index) => index < 4)
                .map((user, index) => {
                  return (
                    <Avatar
                      key={index}
                      onClick={openTeamUsers}
                      userImage={user?.ProfileImageURL}
                      radius={38}
                      style={{
                        position: 'relative',
                        // [RV_Float]: `${-index * 9}px`,
                        zIndex: 10 - index,
                      }}
                      imageStyles={{ minWidth: '2.1rem' }}
                    />
                  );
                })}
              {users?.length > 4 ? (
                <PopupMenu
                  trigger="hover"
                  align="top"
                  arrowClass="hidden-arrow"
                  menuClass="extra-users-popup">
                  <Styled.ExtraUsersWrapper
                    usersCount={totalUsers}
                    dir={RV_Float}>
                    <Badge
                      showText={`${totalUsers - 4}+`}
                      className="team-extra-users"
                    />
                  </Styled.ExtraUsersWrapper>
                  <div>
                    <Styled.ExtraUsersPopupHeader onClick={handleInviteUser}>
                      <Styled.AddUserWrapper
                        style={{
                          width: '2rem',
                          height: '2rem',
                          lineHeight: '2.5rem',
                        }}
                        rtl={RV_RTL}>
                        <UserPlusIcon
                          size={16}
                          color={TCV_DEFAULT}
                          style={{ marginLeft: '0.3rem' }}
                        />
                      </Styled.AddUserWrapper>
                      <Styled.ExtraUsersPopupTitle>
                        افزودن هم تیمی جدید
                      </Styled.ExtraUsersPopupTitle>
                    </Styled.ExtraUsersPopupHeader>
                    <PerfectScrollbar className="extra-users-scrollbar">
                      {users
                        ?.filter((user, index) => index > 3 && user)
                        .map((user, i, self) => {
                          const fullName = `${decodeBase64(
                            user.FirstName
                          )} ${decodeBase64(user?.LastName)}`;
                          const isLast = self.length === i + 1;
                          return (
                            <Styled.ExtraUserItem
                              key={user?.UserID}
                              style={{ marginBottom: isLast ? '0.5rem' : '0' }}>
                              <Avatar
                                userImage={user?.ProfileImageURL}
                                radius={25}
                              />
                              <Styled.ExtraUserTitle>
                                {fullName}
                              </Styled.ExtraUserTitle>
                            </Styled.ExtraUserItem>
                          );
                        })}
                    </PerfectScrollbar>
                  </div>
                </PopupMenu>
              ) : (
                <Styled.AddUserWrapper
                  // usersCount={totalUsers}
                  onClick={handleInviteUser}
                  rtl={RV_RTL}
                  dir={RV_RevFloat}>
                  <UserPlusIcon
                    size={22}
                    color={TCV_DEFAULT}
                    style={{ marginLeft: '0.4rem' }}
                  />
                </Styled.AddUserWrapper>
              )}
            </Styled.TeamAvatarsWrapper>
            {isRemovable && (
              <ToolTip
                tipId={`delete-team-${appId}`}
                effect="solid"
                type="dark"
                place="bottom"
                renderContent={() => RVDic.RemoveN.replace('[n]', RVDic.Team)}>
                <Styled.TeamTrashWrapper onClick={handleTeamDelete}>
                  {isDeleting ? (
                    <LoadingIconCircle
                      style={{ maxWidth: '1.5rem', maxHeight: '1.5rem' }}
                      color={TCV_DEFAULT}
                    />
                  ) : (
                    <TrashIcon />
                  )}
                </Styled.TeamTrashWrapper>
              </ToolTip>
            )}
            {!isRemovable && (
              <ToolTip
                tipId={`leave-team-${appId}`}
                effect="solid"
                type="dark"
                place="bottom"
                renderContent={() => RVDic.LeaveN.replace('[n]', RVDic.Team)}>
                <Styled.TeamExitWrapper onClick={onExitTeamClick}>
                  <ExitIcon size={22} />
                </Styled.TeamExitWrapper>
              </ToolTip>
            )}
          </Styled.TeamFooterConatiner>
        </Styled.TeamContentWrapper>
      )}
    </Styled.TeamConatiner>
  );
});

export default ActiveTeam;
