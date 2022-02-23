import styled from 'styled-components';
import { CV_RED } from 'constant/CssVariables';
import { FLEX_RCC } from 'constant/StyledCommonCss';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import useModal from '../../../../../../hooks/useModal';

const DeleteTemplateButton = () => {
  const { Modal, open, close } = useModal({
    title: 'delete',
    contentWidth: '30%',
  });
  return (
    <>
      <Button onClick={open}>
        <TrashIcon />
        <div>{'حذف تمپلیت'}</div>
      </Button>

      <Modal>delete</Modal>
    </>
  );
};

const Button = styled.button`
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
  position: absolute;
  right: 0;
  left: 0;
  bottom: 1.5rem;
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: #e2234f0d;
  }

  div {
    font-weight: 500;
  }
`;

export default DeleteTemplateButton;
