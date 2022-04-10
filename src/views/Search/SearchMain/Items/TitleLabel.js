import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { searchContext } from 'views/Search/SearchView';
import { TCV_WARM, TCV_DEFAULT } from 'constant/CssVariables';
import { decodeBase64, fileSizeLabel } from 'helpers/helpers';
import { Ellipsis } from 'constant/StyledCommonCss';
import reactStringReplace from 'react-string-replace';
import styled from 'styled-components';
import Heading from 'components/Heading/Heading';

const TitleLabel = ({ ItemType, Title, Type, ItemURL, Size } = {}) => {
  const { searchText } = useContext(searchContext);
  const { GlobalUtilities } = window;

  const isFile = ItemType === 'File';

  const title = reactStringReplace(
    decodeBase64(Title) + (isFile && Type ? '.' + decodeBase64(Type) : ''),
    searchText,
    (match, i) => (
      <span key={i} style={{ color: TCV_DEFAULT }}>
        {match}
      </span>
    )
  );

  return (
    <Wrapper type="h4">
      <LabelContainer
        as={isFile || !ItemURL ? undefined : Link}
        to={isFile || !ItemURL ? undefined : ItemURL}
        onClick={
          !isFile || !ItemURL
            ? undefined
            : () => GlobalUtilities.open_window({ URL: ItemURL })
        }
        ItemURL={ItemURL}
      >
        {title}
      </LabelContainer>
      {isFile && Size && (
        <Heading type="h6" style={{ flex: '0 0 auto' }}>
          {fileSizeLabel(Size)}
        </Heading>
      )}
    </Wrapper>
  );
};

export default TitleLabel;

const Wrapper = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-flow: row;
  align-items: center;
  font-weight: 500;
  height: 2rem;
`;

const LabelContainer = styled.div`
  flex: 0 1 auto;
  padding-inline-end: 0.5rem;
  font-size: 1rem;
  color: ${TCV_WARM};
  ${({ ItemURL }) => (ItemURL ? 'cursor: pointer;' : '')}
  ${Ellipsis}
`;
