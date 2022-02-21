import * as Styled from '../UserGroupsStyles';
import * as ModalStyles from './UserGroupUpsertModalStyles';
import Modal from 'components/Modal/Modal';
import { useState } from 'react';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import Button from 'components/Buttons/Button';
import useWindowContext from 'hooks/useWindowContext';
import SettingOutlineIcon from 'components/Icons/SettingOutlineIcon/SettingOutlineIcon';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

/**
 * @description create and edit user groups modal component
 * @param group group object to edit
 * @param createMode
 * @param users
 * @param onModalDelete
 * @param onModalConfirm
 * @return {JSX.Element}
 * @constructor
 */
const UserGroupUpsertModal = ({
  group,
  createMode,
  users,
  onModalDelete,
  onModalConfirm,
}) => {
  const listAnimationDuration = 150;
  const { RVDic } = useWindowContext();
  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: RVDic.SettingsOfN.replace('[n]', RVDic.Group),
    contentWidth: '34rem',
    titleClass: 'rv-default',
    titleContainerClass: 'modal-title-bar',
  });
  const [groupName, setGroupName] = useState(group ? group?.Name : '');
  const [members, setMembers] = useState(group ? group?.Members : []);

  const handleGroupNameChange = (name) => {
    setGroupName(name);
  };

  const checkSelection = (userID) => !!members.find((x) => x.UserID === userID);

  const deselect = (user) => {
    const _members = members.filter((u) => u.UserID !== user.UserID);
    setMembers(_members);
  };

  const selectMember = (user) => {
    const exist = !!members?.find((x) => x.UserID === user.UserID);

    if (!exist) setMembers([...members, user]);
  };

  const handleModalConfirm = () => {
    setModalInfo({ ...modalInfo, show: false });
    if (onModalConfirm) {
      onModalConfirm(groupName, members, group?.NodeID);
    }
  };

  const handleModalCancel = () => {
    setModalInfo({ ...modalInfo, show: false });
  };

  const handleDeleteGroup = () => {
    setModalInfo({ ...modalInfo, show: false });
    if (onModalDelete) {
      onModalDelete(group?.NodeID);
    }
  };

  return (
    <>
      {!createMode && (
        <ModalStyles.SettingButton
          onClick={() => setModalInfo({ ...modalInfo, show: true })}
        >
          <SettingOutlineIcon size={28} />
        </ModalStyles.SettingButton>
      )}

      {createMode && (
        <Styled.DashedBox
          onClick={() => setModalInfo({ ...modalInfo, show: true })}
        >
          <AddIcon circleOutline={true} size={48} />
          <div>{RVDic?.CreateNewN.replace('[n]', RVDic.Group)}</div>
        </Styled.DashedBox>
      )}

      <Modal {...modalInfo} onClose={() => handleModalCancel()}>
        <ModalStyles.ModalContent>
          <ModalStyles.InputLabel>
            {RVDic?.EnterTheGroupName}
          </ModalStyles.InputLabel>
          <ModalStyles.Input
            value={groupName}
            onChange={(name) => handleGroupNameChange(name)}
            type="text"
            placeholder={RVDic?.GroupName}
          />

          <ModalStyles.InputLabel>
            {RVDic?.SelectMembersOfTheGroup}
          </ModalStyles.InputLabel>
          <TransitionGroup
            duration={listAnimationDuration}
            component={ModalStyles.SelectedUsersContainer}
          >
            {[...members].map((x) => (
              <CSSTransition
                key={x?.UserID}
                timeout={listAnimationDuration}
                classNames="transition"
              >
                <UserChips user={x} onDelete={deselect} />
              </CSSTransition>
            ))}
          </TransitionGroup>

          <ModalStyles.UserContainer>
            {[...users].map((x) => (
              <UserItemRow
                key={x?.UserID}
                user={x}
                selected={checkSelection(x?.UserID)}
                onSelect={selectMember}
              />
            ))}
          </ModalStyles.UserContainer>

          <ModalStyles.ModalActionBar>
            <Button
              type="primary"
              style={buttonStyles}
              onClick={() => handleModalConfirm()}
            >
              {RVDic?.Save}
            </Button>

            <Button
              type="negative-o"
              style={buttonStyles}
              onClick={() => handleModalCancel()}
            >
              {RVDic?.Return}
            </Button>

            <ModalStyles.Spacer />

            {!!group && (
              <Button
                type="negative"
                style={buttonStyles}
                onClick={() => handleDeleteGroup()}
              >
                {RVDic.RemoveN.replace('[n]', RVDic.Group)}
              </Button>
            )}
          </ModalStyles.ModalActionBar>
        </ModalStyles.ModalContent>
      </Modal>
    </>
  );
};

const UserChips = ({ user, onDelete }) => {
  return (
    <ModalStyles.ChipsWrapper>
      <ModalStyles.ChipsContainer>
        <ModalStyles.ChipsProfileImage
          src={user?.ImageURL}
          alt={`${user?.FirstName} ${user?.LastName}`}
        />

        <ModalStyles.ChipsTitle>{`${user?.FullName}`}</ModalStyles.ChipsTitle>

        <ModalStyles.ChipsCloseIcon onClick={() => onDelete(user)}>
          <CloseIcon outline={true} size={21} />
        </ModalStyles.ChipsCloseIcon>
      </ModalStyles.ChipsContainer>
    </ModalStyles.ChipsWrapper>
  );
};

const UserItemRow = ({ user, selected, onSelect }) => {
  return (
    <ModalStyles.UserItemContainer onClick={() => onSelect(user)}>
      <ModalStyles.ProfileImage src={user?.ImageURL} highlight={selected} />
      <ModalStyles.UserTitle highlight={selected}>
        {user?.FullName}
      </ModalStyles.UserTitle>
    </ModalStyles.UserItemContainer>
  );
};

const buttonStyles = {
  height: '3rem',
  width: '7.5rem',
};
export default UserGroupUpsertModal;
