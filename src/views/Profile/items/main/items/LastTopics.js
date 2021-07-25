import { Link } from 'react-router-dom';
import * as Styled from 'views/Profile/Profile.styles';
import Button from 'components/Buttons/Button';
import { TCV_DEFAULT } from 'constant/CssVariables';
import LastTopicTabs from './LastTopicsTabs';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import TopicItem from './TopicItem';

const LastRelatedTopics = () => {
  return (
    <Styled.LastTopicsContainer>
      <Styled.LastTopicsHeader>
        <Styled.LastTopicsTitle>
          آخرین موضوعات مرتبط با من
        </Styled.LastTopicsTitle>
        <Button classes="see-all-topics-button">
          <Link to="#" style={{ color: TCV_DEFAULT }}>
            مشاهده همه
          </Link>
        </Button>
      </Styled.LastTopicsHeader>
      <LastTopicTabs />
      <PerfectScrollbar style={{ maxHeight: '17rem', marginTop: '0.5rem' }}>
        {[1, 2, 3, 5, 6, 7, 8, 9, 10].map((item) => {
          return <TopicItem />;
        })}
      </PerfectScrollbar>
    </Styled.LastTopicsContainer>
  );
};

export default LastRelatedTopics;
