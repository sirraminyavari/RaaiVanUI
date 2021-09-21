import { Link } from 'react-router-dom';
import * as Styled from './FileField.styles';
import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
import Avatar from 'components/Avatar/Avatar';
import MoreIcon from 'components/Icons/ShowMoreIcons/ShowMore';
import useWindow from 'hooks/useWindowContext';
import ToolTip from 'components/Tooltip/react-tooltip/Tooltip';

const FileShowCell = ({ file }) => {
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
        <ToolTip
          tipId={`${file}`}
          clickable
          multiline
          effect="solid"
          event="click"
          place="left"
          type="dark"
          arrowColor="transparent"
          offset={{ right: 40, bottom: -22 }}
          renderContent={() => (
            <div>
              <div>first</div>
              <div>second</div>
              <div>third</div>
            </div>
          )}>
          <Styled.MoreIconWrapper>
            <MoreIcon size={22} color={CV_DISTANT} />
          </Styled.MoreIconWrapper>
        </ToolTip>
      </Styled.FileActionWrapper>
    </Styled.FileShowContainer>
  );
};

export default FileShowCell;
