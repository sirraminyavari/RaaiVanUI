import styled from 'styled-components';
import { CV_RED } from 'constant/CssVariables';
import { FLEX_RCC } from 'constant/StyledCommonCss';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import { useState } from 'react';
import Modal from 'components/Modal/Modal';
import DeleteConfirmMSG from 'components/Modal/Messages/DeleteConfirmMessage';
import { useTemplateContext } from '../../../TemplateProvider';
import { decodeBase64 } from 'helpers/helpers';
import Button from 'components/Buttons/Button';
import { removeNodeType } from 'apiHelper/ApiHandlers/CNAPI';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import { useHistory } from 'react-router-dom';
import { TEMPLATES_SETTING_PATH } from 'constant/constants';

const DeleteTemplateButton = () => {
  const { RVDic } = window;
  const [modalInfo, setModalInfo] = useState({
    title: RVDic?.RemoveN.replace('[n]', RVDic?.Template),
    contentWidth: '25%',
    middle: true,
    show: false,
    titleClass: 'rv-red',
    titleContainerClass: 'modal-title-bar',
  });
  const { Title, NodeTypeID } = useTemplateContext();
  const history = useHistory();

  const onModalConfirm = async () => {
    setModalInfo({ ...modalInfo, show: false });
    const { ErrorText, Succeed } = await removeNodeType({ NodeTypeID });

    if (ErrorText) {
      InfoToast({
        type: 'error',
        autoClose: true,
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
    }

    if (Succeed) history?.push(TEMPLATES_SETTING_PATH);
  };

  const onModalCancel = () => {
    setModalInfo({ ...modalInfo, show: false });
  };

  return (
    <>
      <DeleteButton onClick={() => setModalInfo({ ...modalInfo, show: true })}>
        <TrashIcon />
        <div>{RVDic?.RemoveN.replace('[n]', RVDic?.Template)}</div>
      </DeleteButton>

      <Modal
        {...modalInfo}
        onClose={() => setModalInfo({ ...modalInfo, show: false })}
      >
        <DeleteConfirmMSG
          title={decodeBase64(`${Title}`)}
          question={RVDic.Confirms.AreYouSureYouWantToDeleteTheN.replace(
            '[n]',
            RVDic.Template
          )}
          warning={
            'تمپلیت‌ها پس از حذف در قسمت بایگانی در مدیریت تمپلیت‌ها .قابل بازیابی و استفاده مجدد هستند'
          }
        />

        <ModalActionBar>
          <Button type="negative" style={buttonStyles} onClick={onModalConfirm}>
            {RVDic?.Remove}
          </Button>

          <Button type="primary-o" style={buttonStyles} onClick={onModalCancel}>
            {RVDic?.Return}
          </Button>
        </ModalActionBar>
      </Modal>
    </>
  );
};

const DeleteButton = styled.button`
  margin: auto;
  height: 3rem;
  width: calc(100% - 2rem);
  background-color: transparent;
  outline: none;
  border-radius: 0.8rem;
  border: 1px solid ${CV_RED};
  color: ${CV_RED};
  ${FLEX_RCC};
  cursor: pointer;
  gap: 0.5rem;
  bottom: 1.5rem;
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: #e2234f0d;
  }

  div {
    font-weight: 500;
  }
`;

const ModalActionBar = styled.div`
  ${FLEX_RCC};
  height: 3rem;
  gap: 1.5rem;
  margin-top: 2.2rem;
  width: 100%;
`;
ModalActionBar.displayName = 'ModelActionBar';

const buttonStyles = {
  height: '3rem',
  width: '7.5rem',
};

export default DeleteTemplateButton;
