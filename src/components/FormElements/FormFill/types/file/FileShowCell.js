import { Link } from 'react-router-dom';
import * as Styled from './FileField.styles';
import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
import Avatar from 'components/Avatar/Avatar';
import MoreIcon from 'components/Icons/ShowMoreIcons/ShowMore';

const FileShowCell = ({ file }) => {
  return (
    <Styled.FileShowContainer>
      <Styled.FileTitleWrapper>
        <FileFormatIcon color={TCV_DEFAULT} format="pdf" size={25} />
        <Styled.FileShowTitle>
          این یک نام فایل بسیار طولانی برای تست است که اینجا قرار گرفته است.
        </Styled.FileShowTitle>
      </Styled.FileTitleWrapper>
      <Styled.FileActionWrapper>
        <Avatar
          className="form-file-show-avatar"
          userImage={'https://i.pravatar.cc/300'}
        />
        <Styled.FileSize>۳.۲ مگابایت</Styled.FileSize>
        <Styled.FileLinkWrapper>
          <Link to="/data/API List for Rasoul.pdf" target="_blank" download>
            دانلود
          </Link>
        </Styled.FileLinkWrapper>
        <Styled.MoreIconWrapper>
          <MoreIcon size={22} color={CV_DISTANT} />
        </Styled.MoreIconWrapper>
      </Styled.FileActionWrapper>
    </Styled.FileShowContainer>
  );
};

export default FileShowCell;
