import { useContext } from 'react';
import reactStringReplace from 'react-string-replace';
import { searchContext } from 'views/Search/SearchView';
import * as Styled from 'views/Search/SearchView.styles';
import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';

const FileItem = ({ item }) => {
  const {
    // ID,
    IconURL,
    // ItemType,
    Title,
    Type,
    FileOwnerNode,
  } = item || {};

  const {
    // NodeID: fileOwnerId,
    Name: fileOwnerName,
    // NodeType: fileOwnerType,
  } = FileOwnerNode || {};

  const { searchText } = useContext(searchContext);

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
        <Styled.SearchItemDate type="h6">1395/09/06</Styled.SearchItemDate>
      </Styled.SearchItemTypeWrapper>
      <Styled.SearchItemInfoWrapper>
        <Styled.SearchItemDescription>
          <Styled.SearchItemTitle>{fileName}</Styled.SearchItemTitle>
          <Styled.SearchItemSubTitle type="h6">
            بخشی از متن فایل در این قسمت نوشته میشود، که میتواند کلمه جستجوشده
            سپهر را شامل شود
          </Styled.SearchItemSubTitle>
        </Styled.SearchItemDescription>
        <Styled.SearchItemMore>
          <Styled.SearchItemFileTitle type="h6">
            {decodeBase64(fileOwnerName)}
          </Styled.SearchItemFileTitle>
          <Styled.SearchItemFileSubTitle type="h6">
            12.5 کیلوبایت
          </Styled.SearchItemFileSubTitle>
        </Styled.SearchItemMore>
      </Styled.SearchItemInfoWrapper>
    </Styled.SearchItemContainer>
  );
};

export default FileItem;
