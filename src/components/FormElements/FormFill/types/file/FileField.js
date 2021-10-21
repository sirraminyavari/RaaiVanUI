import FormCell from 'components/FormElements/FormFill/FormCell';
import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import CustomDropZone from 'components/CustomDropzone/CustomDropzone';
import { CV_GRAY } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import * as Styled from './FileField.styles';
import FileShowCell from './FileShowCell';
import { getUploadLink } from 'apiHelper/apiFunctions';
import axios from 'axios';

const FileField = (props) => {
  const { GlobalUtilities } = useWindow();

  const {
    value,
    decodeInfo,
    decodeTitle,
    onAnyFieldChanged,
    elementId,
    type,
    ...rest
  } = props;

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
  const handleUploadFile = async (acceptedFiles) => {
    // console.log(acceptedFiles);
    if (acceptedFiles?.length) {
      const result = await getUploadLink();
      const uploadURL = result.slice(5);
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
            onAnyFieldChanged(elementId, files, type);
          }
        })
        .catch((error) => console.log(`Error in uploading ${error}`));
    }
  };

  return (
    <FormCell
      iconComponent={<FileFormatIcon size={18} color={CV_GRAY} />}
      title={decodeTitle}
      {...rest}>
      <Styled.FilesContainer>
        {value?.map((file, key) => (
          <FileShowCell file={file} key={key} />
        ))}
        <FileShowCell file={1} />
        <FileShowCell file={2} />
        <CustomDropZone
          maxFiles={2} //! (infoJSON?.MaxCount)
          maxTotalSize={2} //! (infoJSON?.TotalSize)
          maxEachSize={1} //! (infoJSON?.MaxSize)
          accept={['image/*']} //! (infoJSON?.AllowedExtensions)
          onUpload={handleUploadFile}
          placeholders={{
            main: 'برای آپلود فایل خود را درون کادر نقطه‌چین بکشید',
            dragging: 'اینجا رها کنید...',
          }}
          onError={(error) => console.log(error)}
        />
      </Styled.FilesContainer>
    </FormCell>
  );
};

export default FileField;
