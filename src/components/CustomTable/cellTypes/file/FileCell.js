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
// import useWindow from 'hooks/useWindowContext';

const getUploadLinkAPI = API_Provider(DOCS_API, GET_UPLOAD_LINK);

const FileCell = (props) => {
  // const { RVDic } = useWindow();

  const {
    row,
    editingRowId,
    onCellChange,
    column,
    value,
    editable: isTableEditable,
    header,
    selectedCell,
    tempRowId,
  } = props;

  const { Files: initialFiles, Info, ElementID } = value || {};

  const rowId = row?.original?.id;
  const columnId = column?.id;
  const selectedRowId = selectedCell?.row?.original?.id;
  const selectedColumnId = selectedCell?.column?.id;

  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRowId;
  const isCellEditing =
    rowId === selectedRowId && columnId === selectedColumnId;
  const isNewRow = tempRowId === rowId;

  const canEdit =
    (isTableEditable && isCellEditable && (isRowEditing || isCellEditing)) ||
    isNewRow;

  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState(isNewRow ? [] : initialFiles);

  const beforeChangeFilesRef = useRef(null);

  useEffect(() => {
    if (isNewRow) {
      beforeChangeFilesRef.current = [];
    } else {
      beforeChangeFilesRef.current = initialFiles;
    }

    return () => {
      beforeChangeFilesRef.current = null;
    };
  }, [canEdit, initialFiles, isNewRow]);

  const handleFileDropError = (error) => {
    if (!canEdit) return;
    console.log(error);
  };

  //! Update file cell.
  const updateFileCell = (newFiles) => {
    const extendedFiles = newFiles?.map((file) => {
      return { ...file, OwnerID: ElementID };
    });
    const fileCell = { ...value, Files: extendedFiles };
    onCellChange(rowId, columnId, fileCell, extendedFiles);
  };

  const handleRemoveFile = useCallback((fileId) => {
    let filteredFiles = files?.filter((file) => file?.FileID !== fileId);

    setFiles(filteredFiles);
    updateFileCell(filteredFiles);
  }, []);

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
                  let newFilesList = [
                    ...(files || []),
                    response?.data?.AttachedFile,
                  ];
                  setFiles(newFilesList);
                  updateFileCell(newFilesList);

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
      <FilesList
        files={files}
        canEdit={canEdit}
        onRemoveFile={handleRemoveFile}
      />
      {!files?.length && !isUploading && (
        <Styled.EmptyCellView>انتخاب کنید</Styled.EmptyCellView>
      )}
      {isUploading && <LogoLoader lottieWidth="3rem" />}
      {canEdit && (
        <Styled.AddNewFileWrapper>
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
        </Styled.AddNewFileWrapper>
      )}
    </Styled.FileCellContainer>
  );
};

export default FileCell;
