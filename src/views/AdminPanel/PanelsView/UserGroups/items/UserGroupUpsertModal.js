import styled from 'styled-components';
import * as Styled from '../UserGroupsStyles';
import {
  CV_DISTANT,
  CV_FREEZED,
  CV_GRAY_DARK,
  CV_GRAY_LIGHT,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_WARM,
} from 'constant/CssVariables';
import SettingOutlineIcon from 'components/Icons/SettingOutlineIcon/SettingOutlineIcon';
import Modal from 'components/Modal/Modal';
import { useState } from 'react';
import RxInput from 'components/Inputs/RxInput';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import Button from 'components/Buttons/Button';
import useWindowContext from 'hooks/useWindowContext';

const UserGroupUpsertModal = ({
  group,
  typeId,
  createMode,
  users,
  onModalDelete,
  onModalConfirm,
  ...props
}) => {
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
        <SettingButton
          onClick={() => setModalInfo({ ...modalInfo, show: true })}>
          <SettingOutlineIcon size={28} />
        </SettingButton>
      )}

      {createMode && (
        <Styled.DashedBox
          onClick={() => setModalInfo({ ...modalInfo, show: true })}>
          <AddIcon circleOutline={true} size={48} />
          <div>{RVDic?.CreateNewN.replace('[n]', RVDic.Group)}</div>
        </Styled.DashedBox>
      )}

      <Modal {...modalInfo} onClose={() => handleModalCancel()}>
        <ModalContent>
          <InputLabel>{RVDic?.EnterTheGroupName}</InputLabel>
          <Input
            value={groupName}
            onChange={(name) => handleGroupNameChange(name)}
            type="text"
            placeholder={'نام گروه'}
          />

          <InputLabel>{RVDic?.SelectMembersOfTheGroup}</InputLabel>
          <SelectedUsersContainer>
            {members.map((x) => (
              <UserChips user={x} key={x?.UserID} onDelete={deselect} />
            ))}
          </SelectedUsersContainer>

          <UserContainer>
            {users?.map((x) => (
              <UserItemRow
                key={x?.UserID}
                user={x}
                selected={checkSelection(x?.UserID)}
                onSelect={selectMember}
              />
            ))}
          </UserContainer>

          <ModalActionBar>
            <Button
              type="primary"
              style={buttonStyles}
              onClick={() => handleModalConfirm()}>
              {RVDic?.Save}
            </Button>

            <Button
              type="negative-o"
              style={buttonStyles}
              onClick={() => handleModalCancel()}>
              {RVDic?.Return}
            </Button>

            <Spacer />

            {!!group && (
              <Button
                type="negative"
                style={buttonStyles}
                onClick={() => handleDeleteGroup()}>
                {RVDic.RemoveN.replace('[n]', RVDic.Group)}
              </Button>
            )}
          </ModalActionBar>
        </ModalContent>
      </Modal>
    </>
  );
};

const UserChips = ({ user, onDelete }) => {
  return (
    <ChipsWrapper>
      <ChipsContainer>
        <ChipsProfileImage
          src={user?.ImageURL}
          alt={`${user?.FirstName} ${user?.LastName}`}
        />

        <ChipsTitle>{`${user?.FullName}`}</ChipsTitle>

        <ChipsCloseIcon onClick={() => onDelete(user)}>
          <CloseIcon outline={true} size={21} />
        </ChipsCloseIcon>
      </ChipsContainer>
    </ChipsWrapper>
  );
};

const UserItemRow = ({ user, selected, onSelect, ...props }) => {
  return (
    <UserItemContainer onClick={() => onSelect(user)}>
      <ProfileImage src={user?.ImageURL} highlight={selected} />
      <UserTitle highlight={selected}>{user?.FullName}</UserTitle>
    </UserItemContainer>
  );
};

const SettingButton = styled.div`
  background-color: ${CV_WHITE};
  color: ${CV_DISTANT};
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  &:hover {
    color: ${TCV_DEFAULT};
  }
`;
const ModalContent = styled.div`
  padding: 0 1rem 1rem 1rem;
`;
const Input = styled(RxInput)`
  width: 100%;
  outline: none;
  border: 1px solid ${CV_DISTANT};
  border-radius: 0.5rem;
  height: 3rem;
  padding: 0 1rem;
  color: ${CV_GRAY_DARK};
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 0.5rem;

  &:disabled {
    background-color: ${CV_FREEZED};
  }
`;

const InputLabel = styled.div`
  font-size: 0.85rem;
  color: ${CV_DISTANT};
  font-weight: 300;
  margin-bottom: 0.2rem;
  margin-top: 1.5rem;
`;

const SelectedUsersContainer = styled.div`
  width: 100%;
  border: 1px solid ${CV_DISTANT};
  border-radius: 0.5rem;
  min-height: 3rem;
  padding: 0.1rem 0.5rem;
  color: ${CV_GRAY_DARK};
`;

const ChipsWrapper = styled.div`
  display: inline-block;
  margin: 0.05rem 0.15rem;
`;

const ChipsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 2.5rem;
  background-color: ${CV_DISTANT};
  border-radius: 1.3rem;
  gap: 0.5rem;
  padding: 0.3rem;
`;

const ChipsProfileImage = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  border: 0.05rem solid ${CV_WHITE};
`;

const ChipsTitle = styled.div`
  height: 2rem;
  line-height: 2rem;
  color: ${TCV_WARM};
  font-weight: 500;
`;

const ChipsCloseIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  cursor: pointer;
  color: ${CV_RED};
`;

const UserContainer = styled.div`
  width: 100%;
  background-color: ${CV_GRAY_LIGHT};
  border-radius: 0.5rem;
  height: 19.25rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
`;

const ProfileImage = styled.img`
  height: 2rem;
  width: 2rem;
  border-radius: 100%;
  ${(props) => props?.highlight && `border: 0.13rem solid ${TCV_DEFAULT};`}
`;

const UserTitle = styled.div`
  height: 2rem;
  line-height: 2rem;
  font-size: 1rem;
  color: ${(props) => (props?.highlight ? TCV_DEFAULT : CV_GRAY_DARK)};
`;

const UserItemContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  margin: 0.8rem 0;
  cursor: pointer;
`;

const ModalActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const buttonStyles = {
  height: '3rem',
  width: '7.5rem',
};

const Spacer = styled.div`
  flex-grow: 1;
`;
export default UserGroupUpsertModal;
