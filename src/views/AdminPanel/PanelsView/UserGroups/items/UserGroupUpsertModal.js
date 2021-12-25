import styled from 'styled-components';
import * as Styled from '../UserGroupsStyles';
import {
  CV_DISTANT,
  CV_GRAY_DARK,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import SettingOutlineIcon from 'components/Icons/SettingOutlineIcon/SettingOutlineIcon';
import Modal from 'components/Modal/Modal';
import { useState } from 'react';
import RxInput from 'components/Inputs/RxInput';
import { addNode } from 'apiHelper/ApiHandlers/CNApi';
import AddIcon from 'components/Icons/AddIcon/AddIcon';

const UserGroupUpsertModal = ({ group, typeId, createMode, ...props }) => {
  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: 'تنظیمات گروه',
    middle: true,
    contentWidth: '34rem',
    titleClass: 'rv-default',
    titleContainerClass: 'modal-title-bar',
  });
  const [groupName, setGroupName] = useState(group ? group?.Name : '');
  const [members, setMembers] = useState(group ? group?.Members : []);

  const handleGroupNameChange = (name) => {
    if (!group) {
      addNode(name, typeId)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  };
  return (
    <>
      {!createMode && (
        <Button onClick={() => setModalInfo({ ...modalInfo, show: true })}>
          <SettingOutlineIcon size={28} />
        </Button>
      )}

      {createMode && (
        <Styled.DashedBox
          onClick={() => setModalInfo({ ...modalInfo, show: true })}>
          <AddIcon circleOutline={true} size={48} />
          <div>ایجاد گروه جدید</div>
        </Styled.DashedBox>
      )}

      <Modal {...modalInfo}>
        <ModalContent>
          <InputLabel>
            {'در کادر زیر نام گروه کاربری را وارد نمایید.'}
          </InputLabel>
          <Input
            value={groupName}
            onChange={(name) => handleGroupNameChange(name)}
            type="text"
            placeholder={'نام گروه'}
            delayTime={1000}
          />
        </ModalContent>
      </Modal>
    </>
  );
};
const Button = styled.div`
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
  padding: 1rem;
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
`;

const InputLabel = styled.div`
  font-size: 0.85rem;
  color: ${CV_DISTANT};
  font-weight: 300;
  margin-bottom: 0.2rem;
`;
export default UserGroupUpsertModal;
