/**
 * Renders a file upload conponent.
 */
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import * as Styled from './CustomDropzone.styles';
import UploadFileIcon from 'components/Icons/UploadFileIcon/UploadFile';
import APIHandler from 'apiHelper/APIHandler';
import axios from 'axios';
import ProgressBar from 'components/ProgressBar/ProgressBar';

/**
 * @typedef PropType
 * @property {string} accept -The accepted file format.
 * @property {number} maxFiles -The maximum number of files that can be uploaded.
 * @property {number} maxEachSize -The maximum size of each file.
 * @property {number} maxTotalSize -The maximum size of all files.
 * @property {function} onError -A callback function that will fire on file upload exception.
 * @property {Object} containerProps -The props passed to dropzone container.
 * @property {Object} inputProps -The props passed to input.
 * @property {string} [nodeId] -Node id.
 * @property {boolean} disabled -A flag that will disable dropzone area.
 * @property {string[]} exceptions -All formats that are not allowed to be uploaded.
 * {exceptions} prop has priority over {accept} prop.
 * If a format is defined forbidden in exceptions, component will throw error even if it is accepted.
 */

/**
 *  @description Renders a file upload component.
 * @component
 * @param {PropType} props
 */
const CustomDropzone = (props) => {
  const {
    accept,
    maxFiles,
    maxEachSize,
    maxTotalSize,
    onError,
    containerProps,
    inputProps,
    nodeId,
    disabled,
    exceptions,
  } = props;
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [bar, setBar] = useState({});
  const apiHandler = new APIHandler('DocsAPI', 'GetUploadLink');

  //! Converts bytes to mega bytes
  const sizeInMB = (sizeInBytes) =>
    Number((sizeInBytes / (1024 * 1024)).toFixed(2));

  //! Custom validator
  const customValidator = (file) => {
    const fileFormat = file.name.split('.').pop();
    const fileSize = file.size;
    const fileName = file.name;

    //! Compare file size against maximum allowed size for each file.
    if (sizeInMB(fileSize) > maxEachSize) {
      return {
        code: 'file-too-large',
        message: `حجم فایل ${fileName} بزرگتر از حد مجاز (${maxEachSize} مگابایت)است.`,
      };
    }

    //! See if file format is allowed or not.
    if (exceptions && exceptions.includes(fileFormat)) {
      return {
        code: 'not-allowed-format',
        message: `فایل با فرمت ${fileFormat} مجاز نمی باشد.`,
      };
    }

    return null; //! file is clean and there is no error.
  };

  //! Sets toastify alert for each error.
  useEffect(() => {
    if (errors.length) {
      errors.forEach((err) => {
        window.alert(err.message);
      });
    }
  }, [errors]);

  //! Fires on drop event.
  const onDrop = useCallback((acceptedFiles) => {
    const totalSize = acceptedFiles
      .map((file) => file.size)
      .reduce((sum, size) => sum + sizeInMB(size), 0);

    if (totalSize > maxTotalSize) {
      //! Creates maximum total size error.
      const totalSizeError = {
        code: 'total-size-exception',
        message: `حجم کل فایل ها بیشتر از حد مجاز (${maxTotalSize} مگابایت) است.`,
      };
      // setFiles((files) => {
      //   files.length = 0;
      //   return files;
      // });
      setErrors((c) => c.concat(totalSizeError));
    } else {
      //! Sets accepted files and assign new properties.
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            uploadPercentage: 0,
          })
        )
      );
      console.log(acceptedFiles);
      //! Do something with the files

      //! Uploads accepted files asynchronous.
      acceptedFiles.reduce(async (previousPromise, accepted) => {
        await previousPromise;

        return new Promise((resolve, reject) => {
          //! Get upload link.
          apiHandler.url(
            {
              OwnerID: nodeId,
              OwnerType: 'Node',
            },
            (response) => {
              let uploadURL = response.slice(5);
              //! Prepare upload data
              let formData = new FormData();
              formData.append('file', accepted);

              //! Keep track of upload progress.
              let options = {
                onUploadProgress: (progressEvent) => {
                  const { loaded, total } = progressEvent;
                  let percentage = Math.floor((loaded * 100) / total);

                  //! Sets current progress bar values.
                  setBar({
                    name: accepted.name,
                    uploadPercentage: percentage,
                    description: `${sizeInMB(loaded)}MB of ${sizeInMB(
                      total
                    )}MB`,
                  });

                  //! Executes if upload progress is over.
                  if (percentage === 100) {
                    //! Sets upload percentage property of just finished file to 100.
                    setFiles((c) =>
                      c.map((file) => {
                        if (file.name === accepted.name) {
                          file.uploadPercentage = 100;
                          return file;
                        }
                        return file;
                      })
                    );
                    //! Empty finished progress bar.
                    setBar({});
                    resolve();
                  }
                },
              };
              //! Post file to server.
              // axios.post(uploadURL, formData, options);
            }
          );
        });
      }, Promise.resolve());
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
    acceptedFiles,
    // open,
  } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    disabled: !!disabled,
    validator: customValidator,
    // noKeyboard: true,
    // noClick: true,
  });

  //! Handle errors thrown from dropzone and validator.
  const handlErrors = () => {
    //! Maximum file number error.
    if (fileRejections.length) {
      // console.log(fileRejections);
      if (
        fileRejections.some((file) => file.errors[0].code === 'too-many-files')
      ) {
        setErrors((c) =>
          c.concat({
            code: fileRejections[0].errors[0].code,
            message: `تعداد فایل ها بیشتر از حد مجاز (${maxFiles} عدد) است.`,
          })
        );
      }

      //! Maximum file size error.
      if (
        fileRejections.some((file) => file.errors[0].code === 'file-too-large')
      ) {
        const fileSizeError = fileRejections
          .filter((file) => file.errors[0].code !== 'too-many-files')
          .map((file) => {
            return {
              code: file.errors[0].code,
              message: file.errors[0].message,
              fileName: file.file.name,
              fileSize: {
                sizeInBytes: file.file.size,
                sizeInMB: sizeInMB(file.file.size),
                sizeReadable: sizeInMB(file.file.size) + 'MB',
              },
            };
          });
        setErrors((c) => c.concat(fileSizeError));
      }
    }

    //! Format exceptions error.
    if (
      fileRejections.some(
        (file) => file.errors[0].code === 'not-allowed-format'
      )
    ) {
      setErrors((c) =>
        c.concat({
          code: fileRejections[0].errors[0].code,
          message: fileRejections[0].errors[0].message,
        })
      );
    }
  };

  //! Prepares thumbnail images.
  const thumbs = files
    .filter((file) => file.name.endsWith('.jpg') || file.name.endsWith('.png'))
    .map((file) => (
      <Styled.Thumb key={file.name}>
        <Styled.ThumbInner>
          <Styled.ThumbImage src={file.preview} alt="thumb-dropzone" />
        </Styled.ThumbInner>
      </Styled.Thumb>
    ));

  useEffect(() => {
    handlErrors();
    //! Clearn up
    return () => {
      //! Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
      setErrors([]);
    };
  }, [files]);

  useEffect(() => {
    if (errors.length) {
      onError(errors);
    }
  }, [errors]);

  return (
    <>
      <Styled.DropzoneContainer
        {...getRootProps({ ...containerProps, refKey: 'innerRef' })}>
        <Styled.UploadIconWrapper>
          <UploadFileIcon size={30} color="#fff" />
        </Styled.UploadIconWrapper>
        <Styled.InputWrapper>
          <input {...getInputProps(inputProps)} />
          {isDragActive ? (
            <p>فایل های انتخابی را در این باکس رها کنید...</p>
          ) : (
            <p>
              برای انتخاب فایل آنها را بگیرید و درون باکس رها و یا کلیک کنید...
            </p>
          )}
        </Styled.InputWrapper>
      </Styled.DropzoneContainer>
      <Styled.ThumbsContainer>{thumbs}</Styled.ThumbsContainer>
      {errors.map((error, index) => {
        return <p style={{ color: 'red' }}>{error.message}</p>;
      })}
      {files.map((file, index, self) => {
        if (file.name === bar.name) {
          return (
            <ProgressBar
              progress={bar.uploadPercentage}
              label={`${bar.name}(${bar.description})`}
            />
          );
        }
        return (
          <ProgressBar progress={file.uploadPercentage} label={file.name} />
        );
      })}
    </>
  );
};

CustomDropzone.propTypes = {
  accept: PropTypes.string,
  maxFiles: PropTypes.number,
  maxEachSize: PropTypes.number,
  maxTotalSize: PropTypes.number,
  onError: PropTypes.func,
  containerProps: PropTypes.object,
  inputProps: PropTypes.object,
  nodeId: PropTypes.string,
  disabled: PropTypes.bool,
  exceptions: PropTypes.array,
};

CustomDropzone.defaultProps = {
  nodeId: '',
};

CustomDropzone.displayName = 'CustomDropzoneComponent';

export default CustomDropzone;
