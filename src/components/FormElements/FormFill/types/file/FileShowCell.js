import { Link } from 'react-router-dom';
import * as Styled from './FileField.styles';
import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import { CV_DISTANT, CV_RED, TCV_DEFAULT } from 'constant/CssVariables';
import Avatar from 'components/Avatar/Avatar';
import MoreIcon from 'components/Icons/ShowMoreIcons/ShowMore';
import useWindow from 'hooks/useWindowContext';
import ToolTip from 'components/Tooltip/react-tooltip/Tooltip';
import PencilIcon from 'components/Icons/EditIcons/Pencil';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import ResizeIcon from 'components/Icons/ResizeIcon/ResizeIcon';

const FileShowCell = ({ file }) => {
  const { RVDic } = useWindow();

  const Actions = () => {
    return (
      <div>
        <Styled.FileActionItemWrapper>
          <PencilIcon size={20} color={TCV_DEFAULT} />
          <div>تغییر توضیح</div>
        </Styled.FileActionItemWrapper>
        <Styled.FileActionItemWrapper>
          <ResizeIcon size={20} color={TCV_DEFAULT} />
          <div>نمایش کوچک</div>
        </Styled.FileActionItemWrapper>
        <Styled.FileActionItemWrapper style={{ color: CV_RED }}>
          <TrashIcon size={15} />
          <div>{RVDic.Remove}</div>
        </Styled.FileActionItemWrapper>
      </div>
    );
  };

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
        <ToolTip
          tipId={`${file}`}
          clickable
          multiline
          effect="solid"
          event="click"
          place="left"
          type="dark"
          className="form-fill-file-tooltip"
          arrowColor="transparent"
          offset={{ right: 40, bottom: -42 }}
          renderContent={() => <Actions />}>
          <Styled.MoreIconWrapper>
            <MoreIcon size={22} color={CV_DISTANT} />
          </Styled.MoreIconWrapper>
        </ToolTip>
      </Styled.FileActionWrapper>
    </Styled.FileShowContainer>
  );
};

export default FileShowCell;
