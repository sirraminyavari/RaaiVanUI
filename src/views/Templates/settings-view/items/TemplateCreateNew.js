import styled from 'styled-components';
import { CV_DISTANT, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import Modal from 'components/Modal/Modal';
import { useState } from 'react';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import Button from 'components/Buttons/Button';
import useWindowContext from 'hooks/useWindowContext';

const TemplateCreateNew = ({ parent, onSubmit }) => {
  const { RVDic } = useWindowContext();
  const [value, setValue] = useState('');
  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: 'ایجاد دسته جدید',
    middle: true,
    contentWidth: '34rem',
    titleClass: 'rv-default',
    titleContainerClass: 'modal-title-bar',
  });

  const handleModalCancel = () => setModalInfo({ ...modalInfo, show: false });

  const handleModalConfirm = () => {
    console.log(value, parent);
    if (onSubmit && value) {
      console.log(value, parent);
      onSubmit(value, parent);
    }
    setModalInfo({ ...modalInfo, show: false });
  };

  return (
    <>
      {parent ? (
        <AddButton onClick={(e) => setModalInfo({ ...modalInfo, show: true })}>
          <AddIcon size={20} />
        </AddButton>
      ) : (
        <RootAddButton
          onClick={(e) => setModalInfo({ ...modalInfo, show: true })}>
          <AddIcon size={20} />
          <div>{'ایجاد دسته جدید'}</div>
        </RootAddButton>
      )}

      <Modal {...modalInfo} onClose={() => handleModalCancel()}>
        <ModalContent>
          <AnimatedInput
            value={value}
            onChange={(e) => setValue(e)}
            placeholder={'نام دسته جدید را وارد کنید'}
          />
        </ModalContent>
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
        </ModalActionBar>
      </Modal>
    </>
  );
};
const AddButton = styled.button`
  width: 1.5rem;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: transparent;
  color: ${CV_DISTANT};
`;
const RootAddButton = styled.button`
  border: none;
  outline: none;
  border-radius: 0.8rem;
  height: 3rem;
  min-width: 11.5rem;
  padding: 0 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${CV_WHITE};
  background-color: ${TCV_DEFAULT};
  gap: 0.5rem;
`;
const ModalContent = styled.div`
  height: 10rem;
  padding: 3.25rem 3.8rem;
`;
const ModalActionBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
`;

const buttonStyles = {
  height: '3rem',
  width: '7.5rem',
};
export default TemplateCreateNew;
