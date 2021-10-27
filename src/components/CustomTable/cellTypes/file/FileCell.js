import { useState, useCallback, useRef, useEffect } from 'react';
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
import Button from 'components/Buttons/Button';
import useWindow from 'hooks/useWindowContext';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';

const getUploadLinkAPI = API_Provider(DOCS_API, GET_UPLOAD_LINK);

const FileCell = (props) => {
  const { RVDic } = useWindow();

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
  const { Files: initialFiles, Info, ElementID } = value || {};

  const isCellEditable = !!header?.options?.editable;
  const rowId = row?.original?.id;
  const columnId = column?.id;
  const isRowEditing = rowId === editingRow;

  const canEdit = (isTableEditable && isCellEditable && isRowEditing) || isNew;

  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState(isNew ? [] : initialFiles);

  const beforeChangeFilesRef = useRef(null);

  useEffect(() => {
    if (isNew) {
      beforeChangeFilesRef.current = [];
    } else {
      beforeChangeFilesRef.current = initialFiles;
    }

    return () => {
      beforeChangeFilesRef.current = null;
    };
  }, [canEdit, initialFiles, isNew]);

  const isSaveDisabled =
    JSON.stringify(
      beforeChangeFilesRef.current?.map((x) => x?.NodeID).sort()
    ) === JSON.stringify(files?.map((y) => y?.NodeID).sort()) ||
    (isNew && !files.length);

  const handleRemoveFile = useCallback((fileId) => {
    removeFile(ElementID, fileId)
      .then((response) => {
        if (response?.Succeed) {
          console.log(response, 'remove file');

          setFiles((oldFiles) =>
            oldFiles?.filter((file) => file?.FileID !== fileId)
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleFileDropError = (error) => {
    if (!canEdit) return;
    console.log(error);
  };

  //! Save uploaded files.
  const handleSaveFiles = () => {
    const extendedFiles = files.map((file) => {
      return { ...file, OwnerID: ElementID };
    });
    const fileCell = { ...value, Files: extendedFiles };
    onCellChange(rowId, columnId, fileCell, extendedFiles);
  };

  const handleUploadFiles = (acceptedFiles) => {
    if (!canEdit) return;

    //! Get upload link.
    getUploadLinkAPI.url(
      {
        OwnerID: '',
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
                  setFiles((oldFiles) => [
                    ...(oldFiles || []),
                    response?.data?.AttachedFile,
                  ]);

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
    <Styled.FileCellContainer>
      <Styled.FilesWrapper>
        <Styled.FileListWrapper isEditMode={canEdit}>
          <FilesList
            files={files}
            canEdit={canEdit}
            onRemoveFile={handleRemoveFile}
          />
          {!files?.length && !isUploading && (
            <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
          )}
          {isUploading && <LogoLoader lottieWidth="3rem" />}
        </Styled.FileListWrapper>
        {canEdit && (
          <Button
            disable={isSaveDisabled}
            classes="table-file-cell-save-button"
            onClick={handleSaveFiles}>
            <Styled.SaveButtonHeading
              type="h4"
              style={{ color: isSaveDisabled ? CV_DISTANT : TCV_DEFAULT }}>
              {RVDic.Save}
            </Styled.SaveButtonHeading>
          </Button>
        )}
      </Styled.FilesWrapper>
      {canEdit && (
        <div style={{ width: '100%', marginTop: '0.3rem' }}>
          <CustomDropZone
            accept={['image/*', '.pdf']}
            // formatExceptions={['jpg']}
            maxFiles={1}
            maxEachSize={1}
            maxTotalSize={1}
            onError={handleFileDropError}
            onUpload={handleUploadFiles}
            isUploading={isUploading}
            placeholders={{
              main: 'برای آپلود فایل خود را درون کادر نقطه‌چین بکشید',
            }}
            customComponent={AddFileButton}
          />
        </div>
      )}
    </Styled.FileCellContainer>
  );
};

export default FileCell;
