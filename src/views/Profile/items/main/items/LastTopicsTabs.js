import { useState } from 'react';
import * as Styled from 'views/Profile/Profile.styles';
import TabItem from './TabItem';

const DEFAULT_TAB = 'all-classes';
const MORE_TAB = 'more-classes';

const items = [
  { id: '1', title: 'پروپوزال', count: 86 },
  { id: '2', title: 'تکنولوژی', count: 45 },
  { id: '3', title: 'درس آموخته حادثه محور', count: 88 },
  { id: '4', title: 'نامه‌های صادره', count: 32 },
  { id: '5', title: 'درس آموخته سنجه محور', count: 117 },
  { id: '6', title: 'نامه‌های وارده', count: 22 },
  { id: '7', title: 'نامه‌های وارده', count: 22 },
  { id: '8', title: 'نامه‌های وارده', count: 22 },
  { id: '9', title: 'نامه‌های وارده', count: 22 },
  { id: '10', title: 'نامه‌های وارده', count: 22 },
  { id: '11', title: 'نامه‌های وارده', count: 22 },
];

const LastTopicsTabs = () => {
  const [isMoreShown, setIsMoreShown] = useState(false);
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);

  const sortedItems = items.slice().sort((a, b) => b.count - a.count);

  const handleMoreTopics = () => {
    setIsMoreShown((v) => !v);
    console.log('click');
  };

  const handleItemClick = (item) => {
    setActiveTab(item.id);
    //! API call
  };

  return (
    <div>
      <Styled.TabsContainer>
        <TabItem
          item={{ title: 'همه کلاس ها', count: 500 }}
          isActive={activeTab === DEFAULT_TAB}
          noImage
          onTabClick={() => setActiveTab(DEFAULT_TAB)}
        />
        {sortedItems.map((item, index) => {
          if (index > 2) return null;
          return (
            <TabItem
              item={item}
              key={index}
              isActive={activeTab === item.id}
              onTabClick={() => handleItemClick(item)}
            />
          );
        })}
        <TabItem
          item={{ title: 'مشاهده همه', count: 300 }}
          isActive={isMoreShown}
          hasMore
          onTabClick={handleMoreTopics}
        />
      </Styled.TabsContainer>
      <Styled.MoreTopicsContainer isOpen={isMoreShown}>
        {sortedItems.map((item, index) => {
          if (index < 3) return null;
          return (
            <TabItem
              item={item}
              key={index}
              isActive={activeTab === item.id}
              onTabClick={() => handleItemClick(item)}
            />
          );
        })}
      </Styled.MoreTopicsContainer>
    </div>
  );
};

export default LastTopicsTabs;
