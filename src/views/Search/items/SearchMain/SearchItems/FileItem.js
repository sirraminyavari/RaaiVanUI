import * as Styled from 'views/Search/SearchView.styles';
import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import { CV_DISTANT } from 'constant/CssVariables';

const FileItem = () => {
  return (
    <Styled.SearchItemContainer>
      <Styled.SearchItemTypeWrapper>
        <FileFormatIcon format="word" size={33} color={CV_DISTANT} />
        <Styled.SearchItemDate type="h6">1395/09/06</Styled.SearchItemDate>
      </Styled.SearchItemTypeWrapper>
      <Styled.SearchItemInfoWrapper>
        <div>File</div>
        <div>File</div>
      </Styled.SearchItemInfoWrapper>
    </Styled.SearchItemContainer>
  );
};

export default FileItem;
