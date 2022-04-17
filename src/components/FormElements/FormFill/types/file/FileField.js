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
import { useEffect, useMemo, useState } from 'react';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

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
  const { GlobalUtilities, RVDic } = useWindow();
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);
  const isTabletOrMobile = DimensionHelper().isTabletOrMobile;

  const infoJSON = GlobalUtilities.to_json(decodeInfo) || {};

  //! Upload to server with axios.
  const uploadFile = (file, url) => {
    //! Prepare upload data
    let formData = new FormData();
    formData.append('file', file);

    //! Post file to the server.
    return axios.post(url, formData);
  };

  //! Get upload link and upload file(s).
  const handleUploadFile = useMemo(
    () => async (acceptedFiles) => {
      // console.log(acceptedFiles);
      if (acceptedFiles?.length) {
        const result = await getUploadLink();
        const uploadURL = result;
        console.log(uploadURL);

        const promises = acceptedFiles.map((file) => {
          return uploadFile(file, uploadURL).catch((error) => error);
        });

        Promise.all(promises)
          .then((responses) => {
            if (responses.length) {
              //! Response data.
              const datas = responses
                ?.map((res) => res?.data)
                ?.filter((data) => data?.success);

              //! Uploaded files.
              const files = datas.map((data) => data?.AttachedFile);
              console.log({ asd: [...Files, ...files] });
              onAnyFieldChanged(elementId, [...Files, ...files], type);
            }
          })
          .catch((error) => console.log(`Error in uploading ${error}`));
      }
    },
    [onAnyFieldChanged]
  );

  return (
    <FormCell
      iconComponent={<FileFormatIcon size={'1.25rem'} color={CV_GRAY} />}
      title={decodeTitle}
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
        onConfirm={() => setDeleteModalStatus(false)}
      />
      <Styled.FilesContainer isTabletOrMobile={isTabletOrMobile}>
        {Files?.map((file, key) => (
          <FileShowCell file={file} key={key} />
        ))}
        <CustomDropZone
          maxFiles={2} //! (infoJSON?.MaxCount)
          maxTotalSize={2} //! (infoJSON?.TotalSize)
          maxEachSize={1} //! (infoJSON?.MaxSize)
          accept={['image/*']} //! (infoJSON?.AllowedExtensions)
          onUpload={handleUploadFile}
          placeholders={{
            main: RVDic.DropFilesHere,
            dragging: 'اینجا رها کنید...',
          }}
          onError={(error) => console.log(error)}
        />
      </Styled.FilesContainer>
    </FormCell>
  );
};

export default FileField;
