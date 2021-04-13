/**
 * Renders a file upload conponent.
 */
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import * as Styled from './CustomDropzone.styles';
import UploadFileIcon from 'components/Icons/UploadFileIcon/UploadFile';

const CustomeDropzone = (props) => {
  const { accept, maxFiles, maxEachSize, maxAllSize, onError } = props;
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);

  const sizeInMB = (sizeInBytes) =>
    Number((sizeInBytes / (1024 * 1024)).toFixed(2));

  const customValidator = (file) => {
    if (sizeInMB(file.size) > maxEachSize) {
      return {
        code: 'file-too-large',
        message: `حجم فایل ${file.name} بزرگتر از حد مجاز (${maxEachSize} مگابایت)است.`,
      };
    }
    return null;
  };

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
    //! Do something with the files
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        //! Do whatever you want with the file contents
        const fileURL = reader.result;
        // console.log(fileURL);
      };
    });
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
    acceptedFiles,
    open,
  } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    validator: customValidator,
    // noKeyboard: true,
    // noClick: true,
  });

  const handlErrors = () => {
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

    if (acceptedFiles.length) {
      const totalSize = acceptedFiles
        .map((file) => file.size)
        .reduce((sum, size) => sum + sizeInMB(size), 0);
      if (totalSize > maxAllSize) {
        const totalSizeError = {
          code: 'total-size-exception',
          message: `حجم کل فایل ها بیشتر از حد مجاز (${maxAllSize} مگابایت) است.`,
        };
        setErrors((c) => c.concat(totalSizeError));
      }
    }
  };

  const thumbs = files.map((file) => (
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
      // Make sure to revoke the data uris to avoid memory leaks
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
      <Styled.DropzoneContainer {...getRootProps({ refKey: 'innerRef' })}>
        <Styled.UploadIconWrapper>
          <UploadFileIcon size={30} color="#fff" />
        </Styled.UploadIconWrapper>
        <Styled.InputWrapper>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>فایل های انتخابی را در این باکس رها کنید...</p>
          ) : (
            <p>
              برای انتخاب فایل آنها را بگیرید و اینجا رها کنید و یا درون باکس
              کلیک کنید...
            </p>
          )}
        </Styled.InputWrapper>
      </Styled.DropzoneContainer>
      <Styled.ThumbsContainer>{thumbs}</Styled.ThumbsContainer>
      {errors.map((error, index) => {
        return <p style={{ color: 'red' }}>{error.message}</p>;
      })}
    </>
  );
};

export default CustomeDropzone;
