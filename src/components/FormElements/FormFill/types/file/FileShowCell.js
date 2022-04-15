import { Link } from 'react-router-dom';
import * as Styled from './FileField.styles';
import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import { TCV_DEFAULT } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import { decodeBase64, fileSizeLabel } from 'helpers/helpers';
import { useEffect, useState } from 'react';
import { basename, extname } from 'path';

const FileShowCell = ({ file, onDelete, uploadingFile }) => {
  const { RVDic, RVAPI } = useWindow();
  const [uploadFileInfo, setUploadFileInfo] = useState();
  const isTabletOrMobile = DimensionHelper()?.isTabletOrMobile;

  useEffect(() => {
    if (!uploadingFile) return;
    const { file } = uploadingFile;
    setUploadFileInfo({
      name: basename(file.path, extname(file.path)),
      ext: extname(file.path).replace('.', ''),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Styled.FileFieldContainer mobileView={isTabletOrMobile}>
      <Styled.FileFieldTypeIconWrapper>
        <FileFormatIcon
          color={TCV_DEFAULT}
          format={uploadFileInfo?.ext || decodeBase64(file?.Extension)}
          size={'2rem'}
        />
        <Styled.FileFieldMutedInfoText>
          {file?.UploadDate}
        </Styled.FileFieldMutedInfoText>
      </Styled.FileFieldTypeIconWrapper>
      <Styled.FileFieldInfoWrapper column={uploadingFile || isTabletOrMobile}>
        <Styled.FileFieldTitle>
          {uploadFileInfo?.name || decodeBase64(file?.FileName)}
        </Styled.FileFieldTitle>
        <Styled.FileFieldActionWrapper column={isTabletOrMobile}>
          {uploadingFile ? (
            <>
              <Styled.FileFieldProgressBar>
                <Styled.FileFieldProgressBarThumb
                  width={uploadingFile?.percentCompleted}
                />
              </Styled.FileFieldProgressBar>
              <Styled.FileFieldRemoveButton
                onClick={uploadingFile?.cancelFunction}
              >
                <TrashIcon size={'1em'} />
              </Styled.FileFieldRemoveButton>
            </>
          ) : (
            <>
              <Styled.FileFieldAvatarWrapper>
                <Styled.FileFieldAvatar
                  className="form-file-show-avatar"
                  userImage={'https://i.pravatar.cc/300'}
                />
                <Styled.FileFieldMutedInfoText width="5rem" truncate>
                  {fileSizeLabel(file?.Size)}
                </Styled.FileFieldMutedInfoText>
              </Styled.FileFieldAvatarWrapper>

              <Styled.FileFieldDownloadButton>
                <Link
                  to={RVAPI.DownloadLink({ FileID: file.FileID })}
                  target="_blank"
                  download
                >
                  {RVDic.Download}
                </Link>
              </Styled.FileFieldDownloadButton>
              <Styled.FileFieldRemoveButton onClick={onDelete}>
                <TrashIcon size={15} />
              </Styled.FileFieldRemoveButton>
            </>
          )}
        </Styled.FileFieldActionWrapper>
      </Styled.FileFieldInfoWrapper>
    </Styled.FileFieldContainer>
  );
};

FileShowCell.defaultProps = {
  onDelete: () => {},
};
export default FileShowCell;
