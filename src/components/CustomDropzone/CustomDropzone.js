/**
 * Renders a file upload conponent.
 */
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import * as Styled from './CustomDropzone.styles';
import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import { errorTypes } from './dropzoneUtils';
import { TCV_DEFAULT, CV_DISTANT } from 'constant/CssVariables';
import LoadingCircle from 'components/Icons/LoadingIcons/LoadingIconCircle';

/**
 * @typedef PlaceholderType
 * @type {Object}
 * @property {string} dragging -placeholder for dragging.
 * @property {string} main -placeholder for main.
 */

/**
 * @typedef PropType
 * @property {string[]} accept -The accepted file format.
 * @property {number} maxFiles -The maximum number of files that can be uploaded.
 * @property {number} maxEachSize -The maximum size of each file.
 * @property {number} maxTotalSize -The maximum size of all files.
 * @property {function} onError -A callback function that will fire on file upload error.
 * @property {function} onUpload -A callback function that will fire on file upload.
 * @property {Object} containerProps -The props passed to dropzone container.
 * @property {Object} inputProps -The props passed to input.
 * @property {PlaceholderType} placeholders -Placeholders for dropzone input.
 * @property {boolean} disabled -A flag that will disable dropzone area.
 * @property {string[]} foramtExceptions -All formats that are not allowed to be uploaded.
 * @property {Boolean} isUploading -All formats that are not allowed to be uploaded.
 * @property {JSX} customComponent -A custom component.
 * {foramtExceptions} prop has priority over {accept} prop.
 * If a format is defined forbidden in exceptions, component will throw error even if it is inside accept list.
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
    onUpload,
    containerProps,
    inputProps,
    disabled,
    foramtExceptions,
    placeholders,
    isUploading,
    customComponent: CustomComponent,
  } = props;
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);

  const getIcon = () => {
    if (isUploading) {
      return <LoadingCircle color={TCV_DEFAULT} />;
    } else {
      return (
        <FileFormatIcon
          style={{ minWidth: '2rem' }}
          format="upload"
          size={25}
          color={CV_DISTANT}
        />
      );
    }
  };

  //! Converts bytes to mega bytes
  const sizeInMB = (sizeInBytes) =>
    Number((sizeInBytes / (1024 * 1024)).toFixed(2));

  //! Custom validator
  const customValidator = (file) => {
    const fileFormat = file.name.split('.').pop();
    const fileSize = file.size;

    //! Compare file size against maximum allowed size for each file.
    if (sizeInMB(fileSize) > maxEachSize) {
      return {
        code: errorTypes.LARGE_FILE_ERROR,
        message: `حجم فایل بزرگتر از حد مجاز (${maxEachSize} مگابایت)است.`,
      };
    }

    //! See if file format is allowed or not.
    if (foramtExceptions && foramtExceptions.includes(fileFormat)) {
      return {
        code: errorTypes.FORMAT_ERROR,
        message: `فایل با فرمت ${fileFormat} مجاز نمی باشد.`,
      };
    }

    return null; //! file is clean and there is no error.
  };

  //! Fires on drop event.
  const onDrop = useCallback((acceptedFiles) => {
    setErrors([]);
    //! Calculate total file size.
    const totalSize = acceptedFiles
      .map((file) => file.size)
      .reduce((sum, size) => sum + sizeInMB(size), 0);

    // //! Set files(For error checking, If any!)
    setFiles(acceptedFiles);

    if (totalSize > maxTotalSize) {
      //! Creates maximum total size error.
      const totalSizeError = {
        code: errorTypes.TOTAL_SIZE_ERROR,
        message: `حجم کل فایل ها بیشتر از حد مجاز (${maxTotalSize} مگابایت) است.`,
      };
      setErrors((errors) => [...errors, totalSizeError]);
      return;
    } else if (!!errors.length) {
      return;
    } else {
      // console.log(acceptedFiles);
      //! Do something with the files
      onUpload && onUpload(acceptedFiles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
    // acceptedFiles,
    open,
  } = useDropzone({
    onDrop,
    accept: accept?.join(', '),
    maxFiles,
    disabled: !!disabled || isUploading,
    validator: customValidator,
    noKeyboard: !!CustomComponent,
    noClick: !!CustomComponent,
  });

  //! Handle errors thrown from dropzone and validator.
  const handleErrors = () => {
    //! Maximum file number error.
    if (fileRejections.length) {
      if (
        fileRejections.some(
          (file) => file?.errors?.[0]?.code === errorTypes.TOO_MANY_FILES_ERROR
        )
      ) {
        const tooManyFilesError = {
          code: fileRejections?.[0]?.errors?.[0]?.code,
          message: `تعداد فایل ها بیشتر از حد مجاز (${maxFiles} عدد) است.`,
        };
        setErrors((errors) => [...errors, tooManyFilesError]);
      }

      //! Maximum file size error.
      if (
        fileRejections.some(
          (file) => file?.errors?.[0]?.code === errorTypes.LARGE_FILE_ERROR
        )
      ) {
        const fileSizeError = fileRejections
          .filter(
            (file) =>
              file?.errors?.[0]?.code !== errorTypes.TOO_MANY_FILES_ERROR
          )
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
        setErrors((errors) => [...errors, ...fileSizeError]);
      }
    }

    //! Format exceptions error.
    if (
      fileRejections.some(
        (file) => file?.errors?.[0]?.code === errorTypes.FORMAT_ERROR
      )
    ) {
      const notAllowedFormatError = {
        code: fileRejections?.[0]?.errors?.[0]?.code,
        message: fileRejections?.[0]?.errors?.[0]?.message,
      };
      setErrors((errors) => [...errors, notAllowedFormatError]);
    }
  };

  //! Check for errors every time files are changed.
  useEffect(() => {
    handleErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  //! OnError callback.
  useEffect(() => {
    if (!!errors.length) {
      onError && onError(errors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  return (
    <>
      {!!CustomComponent && <CustomComponent onClick={open} />}
      <Styled.DropzoneContainer
        isHidden={!!CustomComponent}
        {...getRootProps({ ...containerProps, refKey: 'innerRef' })}>
        {getIcon()}
        <Styled.InputWrapper>
          <input {...getInputProps(inputProps)} />
          {isDragActive ? (
            <Styled.DropzonePlaceholder>
              {placeholders?.dragging}
            </Styled.DropzonePlaceholder>
          ) : (
            <Styled.DropzonePlaceholder>
              {placeholders?.main}
            </Styled.DropzonePlaceholder>
          )}
        </Styled.InputWrapper>
      </Styled.DropzoneContainer>
    </>
  );
};

CustomDropzone.propTypes = {
  accept: PropTypes.array,
  maxFiles: PropTypes.number,
  maxEachSize: PropTypes.number,
  maxTotalSize: PropTypes.number,
  onError: PropTypes.func,
  onUpload: PropTypes.func,
  containerProps: PropTypes.object,
  inputProps: PropTypes.object,
  disabled: PropTypes.bool,
  foramtExceptions: PropTypes.array,
  placeholders: PropTypes.object,
  isUploading: PropTypes.bool,
};

CustomDropzone.defaultProps = {
  placeholders: {
    main: 'Click or Drag&Drop',
    dragging: 'Drop here ...',
  },
};

CustomDropzone.displayName = 'CustomDropzoneComponent';

export default CustomDropzone;
