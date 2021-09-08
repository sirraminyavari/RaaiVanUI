import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as Styled from './FileCell.styles';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import { CV_RED, TCV_DEFAULT } from 'constant/CssVariables';
import CustomDropzone from 'components/CustomDropzone/CustomDropzone';
import { API_Provider } from 'helpers/helpers';
import InfoToast from 'components/toasts/info-toast/InfoToast';

const apiHandler = API_Provider('DocsAPI', 'GetUploadLink');

const FileCell = (props) => {
  // console.log('fileCell', props);
  const [isUploading, setIsUploading] = useState(false);
  const fileTitle = props?.value?.fileTitle;
  const fileURL = props?.value?.fileURL;

  const handeFileDropError = (error) => {
    if (!props?.isNew) return;
    console.log(error);
  };

  const handleUploadFiles = (acceptedFiles) => {
    if (!props?.isNew) return;

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
                  //! Resolve promise if and only if ulpoade process is ended.
                  resolve();
                }
              },
            };

            //! Post file to the server.
            axios
              .post(uploadURL, formData, options)
              .then((response) => {
                if (response?.data?.success) {
                  setIsUploading(false);
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

  if (props?.isNew) {
    return (
      <CustomDropzone
        accept={['image/*', '.pdf']}
        // foramtExceptions={['jpg']}
        maxFiles={1}
        maxEachSize={1}
        maxTotalSize={1}
        onError={handeFileDropError}
        onUpload={handleUploadFiles}
        isUploading={isUploading}
        placeholders={{
          main: 'کلیک یا فایل را بکشید و رها کنید',
        }}
      />
    );
  }

  return (
    <Styled.FileCellContainer>
      <Styled.FileInfoWrapper editable={props?.header?.options?.editable}>
        <FileFormatIcon color={TCV_DEFAULT} size={25} format="pdf" />
        <Styled.FileLinkWrapper>
          <Link to={fileURL} target="_blank" download data-title={fileTitle}>
            {fileTitle}
          </Link>
        </Styled.FileLinkWrapper>
      </Styled.FileInfoWrapper>
      {props?.editable && props?.header?.options?.editable && (
        <TrashIcon style={{ cursor: 'pointer' }} color={CV_RED} />
      )}
    </Styled.FileCellContainer>
  );
};

export default FileCell;
