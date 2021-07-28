import { Link } from 'react-router-dom';
import * as Styled from 'views/Profile/Profile.styles';
import Button from 'components/Buttons/Button';
import { TCV_DEFAULT } from 'constant/CssVariables';
import LastTopicTabs from './LastTopicsTabs';
// import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import TopicItem from './TopicItem';

const LastRelatedTopics = () => {
  return (
    <Styled.LastTopicsContainer>
      <Styled.Header>
        <Styled.Title>آخرین موضوعات مرتبط با من</Styled.Title>
        <Button classes="see-all-button">
          <Link to="#" style={{ color: TCV_DEFAULT }}>
            مشاهده همه
          </Link>
        </Button>
      </Styled.Header>
      <LastTopicTabs />
      {/* <PerfectScrollbar style={{ maxHeight: '17rem', marginTop: '0.5rem' }}> */}
      {[...Array(3).keys()].map((item, index) => {
        return <TopicItem key={index} />;
      })}
      {/* </PerfectScrollbar> */}
    </Styled.LastTopicsContainer>
  );
};

export default LastRelatedTopics;
