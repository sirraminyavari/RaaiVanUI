import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SortableHandle } from 'react-sortable-hoc';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';
import * as Styled from '../../../Teams.styles';
import DragIcon from 'components/Icons/DragIcon/Drag';
import Avatar from 'components/Avatar/Avatar';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import Badge from 'components/Badge/Badge';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import { decodeBase64 } from 'helpers/helpers';
import DeleteConfirm from 'components/Modal/Confirm';
import DeleteConfirmMSG from './DeleteConfirmMSG';
import UndoToast from 'components/toasts/undo-toast/UndoToast';
import APIHandler from 'apiHelper/APIHandler';
import useHover from 'hooks/useHover';
import {
  removeApplication,
  recycleApplication,
} from 'store/actions/applications/ApplicationsAction';
import { getSidebarNodes } from 'store/actions/sidebar/sidebarMenuAction';
import getConfigPanels from 'store/actions/sidebar/sidebarPanelsAction';
import useWindow from 'hooks/useWindowContext';

const selectTeamAPI = new APIHandler('RVAPI', 'SelectApplication');

const SortHandle = SortableHandle(({ tabIndex }) => (
  <Styled.DragIconWrapper tabIndex={tabIndex}>
    <DragIcon />
  </Styled.DragIconWrapper>
));

const ActiveTeam = ({ team, hasHandle }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { RVGlobal, RVDic } = useWindow();
  const [isConfirmShown, setIsConfirmShown] = useState(false);
  const [trashRef, isTrashHovered] = useHover();
  const isMobileScreen = useMediaQuery({
    query: '(max-width: 970px)',
  });

  const {
    Title: appTitle,
    Description: appDescription,
    Users: appUsers,
    IconURL: appIcon,
    ApplicationID: appId,
  } = team;
  const { TotalCount: totalUsers, Users: usersList } = appUsers;
  const { IsSystemAdmin } = RVGlobal;

  const onTrashClick = (e) => {
    e.stopPropagation();
    handleTeamDelete();
    // setIsConfirmShown(true);
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

  //! Redirect user to home page on team select.
  const onGetNodes = () => {
    history.push('/home');
  };

  //! Select a team.
  const handleTeamSelect = () => {
    try {
      selectTeamAPI.fetch(
        { ApplicationID: appId, ParseResults: true },
        (response) => {
          if (response.Succeed) {
            window.RVGlobal.ApplicationID = appId;
            dispatch(getSidebarNodes(onGetNodes));
            dispatch(getConfigPanels());
          }
        },
        (error) => console.log(error)
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Styled.TeamConatiner
      isMobile={isMobileScreen}
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
          title={decodeBase64(appTitle)}
          question="آیا از حذف تیم اطمینان دارید؟"
        />
      </DeleteConfirm>
      {hasHandle && <SortHandle />}
      <Styled.TeamContentWrapper>
        <Styled.TeamDescription>
          <div>
            <Avatar radius={45} style={{ width: '50px' }} userImage={appIcon} />
          </div>
          <Styled.TeamTitle>{decodeBase64(appTitle)}</Styled.TeamTitle>
          <Styled.TeamExcerpt>
            {!!appDescription
              ? decodeBase64(appDescription)
              : 'کلیک مایند. مغز تیم شما!'}
          </Styled.TeamExcerpt>
        </Styled.TeamDescription>
        <Styled.TeamFooterConatiner>
          <Styled.TeamAvatarsWrapper>
            {usersList
              ?.filter((_, index) => index > 0)
              .map((user, index) => {
                return (
                  <Avatar
                    key={index}
                    userImage={user.ProfileImageURL}
                    radius={32}
                    style={{
                      position: 'relative',
                      right: `${-index * 9}px`,
                      zIndex: 10 - index,
                    }}
                  />
                );
              })}
            {totalUsers > 1 && (
              <PopupMenu
                trigger="hover"
                align="top"
                arrowClass="hidden-arrow"
                menuClass="extra-users-popup">
                <Styled.ExtraUsersWrapper>
                  <Badge
                    showText={`${totalUsers - 1}+`}
                    className="team-extra-users"
                  />
                </Styled.ExtraUsersWrapper>
                <div className="non-scroll">
                  {usersList
                    ?.filter((user, index) => index > 0 && user)
                    .map((user) => {
                      return (
                        <Styled.ExtraUserItem key={user.UserID}>
                          <Avatar
                            color="#333"
                            userImage={user.ProfileImageURL}
                            style={{ width: '30px' }}
                            radius={25}
                          />
                          <Styled.ExtraUserTitle>
                            {`${decodeBase64(user.FirstName)} ${decodeBase64(
                              user.LastName
                            )}`}
                          </Styled.ExtraUserTitle>
                        </Styled.ExtraUserItem>
                      );
                    })}
                </div>
              </PopupMenu>
            )}
          </Styled.TeamAvatarsWrapper>
          {IsSystemAdmin && (
            <Styled.TeamTrashWrapper isHovered={isTrashHovered} ref={trashRef}>
              <TrashIcon onClick={onTrashClick} />
            </Styled.TeamTrashWrapper>
          )}
        </Styled.TeamFooterConatiner>
      </Styled.TeamContentWrapper>
    </Styled.TeamConatiner>
  );
};

export default ActiveTeam;
