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
        <Styled.SearchItemDescription>
          <Styled.SearchItemTitle type="h4">
            نام فایل آپلود شده در تیم توسط سپهر .docx
          </Styled.SearchItemTitle>
          <Styled.SearchItemSubTitle type="h6">
            بخشی از متن فایل در این قسمت نوشته میشود، که میتواند کلمه جستجوشده
            سپهر را شامل شود
          </Styled.SearchItemSubTitle>
        </Styled.SearchItemDescription>
        <Styled.SearchItemMore>
          <Styled.SearchItemFileTitle type="h6">
            نام آیتم
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
