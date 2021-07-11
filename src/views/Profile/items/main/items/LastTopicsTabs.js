import { useState } from 'react';
import * as Styled from 'views/Profile/Profile.styles';
import TabItem from './TabItem';

const LastTopicsTabs = () => {
  const [isMoreShown, setIsMoreShown] = useState(false);

  const handleMoreTopics = () => {
    setIsMoreShown((v) => !v);
    console.log('click');
  };

  return (
    <div>
      <Styled.TabsContainer>
        <TabItem isActive={true} noImage />
        <TabItem isActive={false} />
        <TabItem isActive={false} />
        <TabItem isActive={false} />
        <TabItem isActive={false} hasMore onTabClick={handleMoreTopics} />
      </Styled.TabsContainer>
      <Styled.MoreTopicsContainer isOpen={isMoreShown}>
        <TabItem isActive={false} />
        <TabItem isActive={false} />
        <TabItem isActive={false} />
        <TabItem isActive={false} />
        <TabItem isActive={false} />
        <TabItem isActive={false} />
      </Styled.MoreTopicsContainer>
    </div>
  );
};

export default LastTopicsTabs;
