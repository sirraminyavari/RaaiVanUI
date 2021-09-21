import FormCell from 'components/FormElements/FormFill/FormCell';
import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import CustomDropzone from 'components/CustomDropzone/CustomDropzone';
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

  console.log({ props, infoJSON, value }, 'file field');

  const handleUploadFile = (acceptedFiles) => {
    // console.log(acceptedFiles);
    if (acceptedFiles?.length) {
      getUploadLink()
        .then((response) => {
          const uploadURL = response.slice(5);

          acceptedFiles.reduce(async (previousPromise, file) => {
            await previousPromise;

            return new Promise((resolve, reject) => {
              //! Prepare upload data
              let formData = new FormData();
              formData.append('file', file);

              //! Keep track of upload progress.
              let options = {
                onUploadProgress: (progressEvent) => {
                  const { loaded, total } = progressEvent;
                  let percentage = Math.floor((loaded * 100) / total);

                  //! Executes if upload progress is over.
                  if (percentage === 100) {
                    resolve();
                  }
                },
              };
              //! Post file to server.
              axios
                .post(uploadURL, formData, options)
                .then((response) => console.log(response))
                .catch((error) => {
                  //! Axios error.
                  reject(error);
                });
            });
          }, Promise.resolve());
        })
        .catch((error) => {
          //! Get upload link error.
          console.log(error);
        });
      // onAnyFieldChanged(elementId, event, type )
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
        <CustomDropzone
          maxFiles={1} //! (infoJSON?.MaxCount)
          maxTotalSize={1} //! (infoJSON?.TotalSize)
          maxEachSize={1} //! (infoJSON?.MaxSize)
          accept={['image/*']} //! (infoJSON?.AllowedExtensions)
          onUpload={handleUploadFile}
          // placeholders={{
          //   main: 'فایل را بکشید و رها کنید یا کلیک کنید',
          //   dragging: 'اینجا رها کنید...',
          // }}
          onError={(error) => console.log(error)}
        />
      </Styled.FilesContainer>
    </FormCell>
  );
};

export default FileField;
