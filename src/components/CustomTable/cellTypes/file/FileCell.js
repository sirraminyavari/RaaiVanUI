import { useState, useCallback } from 'react';
import axios from 'axios';
import * as Styled from './FileCell.styles';
import CustomDropZone from 'components/CustomDropzone/CustomDropzone';
import { API_Provider } from 'helpers/helpers';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import FilesList from './FilesList';
import AddFileButton from './AddFileButton';
import { DOCS_API, GET_UPLOAD_LINK } from 'constant/apiConstants';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { removeFile } from 'apiHelper/apiFunctions';

const getUploadLinkAPI = API_Provider(DOCS_API, GET_UPLOAD_LINK);

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
  const { Files, Info, ElementID } = value || {};

  const [isUploading, setIsUploading] = useState(false);

  const isCellEditable = !!header?.options?.editable;

  const rowId = row?.original?.id;
  const columnId = column?.id;

  const isRowEditing = rowId === editingRow;

  const canEdit = isTableEditable && isCellEditable && isRowEditing;

  const handleRemoveFile = useCallback((fileId) => {
    removeFile(ElementID, fileId)
      .then((response) => {
        if (response?.Succeed) {
          console.log(response, 'remove');
          const newFilesArray = Files?.filter(
            (file) => file?.FileID !== fileId
          );
          const fileCell = { ...value, Files: newFilesArray };
          onCellChange(rowId, columnId, fileCell, newFilesArray);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleFileDropError = (error) => {
    if (isNew || !canEdit) return;
    console.log(error);
  };

  const handleUploadFiles = (acceptedFiles) => {
    if (isNew || !canEdit) return;

    //! Get upload link.
    getUploadLinkAPI.url(
      {
        OwnerID: ElementID,
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
                    ...(Files || []),
                    response?.data?.AttachedFile,
                  ];
                  const fileCell = { ...value, Files: newFilesArray };
                  onCellChange(rowId, columnId, fileCell, newFilesArray);
                  // setFiles(newFilesArray);

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

  return (
    <Styled.FilesWrapper>
      <FilesList
        files={Files}
        canEdit={canEdit}
        onRemoveFile={handleRemoveFile}
      />
      {isUploading && <LogoLoader lottieWidth="3rem" />}
      {canEdit || isNew ? (
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
            customComponent={isNew ? undefined : AddFileButton}
          />
        </div>
      ) : (
        !Files && <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
      )}
    </Styled.FilesWrapper>
  );
};

export default FileCell;
