import { memo } from 'react';
import { Link } from 'react-router-dom';
import { decodeBase64 } from 'helpers/helpers';
import * as Styled from './FileCell.styles';
import { CV_RED, TCV_DEFAULT } from 'constant/CssVariables';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';

const FilesList = (props) => {
  const { files, canEdit, onRemoveFile } = props;

  const handleRemoveFile = (fileId) => {
    onRemoveFile && onRemoveFile(fileId);
  };

  return (
    <>
      {files?.map((file, index) => {
        const {
          Downloadable,
          Extension,
          FileID,
          FileName,
          IconURL,
          // MIME,
          // OwnerID,
          // Size,
        } = file;

        let fileExtension = decodeBase64(Extension);
        let fileName = decodeBase64(FileName);
        let fileNameWithExtension = fileName + '.' + fileExtension;

        return (
          <Styled.FileItemContainer key={FileID || index}>
            <Styled.FileInfoWrapper editable={canEdit}>
              <FileFormatIcon
                color={TCV_DEFAULT}
                size={25}
                format={fileExtension}
              />
              <Styled.FileLinkWrapper>
                {!!Downloadable ? (
                  <Link
                    to={IconURL}
                    target="_blank"
                    download
                    data-title={fileName}
                  >
                    {fileName}
                  </Link>
                ) : (
                  <span data-title={fileName}>{fileNameWithExtension}</span>
                )}
              </Styled.FileLinkWrapper>
            </Styled.FileInfoWrapper>
            {canEdit && (
              <Styled.TrashIconWrapper onClick={() => handleRemoveFile(FileID)}>
                <TrashIcon color={CV_RED} />
              </Styled.TrashIconWrapper>
            )}
          </Styled.FileItemContainer>
        );
      })}
    </>
  );
};

export default memo(FilesList);
