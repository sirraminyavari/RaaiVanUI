import { useState, forwardRef, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';
import { createSelector } from 'reselect';
import ReactTooltip from 'react-tooltip';
import * as GlobalStyled from 'views/Teams/Teams.styles';
import * as Styled from './WorkspaceTeamCard.styles';
import Avatar from 'components/Avatar/Avatar';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import MoreIcon from 'components/Icons/ShowMoreIcons/ShowMore';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import Badge from 'components/Badge/Badge';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import { decodeBase64 } from 'helpers/helpers';
import UndoToast from 'components/toasts/undo-toast/UndoToast';
import {
  removeApplication,
  recycleApplication,
  selectApplication,
  unsubscribeFromApplication,
  getApplicationUsers,
} from 'store/actions/applications/ApplicationsAction';
import useWindow from 'hooks/useWindowContext';
import TeamPatternDefault from 'assets/images/intersection-2.svg';
import SortHandle from '../SortHandle';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import ExitIcon from 'components/Icons/ExitIcon/ExitIcon';
import TeamUsersModal from './TeamUsersModal';
import UserPlusIcon from 'components/Icons/UserPlusIcon/UserPlus';
import { CV_RED, TCV_DEFAULT } from 'constant/CssVariables';
import LoadingIconCircle from 'components/Icons/LoadingIcons/LoadingIconCircle';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import TeamConfirm from '../TeamConfirm';
import ExtraUsersList from './ExtraUsersList';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import { SIDEBAR_WINDOW } from 'constant/constants';
import { themeSlice } from 'store/reducers/themeReducer';
import useOnClickOutside from 'hooks/useOnClickOutside';
import UserInvitationDialog from './UserInviteDialog';

const EXIT_TEAM_CONFIRM = 'exit-team';
const DELETE_TEAM_CONFIRM = 'remove-team';

const { toggleSidebar } = themeSlice.actions;

const selectingApp = createSelector(
  (state) => state?.applications,
  (applications) => applications?.selectingApp
);

const ActiveTeam = forwardRef(({ team, isDragging }, ref) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const actionRef = useRef();
  const { isSelecting, selectingAppId } = useSelector(selectingApp);
  const { RVDic, RV_Float, RV_RevFloat, RV_RTL, RVGlobal, GlobalUtilities } =
    useWindow();
  const [isModalShown, setIsModalShown] = useState(false);
  const [isInviteShown, setIsInviteShown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirm, setConfirm] = useState({
    type: '',
    message: '',
    title: '',
    isOpen: false,
  });

  const handleOnClickOutside = (e) => {
    ReactTooltip.hide();
  };

  useOnClickOutside(actionRef, handleOnClickOutside);

  const isMobileScreen = useMediaQuery({
    query: '(max-width: 970px)',
  });

  const {
    Title,
    Description: appDescription,
    Users: appUsers,
    IconURL,
    ApplicationID: appId,
    Removable: isRemovable,
    Editable: isEditable,
  } = team;

  const isAdmin = isEditable || isRemovable;
  const currentUser = (RVGlobal || {}).CurrentUser;

  const { TotalCount: totalUsers, Users: usersList } = appUsers;

  const [users, setUsers] = useState(usersList);

  const shownUsers = users?.filter((_, index) => index < 4);

  //! Close confirmation dialogue and reset its values.
  const resetConfirm = () =>
    setConfirm({ type: '', message: '', title: '', isOpen: false });

  //! Close undo toast when user clicks on "X" button.
  const closeUndoToast = (toastId) => {
    toast.dismiss(toastId);
  };

  //! Inform user on team delete.
  const onRemoveDone = (removedAppId) => {
    const deleteMSG = RVDic.Confirms.TheTeamWillBeArchived;
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
    const title = RVDic.LeaveN.replace('[n]', RVDic.Team);
    setConfirm({ type: EXIT_TEAM_CONFIRM, message, title, isOpen: true });
  };

  //! Undo team delete.
  const undoTeamDelete = (appId) => {
    dispatch(recycleApplication(appId, () => {}, true));
  };

  //! Redirect user to right path when team selection was successful.
  const onSelectDone = (path) => {
    history.push(path);
    if (!!currentUser?.Settings?.[SIDEBAR_WINDOW]) {
      //! Open sidebar by default.
      dispatch(toggleSidebar(true));
    }
  };

  //! Fires when team selection has error.
  const onSelectError = () => {};

  //! Select a team.
  const handleTeamSelect = (onSuccess, onError) => {
    if (isDeleting) return;

    dispatch(selectApplication(appId, onSuccess, onError));
  };

  //! Go to team settings page.
  const onTeamSettingsClick = (e) => {
    e.stopPropagation();

    handleTeamSelect(history.push(`/teamsettings/${appId}`), onSelectError);
  };

  //! Open team users management dialogue.
  const openTeamUsers = (e) => {
    e.stopPropagation();
    if (isDeleting) return;
    setIsModalShown(true);
  };

  const getAdditionalTeamUsers = () => {
    if (isDeleting) return;
    dispatch(getApplicationUsers(appId, '', onGetUsers));
  };

  //! Get users for each team.
  const onGetUsers = (users) => {
    setUsers(users);
  };

  //! Shows invitation modal.
  const handleInviteUser = (e) => {
    e.stopPropagation();
    if (isDeleting || !isAdmin) return;
    setIsInviteShown(true);
    // dispatch(openInvitationModal(team));
  };

  //! Handle Which type of confirmation dialogue should open.
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

  //! Fires when user cancel the confirmation.
  const handleCancelConfirmation = () => {
    resetConfirm();
  };

  const handleClickMoreIcon = (e) => {
    e.stopPropagation();
  };

  const renderMoreContent = () => {
    return (
      <Styled.TeamActionContainer
        ref={actionRef}
        data-action={`team-action-${appId}`}
      >
        {isRemovable ? (
          isDeleting ? (
            <LoadingIconCircle
              style={{ maxWidth: '1.5rem', maxHeight: '1.5rem' }}
              color={TCV_DEFAULT}
            />
          ) : (
            <Styled.TeamDeleteWrapper onClick={handleTeamDelete}>
              <TrashIcon />
              <span className="team-action-title">
                {RVDic.RemoveN.replace('[n]', RVDic.Team)}
              </span>
            </Styled.TeamDeleteWrapper>
          )
        ) : (
          <Styled.TeamExitWrapper onClick={onExitTeamClick}>
            <ExitIcon size={22} />
            <span className="team-action-title">
              {RVDic.LeaveN.replace('[n]', RVDic.Team)}
            </span>
          </Styled.TeamExitWrapper>
        )}
        {isEditable && (
          <Styled.TeamExitWrapper onClick={onTeamSettingsClick}>
            <SettingIcon size={18} />
            <span className="team-action-title">{RVDic.TeamSettings}</span>
          </Styled.TeamExitWrapper>
        )}
      </Styled.TeamActionContainer>
    );
  };

  useEffect(() => {
    isModalShown && getAdditionalTeamUsers();

    //? Due to memory leak error in component.
    //! Clean up.
    return () => {
      // setUsers([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalShown]);

  return (
    <GlobalStyled.TeamContainer
      ref={ref}
      isDragging={isDragging}
      isMobile={isMobileScreen}
      dir={RV_Float}
      revDir={RV_RevFloat}
      style={{ cursor: 'pointer' }}
      onClick={() => handleTeamSelect(onSelectDone, onSelectError)}
    >
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
          appTitle={decodeBase64(Title)}
          isModalShown={isModalShown}
          isRemovable={isRemovable}
          setIsModalShown={setIsModalShown}
          setUsers={setUsers}
          users={users}
        />
      )}
      {/* <Suspense fallback={<ModalFallbackLoader />}> */}
      {!isDeleting && (
        <UserInvitationDialog
          app={team}
          isInviteShown={isInviteShown}
          setIsInviteShown={setIsInviteShown}
        />
      )}
      {/* </Suspense> */}

      <SortHandle />
      <GlobalStyled.TeamPattern
        dir={RV_RevFloat}
        rtl={RV_RTL}
        src={TeamPatternDefault}
        alt="team-pattern"
      />
      {isSelecting && selectingAppId === appId ? (
        <LogoLoader style={{ marginTop: '2.5rem' }} />
      ) : (
        <Styled.TeamContentWrapper>
          <Styled.TeamDescription>
            <Styled.TeamAvatarWrapper>
              <Avatar
                radius={45}
                style={{ width: '3.1rem' }}
                userImage={GlobalUtilities.add_timestamp(IconURL)}
              />
            </Styled.TeamAvatarWrapper>
            <Styled.TeamTitle>{decodeBase64(Title)}</Styled.TeamTitle>
            <Styled.TeamExcerpt>
              {decodeBase64(appDescription)}
            </Styled.TeamExcerpt>
          </Styled.TeamDescription>
          <Styled.TeamFooterContainer>
            <Styled.TeamAvatarsWrapper>
              {shownUsers?.map((user, index) => {
                const fullName = `${decodeBase64(
                  user.FirstName
                )} ${decodeBase64(user.LastName)}`;
                return (
                  <Tooltip
                    tipId={user?.UserID}
                    key={user?.UserID || index}
                    effect="solid"
                    place="bottom"
                    ignoreTip={isDragging}
                    renderContent={() => fullName}
                  >
                    <Avatar
                      onClick={openTeamUsers}
                      userImage={user?.ProfileImageURL}
                      // radius={38}
                      style={{
                        position: 'relative',
                        [RV_Float]: `${-index * 1}rem`,
                        // zIndex: 10 - index,
                        width: '3rem',
                        minWidth: '3rem',
                      }}
                    />
                  </Tooltip>
                );
              })}
              {users?.length > 4 ? (
                <PopupMenu
                  trigger="hover"
                  align="top"
                  arrowClass="hidden-arrow"
                  menuClass="extra-users-popup"
                >
                  <Styled.ExtraUsersWrapper>
                    <Badge
                      onMouseOver={getAdditionalTeamUsers}
                      showText={`${totalUsers - 4}+`}
                      className="team-extra-users"
                    />
                  </Styled.ExtraUsersWrapper>
                  <ExtraUsersList
                    users={users}
                    isAdmin={isAdmin}
                    handleInviteUser={handleInviteUser}
                  />
                </PopupMenu>
              ) : (
                isAdmin && (
                  <Styled.AddUserWrapper
                    usersCount={shownUsers?.length}
                    onClick={handleInviteUser}
                    rtl={RV_RTL}
                    dir={RV_RevFloat}
                  >
                    <UserPlusIcon
                      size={22}
                      color={TCV_DEFAULT}
                      style={{ marginLeft: '0.4rem' }}
                    />
                  </Styled.AddUserWrapper>
                )
              )}
            </Styled.TeamAvatarsWrapper>
            <Tooltip
              tipId={`team-more-action-${appId}`}
              effect="solid"
              event="click"
              clickable
              place={RV_RevFloat}
              arrowColor="transparent"
              backgroundColor="transparent"
              offset={{ [RV_Float]: 70 }}
              ignoreTip={isDragging}
              renderContent={renderMoreContent}
            >
              <Styled.MoreIconWrapper onClick={handleClickMoreIcon}>
                <MoreIcon size={28} className="team-more-icon" />
              </Styled.MoreIconWrapper>
            </Tooltip>
          </Styled.TeamFooterContainer>
        </Styled.TeamContentWrapper>
      )}
    </GlobalStyled.TeamContainer>
  );
});

export default ActiveTeam;
