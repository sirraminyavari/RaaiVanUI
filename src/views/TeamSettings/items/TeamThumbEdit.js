import * as Styled from './TeamThumbEditStyle';
import { lazy, useRef, useState } from 'react';
import EditIcon from '../../../components/Icons/EditIcons/Edit';
import ImageCropperModal from './ImageCropperModal';
import { validateFileUpload } from '../../../helpers/helpers';
import { readFile } from '../../../components/ImageCropper/cropUtils';

const EditModal = lazy(() =>
  import(
    /* webpackChunkName: "edit-profile-image-modal"*/ 'components/ImageCropper/ImageCropperModal'
  )
);

const allowedTypes = ['image/png', 'image/jpeg'];

const TeamThumbEdit = ({ children, upload, ...props }) => {
  const fileInput = useRef(null);
  const [cropperInfo, setCropperInfo] = useState({
    show: false,
    file: null,
    aspectRatio: 1 / 1,
  });

  const handleFileChange = async (e) => {
    const files = e.target.files;

    if (files.length === 1 && validateFileUpload(files, allowedTypes)) {
      const file = await readFile(files[0]);
      setCropperInfo((current) => ({ ...current, file, show: true }));
    } else {
    }
  };

  const uploadCroppedImage = (croppedArea) => {
    const fd = new FormData();
    fd.append('file', cropperInfo.file);

    fd.append('x', croppedArea?.x || croppedArea?.X);
    fd.append('y', croppedArea?.y || croppedArea?.Y);
    fd.append('w', croppedArea?.width || croppedArea?.Width);
    fd.append('h', croppedArea?.width || croppedArea?.Width);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    upload(fd, config);
  };

  const onModalClose = () => {
    setCropperInfo((current) => ({
      ...current,
      file: null,
      show: false,
    }));

    fileInput.current.value = '';
  };
  return (
    <Styled.ThumbContainer>
      <ImageCropperModal
        {...cropperInfo}
        onModalClose={onModalClose}
        saveCropArea={uploadCroppedImage}
      />
      {children}
      <Styled.EditButton onClick={() => fileInput.current.click()}>
        <EditIcon />
      </Styled.EditButton>
      <input
        type="file"
        ref={fileInput}
        hidden
        onChange={(e) => handleFileChange(e)}
        multiple={false}
      />
    </Styled.ThumbContainer>
  );
};
export default TeamThumbEdit;
