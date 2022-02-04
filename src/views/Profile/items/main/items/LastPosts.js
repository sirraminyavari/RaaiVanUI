import { Link } from 'react-router-dom';
import * as Styled from 'views/Profile/Profile.styles';
import Button from 'components/Buttons/Button';
import { TCV_DEFAULT } from 'constant/CssVariables';
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
      {[...Array(3).keys()].map((item, index) => {
        return <PostItem key={index} />;
      })}
    </Styled.LastPostsContainer>
  );
};

export default LastPosts;
