import * as Styled from 'views/Profile/Profile.styles';
import TabItem from './TabItem';

const LastTopicsTabs = () => {
  return (
    <Styled.TabsContainer>
      <TabItem isActive={true} noImage />
      <TabItem isActive={false} />
      <TabItem isActive={false} />
      <TabItem isActive={false} />
      <TabItem isActive={false} hasMore />
    </Styled.TabsContainer>
  );
};

export default LastTopicsTabs;
