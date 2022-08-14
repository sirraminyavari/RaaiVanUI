import FormCell from 'components/FormElements/FormFill/FormCell';
import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import CustomDropZone from 'components/CustomDropzone/CustomDropzone';
import { CV_GRAY } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import * as Styled from './FileField.styles';
import FileShowCell from './FileShowCell';
import { getUploadLink } from 'apiHelper/apiFunctions';
import axios from 'axios';
import DeleteConfirmModal from 'components/Modal/DeleteConfirm';
import { useContext, useMemo, useState } from 'react';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import { random } from 'helpers/helpers';
import { EditableContext } from '../../FormFill';

const FileField = ({
  value,
  decodeInfo,
  decodeTitle,
  onAnyFieldChanged,
  elementId,
  type,
  Files,
  ...rest
}) => {
  const { RVDic } = useWindow();
  const editable = useContext(EditableContext);
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [readyToUploadFiles, setReadyToUploadFiles] = useState([]);
  const [allFiles, setAllFiles] = useState(Files);
  const isTabletOrMobile = DimensionHelper().isTabletOrMobile;

  //TODO update hardcoded text literals with associated RVDic
  //TODO Improve upload handling functionality via Redux-SAGA or queue alternatives
  //TODO add comments and JSDoc templates

  // const infoJSON = GlobalUtilities.to_json(decodeInfo) || {};
  const saveFunctionality = useMemo(
    () =>
      async (files = allFiles) => {
        setReadyToUploadFiles([]);
        return onAnyFieldChanged(elementId, files, type);
      },
    [elementId, onAnyFieldChanged, type, allFiles]
  );

  //! Upload to server with axios.
  const uploadFile = (file, url) => {
    //! Prepare upload data
    let formData = new FormData();
    formData.append('file', file);
    const uploadID = random();
    const cancelTokenSource = axios.CancelToken.source();
    setUploadingFiles((items) => {
      return [
        ...items,
        {
          uploadID,
          file,
          cancelFunction: () => cancelTokenSource.cancel('Upload cancelled'),
        },
      ];
    });
    //! Post file to the server.
    return axios.post(url, formData, {
      cancelToken: cancelTokenSource.token,
      onUploadProgress: function (progressEvent) {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadingFiles((items) =>
          items.map((item) => {
            if (item.uploadID === uploadID)
              return { ...item, percentCompleted };
            return item;
          })
        );
      },
    });
  };

  //! Get upload link and upload file(s).
  const handleUploadFile = async (acceptedFiles, allFiles) => {
    // console.log(acceptedFiles);
    if (acceptedFiles?.length) {
      const result = await getUploadLink();
      const uploadURL = result;

      const promises = acceptedFiles.map((file) => {
        return uploadFile(file, uploadURL).catch((error) => error);
      });

      Promise.all(promises)
        .then((responses) => {
          if (responses.length) {
            setUploadingFiles([]);
            //! Response data.
            const datas = responses
              ?.map((res) => res?.data)
              ?.filter((data) => data?.success);

            //! Uploaded files.
            const files = datas.map(({ AttachedFile }) => ({
              ...AttachedFile,
            }));
            console.log({ allFiles, files });
            if (datas.length) {
              setAllFiles((prevFiles) => {
                // saveFunctionality([...prevFiles, ...files]);
                setReadyToUploadFiles(files);
                return [...prevFiles, ...files];
              });
              // alert('saved', {
              //   Timeout: 1000,
              // });
            }
          }
        })
        .catch((error) => console.log(`Error in uploading ${error}`));
    }
  };

  //! remove Item from uploadList
  const handleRemoveFile = (FileID) => async () => {
    // console.log(acceptedFiles);

    const files = allFiles?.filter((fileItem) => fileItem.FileID !== FileID);
    const isSaved = await onAnyFieldChanged(elementId, files, 'File');
    if (isSaved) setAllFiles(files);
    setDeleteModalStatus(false);

    // alert('saved', {
    //   Timeout: 1000,
    // });
  };

  return (
    <FormCell
      iconComponent={<FileFormatIcon size={'1.25rem'} color={CV_GRAY} />}
      title={decodeTitle}
      editMode={readyToUploadFiles.length}
      onSave={() => {
        saveFunctionality(allFiles);
      }}
      {...rest}
    >
      <DeleteConfirmModal
        show={deleteModalStatus}
        messageQuestion="آیا از حذف اطمینان دارید؟"
        confirmText="حذف"
        cancelText="بازگشت"
        title="حذف فایل"
        onCancel={() => setDeleteModalStatus(false)}
        onClose={() => setDeleteModalStatus(false)}
        onConfirm={handleRemoveFile(deleteModalStatus)}
      />
      <Styled.FilesContainer isTabletOrMobile={isTabletOrMobile}>
        {allFiles?.map((file, key) => (
          <FileShowCell
            isEditable={editable}
            file={file}
            key={key}
            onDelete={() => setDeleteModalStatus(file.FileID)}
          />
        ))}
        {uploadingFiles?.map((file, key) => {
          return <FileShowCell uploadingFile={file} key={key} />;
        })}
        {editable && (
          <CustomDropZone
            maxFiles={2} //! (infoJSON?.MaxCount)
            maxTotalSize={2} //! (infoJSON?.TotalSize)
            maxEachSize={1} //! (infoJSON?.MaxSize)
            accept={['image/*']} //! (infoJSON?.AllowedExtensions)
            onUpload={(acceptedFiles) =>
              handleUploadFile(acceptedFiles, allFiles)
            }
            placeholders={{
              main: RVDic.DropFilesHere,
              dragging: 'اینجا رها کنید...',
            }}
            onError={(error) => console.log(error)}
          />
        )}
      </Styled.FilesContainer>
    </FormCell>
  );
};

export default FileField;
