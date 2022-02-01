import { useContext } from 'react';
import reactStringReplace from 'react-string-replace';
import { searchContext } from 'views/Search/SearchView';
import * as Styled from 'views/Search/SearchView.styles';
import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
import { decodeBase64, fileSizeLabel } from 'helpers/helpers';
import CreationDateLabel from './CreationDateLabel';
import DescriptionLabel from './DescriptionLabel';
import StatusBadge from 'components/Badge/StatusBadge';

const FileItem = ({ item }) => {
  const {
    // ID,
    IconURL,
    // ItemType,
    Title,
    Type,
    FileOwnerNode,
    Size,
  } = item || {};

  const { searchText } = useContext(searchContext);

  const {
    // NodeID: fileOwnerId,
    Name: fileOwnerName,
    // NodeType: fileOwnerType,
  } = FileOwnerNode || {};

  let fileName = `${decodeBase64(Title)}.${decodeBase64(Type)}`;

  fileName = reactStringReplace(fileName, searchText, (match, i) => {
    return <span style={{ color: TCV_DEFAULT }}>{match}</span>;
  });

  return (
    <Styled.SearchItemContainer>
      <Styled.SearchItemTypeWrapper>
        {IconURL ? (
          <img src={IconURL} alt={decodeBase64(Title)} width={35} />
        ) : (
          <FileFormatIcon
            format={decodeBase64(Type)}
            size={33}
            color={CV_DISTANT}
          />
        )}
        <CreationDateLabel {...item} />
      </Styled.SearchItemTypeWrapper>
      <Styled.SearchItemInfoWrapper>
        <Styled.SearchItemDescription>
          <Styled.SearchItemTitle>{fileName}</Styled.SearchItemTitle>
          <DescriptionLabel {...item} />
        </Styled.SearchItemDescription>
        <Styled.SearchItemMore>
          <StatusBadge style={{ padding: '0.2rem 0.7rem', fontWeight: '300' }}>
            {decodeBase64(fileOwnerName)}
          </StatusBadge>
          <div style={{ flex: '1 1 auto' }}></div>
          {Size && (
            <Styled.SearchItemFileSubTitle type="h6">
              {fileSizeLabel(Size)}
            </Styled.SearchItemFileSubTitle>
          )}
        </Styled.SearchItemMore>
      </Styled.SearchItemInfoWrapper>
    </Styled.SearchItemContainer>
  );
};

export default FileItem;
