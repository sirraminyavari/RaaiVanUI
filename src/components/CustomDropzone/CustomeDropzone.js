/**
 * Renders a file upload conponent.
 */
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as Styled from './CustomDropzone.styles';
import UploadFileIcon from 'components/Icons/UploadFileIcon/UploadFile';

const CustomeDropzone = (props) => {
  const { accept } = props;
  const [files, setFiles] = useState([]);

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
        console.log(fileURL);
      };
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept,
    // noKeyboard: true,
    // noClick: true,
  });

  const thumbs = files.map((file) => (
    <Styled.Thumb key={file.name}>
      <Styled.ThumbInner>
        <Styled.ThumbImage src={file.preview} alt="thumb-dropzone" />
      </Styled.ThumbInner>
    </Styled.Thumb>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

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
    </>
  );
};

export default CustomeDropzone;
