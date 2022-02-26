import * as ModalStyles from './UserGroupUpsertModalStyles';
import Modal from 'components/Modal/Modal';
import { useState } from 'react';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import Button from 'components/Buttons/Button';
import useWindowContext from 'hooks/useWindowContext';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

/**
 * @description create and edit user groups modal component
 * @param group group object to edit
 * @param users
 * @param onConfirm
 * @param onCancel
 * @param onDelete
 * @return {JSX.Element}
 * @constructor
 */
const UserGroupUpsertModal = ({
  group,
  users,
  onConfirm,
  onCancel,
  onDelete,
}) => {
  const listAnimationDuration = 150;
  const { RVDic } = useWindowContext();
  const [groupName, setGroupName] = useState(group ? group?.Name : '');
  const [members, setMembers] = useState(group ? group?.Members : []);

  const handleGroupNameChange = (e) => {
    setGroupName(e?.target?.value);
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
    if (onConfirm) onConfirm(groupName, members, group?.NodeID);
  };

  const handleModalCancel = () => {
    if (onCancel) onCancel();
  };

  const handleDeleteGroup = () => {
    if (onDelete) onDelete(group?.NodeID);
  };

  return (
    <>
      <ModalStyles.ModalContent>
        <ModalStyles.InputLabel>
          {RVDic?.EnterTheGroupName}
        </ModalStyles.InputLabel>
        <ModalStyles.Input
          value={groupName}
          onChange={handleGroupNameChange}
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
