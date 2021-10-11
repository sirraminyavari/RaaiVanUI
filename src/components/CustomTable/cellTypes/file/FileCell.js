import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as Styled from './FileCell.styles';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import PlusIcon from 'components/Icons/PlusIcon/PlusIcon';
import { CV_RED, TCV_DEFAULT, TCV_WARM } from 'constant/CssVariables';
import CustomDropZone from 'components/CustomDropzone/CustomDropzone';
import { API_Provider, decodeBase64 } from 'helpers/helpers';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import Heading from 'components/Heading/Heading';

const apiHandler = API_Provider('DocsAPI', 'GetUploadLink');

const FileCell = (props) => {
  // console.log('fileCell', props);
  const {
    isNew,
    row,
    editingRow,
    onCellChange,
    column,
    value,
    editable: isTableEditable,
    header,
  } = props;
  const [isUploading, setIsUploading] = useState(false);
  const { files } = value || {};
  const isCellEditable = !!header?.options?.editable;

  const rowId = row?.original?.id;
  const columnId = column?.id;

  const isRowEditing = rowId === editingRow;

  const handleFileDropError = (error) => {
    if (!isNew || !isRowEditing) return;
    console.log(error);
  };

  const handleUploadFiles = (acceptedFiles) => {
    if (!isNew || !isRowEditing) return;

    //! Get upload link.
    apiHandler.url(
      {
        OwnerID: '40aa835f-751c-4786-86af-fec04f45d262',
        OwnerType: 'Node',
      },
      (response) => {
        //! Uploads accepted files asynchronous.
        acceptedFiles.reduce(async (previousPromise, accepted) => {
          await previousPromise;
          return new Promise((resolve, reject) => {
            let uploadURL = response.slice(5);
            setIsUploading(true);

            //! Prepare upload data
            let formData = new FormData();
            formData.append('file', accepted);

            //! File upload option.
            let options = {
              onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                let percentage = Math.floor((loaded * 100) / total);
                //! Executes if upload progress is over.
                if (percentage === 100) {
                  //! Resolve promise if and only if upload process is ended.
                  resolve();
                }
              },
            };

            //! Post file to the server.
            axios
              .post(uploadURL, formData, options)
              .then((response) => {
                // console.log(response);
                if (response?.data?.success) {
                  //! Call on any field change.
                  const newFilesArray = [
                    ...value?.files,
                    response?.data?.AttachedFile,
                  ];
                  const fileCell = { ...value, newFilesArray };
                  onCellChange(rowId, columnId, fileCell, newFilesArray);

                  //! update upload state.
                  setIsUploading(false);

                  //! Inform user with toast.
                  InfoToast({
                    toastId: accepted?.name,
                    type: 'info',
                    autoClose: true,
                    message: `${accepted?.name} با موفقیت بارگذاری شد`,
                  });
                }
              })
              .catch((error) => {
                reject(error);
                setIsUploading(false);
                console.log(error);
              });
          });
        }, Promise.resolve());
      }
    );
  };

  if (isNew) {
    return (
      <div style={{ margin: '0.5rem', width: '100%' }}>
        <CustomDropZone
          accept={['image/*', '.pdf']}
          // foramtExceptions={['jpg']}
          maxFiles={1}
          maxEachSize={1}
          maxTotalSize={1}
          onError={handleFileDropError}
          onUpload={handleUploadFiles}
          isUploading={isUploading}
          placeholders={{
            main: 'برای آپلود فایل خود را درون کادر نقطه‌چین بکشید',
          }}
        />
      </div>
    );
  }

  return (
    <Styled.FilesWrapper>
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

        return (
          <Styled.FileCellContainer key={FileID || index}>
            <Styled.FileInfoWrapper editable={isCellEditable}>
              <FileFormatIcon
                color={TCV_DEFAULT}
                size={25}
                format={decodeBase64(Extension)}
              />
              <Styled.FileLinkWrapper>
                {!!Downloadable ? (
                  <Link
                    to={IconURL}
                    target="_blank"
                    download
                    data-title={decodeBase64(FileName)}>
                    {decodeBase64(FileName)}
                  </Link>
                ) : (
                  decodeBase64(FileName)
                )}
              </Styled.FileLinkWrapper>
            </Styled.FileInfoWrapper>
            {isTableEditable && isCellEditable && isRowEditing && (
              <TrashIcon style={{ cursor: 'pointer' }} color={CV_RED} />
            )}
          </Styled.FileCellContainer>
        );
      })}
      {!!files && isRowEditing && (
        <Styled.AddNewFile>
          <PlusIcon size={20} color={TCV_WARM} />
          <Heading type="h5">افزودن فایل</Heading>
        </Styled.AddNewFile>
      )}
      {!files &&
        (isRowEditing ? (
          <Styled.AddNewFile>
            <PlusIcon size={20} color={TCV_WARM} />
            <Heading type="h5">افزودن فایل</Heading>
          </Styled.AddNewFile>
        ) : (
          <div>بدون فایل</div>
        ))}
    </Styled.FilesWrapper>
  );
};

export default FileCell;
