import { useState, useContext } from 'react';
import Button from 'components/Buttons/Button';
import * as Styled from '../../../Teams.styles';
import Modal from 'components/Modal/Modal';
import Input from 'components/Inputs/Input';
import { WindowContext } from 'context/WindowProvider';

const Header = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const [spaceName, setSpaceName] = useState(null);
  const { RVDic } = useContext(WindowContext);

  const handleAddSpace = () => {
    setIsModalShown(true);
  };

  const handleCancelCreate = () => {
    setIsModalShown(false);
    setSpaceName(null);
  };

  const handleInputChange = (e) => {
    const spaceName = e.target.value;
    setSpaceName(spaceName);
  };

  const handleSpaceCreate = () => {};

  return (
    <Styled.HeaderContainer>
      <Modal
        contentWidth="40%"
        title="ایجاد فضای کاری جدید"
        show={isModalShown}
        onClose={handleCancelCreate}>
        <Styled.ModalContentWrapper>
          <Input
            style={{ width: '100%', margin: '2rem 0' }}
            onChange={handleInputChange}
          />
          <Styled.ModalButtonsWrapper>
            <Button style={{ width: '7rem' }} onClick={handleSpaceCreate}>
              <Styled.ModalButtonText>{RVDic.Save}</Styled.ModalButtonText>
            </Button>
            <Button
              type="negative-o"
              style={{ width: '7rem' }}
              onClick={handleCancelCreate}>
              <Styled.ModalButtonText>{RVDic.Return}</Styled.ModalButtonText>
            </Button>
          </Styled.ModalButtonsWrapper>
        </Styled.ModalContentWrapper>
      </Modal>
      <Styled.HeaderTitle>فضاهای کاری شما</Styled.HeaderTitle>
      <Button style={{ width: '10rem' }} onClick={handleAddSpace}>
        + ساخت فضای جدید
      </Button>
    </Styled.HeaderContainer>
  );
};

export default Header;
