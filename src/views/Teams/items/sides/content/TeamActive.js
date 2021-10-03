import { useState, forwardRef, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';
import { createSelector } from 'reselect';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import * as Styled from 'views/Teams/Teams.styles';
import Avatar from 'components/Avatar/Avatar';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import MoreIcon from 'components/Icons/ShowMoreIcons/ShowMore';
import AddImageIcon from 'components/Icons/AddImageIcon/AddImageIcon';
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
import UserPlusIcon from 'components/Icons/UserPlusIcon/UserPlus';
import { CV_RED, TCV_DEFAULT } from 'constant/CssVariables';
import LoadingIconCircle from 'components/Icons/LoadingIcons/LoadingIconCircle';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import TeamConfirm from './TeamConfirm';
import ExtraUsersList from './ExtraUsersList';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import HiddenUploadFile from 'components/HiddenUploadFile/HiddenUploadFile';
import { API_Provider } from 'helpers/helpers';
import { DOCS_API, UPLOAD_ICON } from 'constant/apiConstants';
import { SIDEBAR_WINDOW } from 'constant/constants';
import { themeSlice } from 'store/reducers/themeReducer';
import useOnClickOutside from 'hooks/useOnClickOutside';
import UserInvitationDialog from './UserInviteDialog';

const getUploadUrlAPI = API_Provider(DOCS_API, UPLOAD_ICON);

const EXIT_TEAM_CONFIRM = 'exit-team';
const DELETE_TEAM_CONFIRM = 'remove-team';
const MAX_IMAGE_SIZE = 2000000;

const { toggleSidebar } = themeSlice.actions;

const selectingApp = createSelector(
  (state) => state?.applications,
  (applications) => applications?.selectingApp
);

const ActiveTeam = forwardRef(({ team, isDragging }, ref) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const uploadFileRef = useRef();
  const actionRef = useRef();
  const { isSelecting, selectingAppId } = useSelector(selectingApp);
  const { RVDic, RV_Float, RV_RevFloat, RV_RTL, RVGlobal } = useWindow();
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

  const isAdmin = (RVGlobal || {}).IsSystemAdmin;
  const currentUser = (RVGlobal || {}).CurrentUser;

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
    if (!!currentUser?.Settings?.[SIDEBAR_WINDOW]) {
      //! Open sidebar by default.
      dispatch(toggleSidebar(true));
    }
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
    if (isDeleting || !isAdmin) return;
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

  //! Once user clicked on team edit button, It will open choose image dialoge.
  const handleChangeLogo = (e) => {
    if (!isAdmin) return;
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

  const handleClickMoreIcon = (e) => {
    e.stopPropagation();
  };

  const renderMoreContent = () => {
    return (
      <Styled.TeamActionContainer
        ref={actionRef}
        data-action={`team-action-${appId}`}>
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
            <span className="team-action-title">خروج از تیم</span>
          </Styled.TeamExitWrapper>
        )}
      </Styled.TeamActionContainer>
    );
  };

  useEffect(() => {
    dispatch(getApplicationUsers(appId, '', onGetUsers));

    //? Due to memory leak error in component.
    //! Clean up.
    return () => {
      setUsers([]);
    };
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
            <Styled.TeamAvatarWrapper>
              {isAdmin && (
                <Styled.TeamEditWrapper onClick={handleChangeLogo}>
                  <AddImageIcon color="#fff" size={18} />
                  <HiddenUploadFile
                    ref={uploadFileRef}
                    onFileChange={handleFileSelect}
                  />
                </Styled.TeamEditWrapper>
              )}
              <Avatar
                radius={45}
                style={{ width: '3.1rem' }}
                userImage={appIcon + `?timeStamp=${new Date().getTime()}`}
              />
            </Styled.TeamAvatarWrapper>
            {!isDeleting && isEditable ? (
              <Styled.TeamTitle>
                <InlineEdit
                  text={appTitle}
                  onSetText={handleEditTeam}
                  textClasses="team-inline-edit-text"
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
                isAdmin && (
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
              renderContent={renderMoreContent}>
              <Styled.MoreIconWrapper onClick={handleClickMoreIcon}>
                <MoreIcon size={28} className="team-more-icon" />
              </Styled.MoreIconWrapper>
            </Tooltip>
          </Styled.TeamFooterConatiner>
        </Styled.TeamContentWrapper>
      )}
    </Styled.TeamConatiner>
  );
});

export default ActiveTeam;
