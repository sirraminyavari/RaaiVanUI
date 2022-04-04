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
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const FileShowCell = ({ file, onDelete }) => {
  const { RVDic } = useWindow();
  const isTabletOrMobile = DimensionHelper()?.isTabletOrMobile;

  return (
    <Styled.FileShowContainer mobileView={isTabletOrMobile}>
      <Styled.FileTitleWrapper>
        <FileFormatIcon color={TCV_DEFAULT} format="pdf" size={25} />
        <Styled.FileShowTitle>
          این یک نام فایل بسیار طولانی برای تست است که اینجا قرار گرفته است.
        </Styled.FileShowTitle>
        <Styled.FileShowAvatarWrapper>
          <Avatar
            className="form-file-show-avatar"
            userImage={'https://i.pravatar.cc/300'}
          />
        </Styled.FileShowAvatarWrapper>
      </Styled.FileTitleWrapper>
      <Styled.FileActionWrapper>
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
