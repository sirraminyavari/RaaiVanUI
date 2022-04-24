import styled from 'styled-components';
import { CV_DISTANT, CV_RED, CV_WHITE } from 'constant/CssVariables';
import Modal from 'components/Modal/Modal';
import TrashIcon from 'components/Icons/TrashIcon';
import DeleteConfirmMessage from 'components/Modal/Messages/DeleteConfirmMessage';
import { useState } from 'react';
import Button from 'components/Buttons/Button';
import useWindowContext from 'hooks/useWindowContext';

const TemplateDeleteButton = ({ id, onDeleteConfirm }) => {
  const { RVDic } = useWindowContext();
  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: 'حذف دسته',
    middle: true,
    contentWidth: '34rem',
    titleClass: 'rv-red',
    titleContainerClass: 'modal-title-bar',
  });

  const handleModalConfirm = () => {
    if (onDeleteConfirm) onDeleteConfirm(id);
    setModalInfo({ ...modalInfo, show: false });
  };
  return (
    <>
      <DeleteButton onClick={() => setModalInfo({ ...modalInfo, show: true })}>
        <TrashIcon size={20} />
      </DeleteButton>

      <Modal
        {...modalInfo}
        onClose={() => setModalInfo({ ...modalInfo, show: false })}
      >
        <DeleteConfirmMessage
          question={'آیا از حذف دسته اطمینان دارید؟'}
          warning={
            'تمپلیت‌های این دسته پس از حذف، پاک نخواهند شد و به قسمت دسته‌بندی نشده‌ها منتقل خواهد شد'
          }
        />

        <ModalActionBar>
          <Button
            type="negative"
            style={buttonStyles}
            onClick={() => handleModalConfirm()}
          >
            {RVDic?.Remove}
          </Button>

          <Button
            type="primary-o"
            style={buttonStyles}
            onClick={() => setModalInfo({ ...modalInfo, show: false })}
          >
            {RVDic?.Return}
          </Button>
        </ModalActionBar>
      </Modal>
    </>
  );
};
const DeleteButton = styled.button`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 100%;
  background-color: ${CV_WHITE};
  color: ${CV_DISTANT};
  margin: 0 2rem;
  cursor: pointer;
  &:hover {
    color: ${CV_RED};
  }
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
export default TemplateDeleteButton;
