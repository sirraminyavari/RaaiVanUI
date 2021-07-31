import * as Styled from './Teams.styles';
import DesktopContentSide from './items/sides/content/DesktopContent';
import DesktopWelcomeSide from './items/sides/welcome/DesktopWelcome';

const DesktopView = () => {
  return (
    <Styled.TeamsDesktopViewContainer>
      <DesktopContentSide />
      <DesktopWelcomeSide />
    </Styled.TeamsDesktopViewContainer>
  );
};

export default DesktopView;
