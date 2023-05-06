import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal/Modal';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import Button from 'components/Buttons/Button';
import styled from 'styled-components';
import useWindow from 'hooks/useWindowContext';

const InputWrapper = styled.div`
  display: flex;
  padding-inline: 12.5%;
  padding-block: 3rem;
`;
const ButtonWrapper = styled.div`
  display: flex;
  padding-block-end: 1rem;
  padding-inline: 12.5%;
  width: 100%;
  justify-content: center;
  gap: 1rem;
`;
/**
 *
 * Create Workspace Modal component
 *
 * @param {object} props - Create Workspace Modal component props
 * @param {boolean} [props.isOpen=false] - Modal status
 * @param {function(string):void} props.onInputChange - Input component's onChange event callback
 * @param {string} [props.inputValue=''] - value attribute for input
 * @param {function():void} props.onCancelCreate - Modal component's OnClose and cancel Button's OnClick callback
 * @param {function():void} props.onCreate - Submit Button component's OnClick callback
 * @param {string} props.modalTitle - Modal component's title string
 * @param {string|number} props.modalWidth - Modal component's fixed width
 * @param {string} props.placeholder - placeholder value for input component
 *
 * @return {JSX.Element} modal for creating a new workspace
 */
const CreateWorkspaceModal = ({
  isOpen,
  onInputChange,
  inputValue,
  onCancelCreate,
  onCreate,
  modalTitle,
  modalWidth,
  placeholder,
}) => {
  const { RVDic } = useWindow();
  const RVDicSave = RVDic.Save;
  const RVDicReturn = RVDic.Return;

  return (
    <>
      <Modal
        middle
        show={isOpen}
        contentWidth={modalWidth}
        title={modalTitle}
        onClose={onCancelCreate}
      >
        <InputWrapper>
          <AnimatedInput
            onChange={onInputChange}
            value={inputValue}
            placeholder={placeholder}
            style={{ width: '100%' }}
          />
        </InputWrapper>
        <ButtonWrapper>
          <Button onClick={onCreate} disable={!inputValue.length}>
            {RVDicSave}
          </Button>
          <Button type="negative-o" onClick={onCancelCreate}>
            {RVDicReturn}
          </Button>
        </ButtonWrapper>
      </Modal>
    </>
  );
};

CreateWorkspaceModal.propTypes = {
  isOpen: PropTypes.bool,
  onInputChange: PropTypes.func,
  inputValue: PropTypes.string,
  onCancelCreate: PropTypes.func,
  onCreate: PropTypes.func,
  modalTitle: PropTypes.string,
  modalWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
};
CreateWorkspaceModal.defaultProps = {
  isOpen: false,
  onInputChange: () => {},
  inputValue: '',
  onCancelCreate: () => {},
  onCreate: () => {},
  modalTitle: '',
  modalWidth: '33%',
  placeholder: '',
};

export default CreateWorkspaceModal;
