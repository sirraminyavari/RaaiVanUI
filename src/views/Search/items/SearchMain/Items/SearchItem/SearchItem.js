import Avatar from 'components/Avatar/Avatar';
import StatusBadge from 'components/Badge/StatusBadge';
import LinkToItem from 'components/Buttons/LinkButton/LinkToItem';
import { decodeBase64 } from 'helpers/helpers';
import { Link } from 'react-router-dom';
import CreationDateLabel from '../CreationDateLabel';
import DescriptionLabel from '../DescriptionLabel';
import ItemAvatar from '../ItemAvatar';
import TitleLabel from '../TitleLabel';
import {
  Container,
  ContentWrapper,
  InfoDetailRow,
  InfoDetails,
  InfoMain,
  InfoWrapper,
  TypeWrapper,
} from './SearchItem.styles';

const SearchItem = (item = {}) => {
  const { ItemType, ID, Type, Creator, FileOwnerNode, AccessIsDenied } = item;
  const { RVAPI } = window;

  const isUser = ItemType === 'User';
  const isNode = ItemType === 'Node';
  const isFile = ItemType === 'File';

  const getItemUrl = () => {
    switch (ItemType) {
      case 'Node':
        return RVAPI.NodePageURL({ NodeID: ID });
      case 'User':
        return RVAPI.UserPageURL({ UserID: ID });
      case 'Question':
        return RVAPI.QuestionPageURL({ QuestionID: ID });
      case 'File':
        return AccessIsDenied ? '' : RVAPI.DownloadLink({ FileID: ID });
      default:
        return '';
    }
  };

  return (
    <Container>
      <TypeWrapper
        as={isUser ? Link : undefined}
        to={isUser ? getItemUrl() : undefined}>
        <ItemAvatar {...item} isLink={isUser} />
        <CreationDateLabel {...item} />
      </TypeWrapper>
      <ContentWrapper>
        <InfoWrapper>
          <InfoMain>
            <TitleLabel {...item} ItemURL={getItemUrl()} />
            {!!Type && isNode && (
              <div style={{ display: 'flex', flexFlow: 'row' }}>
                <StatusBadge
                  style={{ padding: '0.2rem 0.7rem', fontWeight: '300' }}>
                  {decodeBase64(Type)}
                </StatusBadge>
              </div>
            )}
          </InfoMain>
          <InfoDetails>
            {!!Creator?.ProfileImageURL && (
              <InfoDetailRow>
                <Avatar
                  url={Creator?.ProfileImageURL}
                  imageStyles={{ width: '2rem', height: '2rem' }}
                />
              </InfoDetailRow>
            )}
            {isFile && (
              <LinkToItem
                id={FileOwnerNode?.NodeID}
                iconUrl={FileOwnerNode?.IconURL}
                title={decodeBase64(FileOwnerNode?.Name)}
              />
            )}
          </InfoDetails>
        </InfoWrapper>
        <DescriptionLabel {...item} />
      </ContentWrapper>
    </Container>
  );
};

export default SearchItem;
