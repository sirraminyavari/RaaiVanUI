import { useState } from 'react';
import Button from 'components/Buttons/Button';
import * as Styled from 'views/Teams/Teams.styles';
import CreateModal from './CreateModal';

const Header = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const [spaceName, setSpaceName] = useState('');

  //! Add new space.
  const handleAddSpace = () => {
    setIsModalShown(true);
  };

  //! Cancel new space creation.
  const handleCancelCreate = () => {
    setIsModalShown(false);
    setSpaceName('');
  };

  const handleInputChange = (inputValue) => {
    setSpaceName(inputValue);
  };

  //! Create new space .
  const handleSpaceCreate = () => {};

  return (
    <Styled.HeaderContainer>
      <CreateModal
        isOpen={isModalShown}
        onInputChange={handleInputChange}
        inputValue={spaceName}
        onCancleCreate={handleCancelCreate}
        onCreate={handleSpaceCreate}
        modalTitle="ایجاد فضای کاری جدید"
        modalWidth="35%"
        placeholder="نام فضای کاری"
      />
      <Styled.HeaderTitle>فضاهای کاری شما</Styled.HeaderTitle>
      <Button style={{ width: '10rem' }} onClick={handleAddSpace}>
        + ساخت فضای جدید
      </Button>
    </Styled.HeaderContainer>
  );
};

export default Header;
