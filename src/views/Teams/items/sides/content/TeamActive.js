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
} from 'store/actions/applications/ApplicationsAction';
import useWindow from 'hooks/useWindowContext';
import TeamPatternDefault from 'assets/images/intersection-2.svg';
import SortHandle from './SortHandle';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';

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
  const isMobileScreen = useMediaQuery({
    query: '(max-width: 970px)',
  });

  const {
    Title: appTitle,
    Description: appDescription,
    Users: appUsers,
    IconURL: appIcon,
    ApplicationID: appId,
    Removable: isRemovable,
  } = team;
  const { TotalCount: totalUsers, Users: usersList } = appUsers;

  if (usersList.length !== totalUsers) {
    console.log(usersList.length, totalUsers);
  }

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

  const onSelectDone = () => {
    const homeURL = getURL('Home');
    history.push(homeURL);
  };

  //TODO: error handling
  const onSelectError = () => {};

  //! Select a team.
  const handleTeamSelect = () => {
    dispatch(selectApplication(appId, onSelectDone, onSelectError));
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
          title={decodeBase64(appTitle)}
          question="آیا از حذف تیم اطمینان دارید؟"
        />
      </DeleteConfirm>
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
                  <div className="non-scroll">
                    {usersList
                      ?.filter((user, index) => index > 3 && user)
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
            {isRemovable && (
              <Styled.TeamTrashWrapper onClick={onTrashClick}>
                <TrashIcon />
              </Styled.TeamTrashWrapper>
            )}
          </Styled.TeamFooterConatiner>
        </Styled.TeamContentWrapper>
      )}
    </Styled.TeamConatiner>
  );
});

export default ActiveTeam;
