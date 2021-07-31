import * as Styled from './Teams.styles';
import MobileContentSide from './items/sides/content/MobileContent';
import MobileWelcomeSide from './items/sides/welcome/MobileWelcome';

const MobileView = () => {
  return (
    <Styled.TeamsMobileViewContainer>
      <MobileContentSide />
      <MobileWelcomeSide />
    </Styled.TeamsMobileViewContainer>
  );
};

export default MobileView;
