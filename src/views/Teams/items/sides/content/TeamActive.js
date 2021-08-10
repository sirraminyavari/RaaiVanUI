import { useState, forwardRef, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';
import { createSelector } from 'reselect';
import axios from 'axios';
import * as Styled from 'views/Teams/Teams.styles';
import Avatar from 'components/Avatar/Avatar';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import Badge from 'components/Badge/Badge';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import { decodeBase64 } from 'helpers/helpers';
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
import ExitIcon from 'components/Icons/ExitIcon/ExitIcon';
import TeamUsersModal from './TeamUsersModal';
import UserInvitationDialog from './UserInviteDialog';
import UserPlusIcon from 'components/Icons/UserPlusIcon/UserPlus';
import { CV_RED, TCV_DEFAULT } from 'constant/CssVariables';
import LoadingIconCircle from 'components/Icons/LoadingIcons/LoadingIconCircle';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import TeamConfirm from './TeamConfirm';
import ToolTip from 'components/Tooltip/react-tooltip/Tooltip';
import ExtraUsersList from './ExtraUsersList';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import HiddenUploadFile from 'components/HiddenUploadFile/HiddenUploadFile';
import { API_Provider } from 'helpers/helpers';
import { DOCS_API, UPLOAD_ICON } from 'constant/apiConstants';
// import { invitationSlice } from 'store/reducers/invitationsReducer';

// const { openInvitationModal } = invitationSlice.actions;
const getUploadUrlAPI = API_Provider(DOCS_API, UPLOAD_ICON);

const EXIT_TEAM_CONFIRM = 'exit-team';
const DELETE_TEAM_CONFIRM = 'remove-team';
const MAX_IMAGE_SIZE = 2000000;

const selectingApp = createSelector(
  (state) => state?.applications,
  (applications) => applications?.selectingApp
);

const ActiveTeam = forwardRef(({ team, isDragging }, ref) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const uploadFileRef = useRef();
  const { isSelecting, selectingAppId } = useSelector(selectingApp);
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
    IconURL,
    ApplicationID: appId,
    Removable: isRemovable,
    Editable: isEditable,
  } = team;
  const { TotalCount: totalUsers, Users: usersList } = appUsers;

  const [appTitle, setAppTitle] = useState(() => decodeBase64(Title));
  const [appIcon, setAppIcon] = useState(IconURL);
  const [users, setUsers] = useState(usersList);

  const shownUsers = users?.filter((_, index) => index < 4);

  //! Close confirmation dialoge and reset its values.
  const resetConfirm = () =>
    setConfirm({ type: '', message: '', title: '', isOpen: false });

  //! Edit team title.
  const handleEditTeam = (title) => {
    setAppTitle(title);
    dispatch(modifyApplication(appId, title));
  };

  //! Close undo toast when user clicks on "X" button.
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

  //! Redirect user to right path when team selection was successful.
  const onSelectDone = (path) => {
    history.push(path);
  };

  //! Fires when team selection has error.
  const onSelectError = () => {};

  //! Select a team.
  const handleTeamSelect = (e) => {
    if (e.target.id === 'inline-edit') return;
    if (isDeleting) return;
    dispatch(selectApplication(appId, onSelectDone, onSelectError));
  };

  //! Open team users management dialoge.
  const openTeamUsers = (e) => {
    e.stopPropagation();
    if (isDeleting) return;
    setIsModalShown(true);
  };

  //! Get users for each team.
  const onGetUsers = (users) => {
    setUsers(users);
  };

  //! Shows invitation modal.
  const handleInviteUser = (e) => {
    e.stopPropagation();
    if (isDeleting) return;
    setIsInviteShown(true);
    // dispatch(openInvitationModal(team));
  };

  //! Handle Which type of confirmation dialoge should open.
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

  //! Once user clicked on team logo, It will open choose image dialoge.
  const handleClickLogo = (e) => {
    e.stopPropagation();
    uploadFileRef.current.click();
  };

  //! Validates image type for upload.
  const validateImageUpload = (files) =>
    files[0]?.type === 'image/png' || files[0]?.type === 'image/jpeg';

  //! Read image file, Set preview image, And upload it to the server.
  const uploadImage = (event) => {
    const file = event.target.files[0];
    if (file.size <= MAX_IMAGE_SIZE) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setAppIcon(e.target.result);

        //! Load on server.
        let formData = new FormData();
        formData.append('file', file);

        getUploadUrlAPI.url(
          { IconID: appId, Type: 'ApplicationIcon' },
          (response) => {
            let uploadURL = response.slice(5);

            //! Post file to the server.
            axios
              .post(uploadURL, formData)
              .then((response) => console.log(response));
          },
          (err) => {
            console.log(err);
          }
        );
      };
    } else {
      event.target.value = '';
      console.log('Upload less than 2MB');
    }
  };

  //! Fires whenever user chooses an image.
  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files.length === 1 && validateImageUpload(files)) {
      uploadImage(event);
    } else {
      event.target.value = '';
      console.log('Add one image only');
    }
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
          app={team}
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
        <Styled.TeamContentWrapper>
          <Styled.TeamDescription>
            <Styled.TeamAvatarWrapper onClick={handleClickLogo}>
              <Avatar
                radius={45}
                style={{ width: '3.1rem' }}
                userImage={appIcon}
              />
            </Styled.TeamAvatarWrapper>
            <HiddenUploadFile
              ref={uploadFileRef}
              onFileChange={handleFileSelect}
            />
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
                    renderContent={() => fullName}>
                    <Avatar
                      onClick={openTeamUsers}
                      userImage={user?.ProfileImageURL}
                      radius={38}
                      style={{
                        position: 'relative',
                        [RV_Float]: `${-index * 9}px`,
                        zIndex: 10 - index,
                      }}
                      imageStyles={{ minWidth: '2.1rem' }}
                    />
                  </Tooltip>
                );
              })}
              {users?.length > 4 ? (
                <PopupMenu
                  trigger="hover"
                  align="top"
                  arrowClass="hidden-arrow"
                  menuClass="extra-users-popup">
                  <Styled.ExtraUsersWrapper>
                    <Badge
                      showText={`${totalUsers - 4}+`}
                      className="team-extra-users"
                    />
                  </Styled.ExtraUsersWrapper>
                  <ExtraUsersList
                    users={users}
                    handleInviteUser={handleInviteUser}
                  />
                </PopupMenu>
              ) : (
                <Styled.AddUserWrapper
                  usersCount={shownUsers?.length}
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
            {isRemovable ? (
              <ToolTip
                tipId={`delete-team-${appId}`}
                effect="solid"
                type="dark"
                place="bottom"
                ignoreTip={isDragging}
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
            ) : (
              <ToolTip
                tipId={`leave-team-${appId}`}
                effect="solid"
                type="dark"
                place="bottom"
                ignoreTip={isDragging}
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
