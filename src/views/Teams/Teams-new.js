import * as Styled from './Teams.styles';
import ContentSide from './items/sides/content/Content';
import WelcomeSide from './items/sides/welcome/Welcome';

const TeamsView = () => {
  return (
    <Styled.ViewContainer>
      <ContentSide />
      <WelcomeSide />
    </Styled.ViewContainer>
  );
};

export default TeamsView;
