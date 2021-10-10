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
  const [isUploading, setIsUploading] = useState(false);
  const { files } = props?.value || {};

  const handleFileDropError = (error) => {
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
      {!files && (
        <Styled.AddNewFile>
          <PlusIcon size={20} color={TCV_WARM} />
          <Heading type="h5">افزودن فایل</Heading>
        </Styled.AddNewFile>
      )}
      {files?.map((file, index) => {
        const {
          Downloadable,
          Extension,
          FileID,
          FileName,
          IconURL,
          MIME,
          OwnerID,
          Size,
        } = file;

        return (
          <Styled.FileCellContainer key={FileID || index}>
            <Styled.FileInfoWrapper editable={props?.header?.options?.editable}>
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
            {props?.editable && props?.header?.options?.editable && (
              <TrashIcon style={{ cursor: 'pointer' }} color={CV_RED} />
            )}
          </Styled.FileCellContainer>
        );
      })}
    </Styled.FilesWrapper>
  );
};

export default FileCell;
