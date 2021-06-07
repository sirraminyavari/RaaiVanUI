import { useState } from 'react';
import Button from 'components/Buttons/Button';
import * as Styled from '../../../Teams.styles';
import CreateModal from './CreateModal';

const Header = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const [spaceName, setSpaceName] = useState(null);

  //! Add new space.
  const handleAddSpace = () => {
    setIsModalShown(true);
  };

  //! Cancel new space creation.
  const handleCancelCreate = () => {
    setIsModalShown(false);
    setSpaceName(null);
  };

  const handleInputChange = (e) => {
    const spaceName = e.target.value;
    setSpaceName(spaceName);
  };

  //! Create new space .
  const handleSpaceCreate = () => {};

  return (
    <Styled.HeaderContainer>
      <CreateModal
        isOpen={isModalShown}
        onInputChange={handleInputChange}
        onCancleCreate={handleCancelCreate}
        onCreate={handleSpaceCreate}
        modalTitle="ایجاد فضای کاری جدید"
        modalWidth="40%"
      />
      <Styled.HeaderTitle>فضاهای کاری شما</Styled.HeaderTitle>
      <Button style={{ width: '10rem' }} onClick={handleAddSpace}>
        + ساخت فضای جدید
      </Button>
    </Styled.HeaderContainer>
  );
};

export default Header;
