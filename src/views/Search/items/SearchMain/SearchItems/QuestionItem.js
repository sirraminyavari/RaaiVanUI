import { Link } from 'react-router-dom';
import * as Styled from 'views/Search/SearchView.styles';
import { CV_DISTANT } from 'constant/CssVariables';
import QuestionIcon from 'components/Icons/QuestionIcon/QuestionIcon';
import Avatar from 'components/Avatar/Avatar';
import { decodeBase64, getURL } from 'helpers/helpers';
import CreationDateLabel from './CreationDateLabel';
import DescriptionLabel from './DescriptionLabel';

const QuestionItem = ({ item }) => {
  const { Title, ID, Creator } = item || {};

  return (
    <Styled.SearchItemContainer>
      <Styled.SearchItemTypeWrapper>
        <QuestionIcon format="word" size={30} color={CV_DISTANT} />
        <CreationDateLabel {...item} />
      </Styled.SearchItemTypeWrapper>
      <Styled.SearchItemInfoWrapper>
        <Styled.SearchItemDescription>
          <Styled.SearchItemTitle
            as={Link}
            to={getURL('Question', { QuestionID: ID })}
            type="h4">
            {decodeBase64(Title)}
          </Styled.SearchItemTitle>
          <DescriptionLabel {...item} />
        </Styled.SearchItemDescription>
        <Styled.SearchItemMore>
          <Avatar
            userImage={Creator?.ProfileImageURL}
            className="search-item-avatar"
          />
        </Styled.SearchItemMore>
      </Styled.SearchItemInfoWrapper>
    </Styled.SearchItemContainer>
  );
};

export default QuestionItem;
