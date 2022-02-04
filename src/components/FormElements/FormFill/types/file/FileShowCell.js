import { Link } from 'react-router-dom';
import * as Styled from './FileField.styles';
import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import { TCV_DEFAULT } from 'constant/CssVariables';
import Avatar from 'components/Avatar/Avatar';
// import MoreIcon from 'components/Icons/ShowMoreIcons/ShowMore';
import useWindow from 'hooks/useWindowContext';
// import ToolTip from 'components/Tooltip/react-tooltip/Tooltip';
// import PencilIcon from 'components/Icons/EditIcons/Pencil';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
// import ResizeIcon from 'components/Icons/ResizeIcon/ResizeIcon';

const FileShowCell = ({ file, onDelete }) => {
  const { RVDic } = useWindow();

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
            {RVDic.Download}
          </Link>
        </Styled.FileLinkWrapper>
        <Styled.FileActionItemWrapper onClick={onDelete}>
          <TrashIcon size={15} />
        </Styled.FileActionItemWrapper>
      </Styled.FileActionWrapper>
    </Styled.FileShowContainer>
  );
};

FileShowCell.defaultProps = {
  onDelete: () => {},
};
export default FileShowCell;
