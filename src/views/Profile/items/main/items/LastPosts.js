import { Link } from 'react-router-dom';
import * as Styled from 'views/Profile/Profile.styles';
import Button from 'components/Buttons/Button';
import { TCV_DEFAULT } from 'constant/CssVariables';
// import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import PostItem from './PostItem';

const LastPosts = () => {
  return (
    <Styled.LastPostsContainer>
      <Styled.Header>
        <Styled.Title>پست‌های اخیر من</Styled.Title>
        <Button classes="see-all-button">
          <Link to="#" style={{ color: TCV_DEFAULT }}>
            مشاهده همه
          </Link>
        </Button>
      </Styled.Header>
      {/* <PerfectScrollbar style={{ maxHeight: '22rem', marginTop: '0.5rem' }}> */}
      {[...Array(3).keys()].map((item, index) => {
        return <PostItem key={index} />;
      })}
      {/* </PerfectScrollbar> */}
    </Styled.LastPostsContainer>
  );
};

export default LastPosts;
