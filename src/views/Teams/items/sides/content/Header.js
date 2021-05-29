import Button from 'components/Buttons/Button';
import * as Styled from '../../../Teams.styles';

const Header = () => {
  return (
    <Styled.HeaderContainer>
      <Styled.HeaderTitle>فضاهای کاری شما</Styled.HeaderTitle>
      <Button style={{ width: '10rem' }}>+ ساخت فضای جدید</Button>
    </Styled.HeaderContainer>
  );
};

export default Header;
