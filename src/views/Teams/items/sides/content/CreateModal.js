import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal/Modal';
import Input from 'components/Inputs/Input';
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
  > div {
    margin-inline: 0.5rem;
    flex-grow: 1;
    flex-basis: 0;
    max-width: 7rem;
  }
`;
/**
 *
 * Create Modal component
 *
 * @param {object} props - CreateModal component props
 * @param {boolean} [props.isOpen=false] - Modal status
 * @param {function(string):void} props.onInputChange - Input component's onChange event callback
 * @param {string} [props.inputValue=''] - value attribute for input
 * @param {function():void} props.onCancelCreate - Modal component's OnClose and cancel Button's OnClick callback
 * @param {function():void} props.onCreate - Submit Button component's OnClick callback
 * @param {string} props.modalTitle - Modal component's title string
 * @param {string|number} props.modalWidth - Modal component's fixed width
 * @param {string} props.placeholder - placeholder value for input component
 *
 * @return {JSX.Element} The fragment created.
 */
const CreateModal = ({
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

  //! handling Input component's onChange event
  const handleInputChange = (event) => {
    onInputChange(event.target.value);
  };

  return (
    <>
      <Modal
        middle
        show={isOpen}
        contentWidth={modalWidth}
        title={modalTitle}
        onClose={onCancelCreate}>
        <InputWrapper>
          <Input
            onChange={handleInputChange}
            value={inputValue}
            placeholder={placeholder}
            style={{ width: '100%' }}
          />
        </InputWrapper>
        <ButtonWrapper>
          <Button onClick={onCreate}>{RVDicSave}</Button>
          <Button type="negative-o" onClick={onCancelCreate}>
            {RVDicReturn}
          </Button>
        </ButtonWrapper>
      </Modal>
    </>
  );
};

export default CreateModal;

CreateModal.propTypes = {
  isOpen: PropTypes.bool,
  onInputChange: PropTypes.func,
  inputValue: PropTypes.string,
  onCancelCreate: PropTypes.func,
  onCreate: PropTypes.func,
  modalTitle: PropTypes.string,
  modalWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
};
CreateModal.defaultProps = {
  isOpen: false,
  onInputChange: () => {},
  inputValue: '',
  onCancelCreate: () => {},
  onCreate: () => {},
  modalTitle: '',
  modalWidth: '33%',
  placeholder: '',
};
