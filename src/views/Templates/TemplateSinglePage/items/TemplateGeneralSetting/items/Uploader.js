import styled from 'styled-components';
import { CV_DISTANT } from 'constant/CssVariables';
import { FLEX_CCC } from 'constant/StyledCommonCss';
import { BsFileEarmarkArrowUp } from 'react-icons/all';
import { useState, useCallback, useEffect, Suspense } from 'react';
import { useDropzone } from 'react-dropzone';
import ImageCropModal from 'components/ImageCropper/ImageCropperModal';
import { readFile } from 'components/ImageCropper/cropUtils';
import ModalFallbackLoader from 'components/Loaders/ModalFallbackLoader/ModalFallbackLoader';

const Uploader = ({ uploadID, setOpenStatus, onDone }) => {
  const [modalInfo, setModalInfo] = useState({
    isShown: false,
    title: '',
    aspect: 1,
    file: null,
    imgSrc: null,
  });

  useEffect(() => {
    setOpenStatus && setOpenStatus(modalInfo.isShown);
  }, [modalInfo, setOpenStatus]);

  const onDrop = useCallback(
    (files) => {
      const file = files[0];
      const renderFile = async () => {
        const fileData = await readFile(file);
        setModalInfo({
          ...modalInfo,
          isShown: true,
          file: file,
          imgSrc: fileData,
        });
      };
      renderFile();
    },
    [modalInfo]
  );

  const onUploadDone = useCallback(
    (newImageURL) => {
      onDone(newImageURL);
      setModalInfo({ ...modalInfo, isShown: false });
    },
    [modalInfo, onDone]
  );

  useEffect(() => {
    console.log(modalInfo);
  }, [modalInfo]);
  const { getInputProps, getRootProps } = useDropzone({ onDrop });

  return (
    <>
      <Container {...getRootProps()}>
        <input {...getInputProps()} accept=".jpg,.jpeg,.png,.gif" />
        <div>
          <Icon size={36} />
        </div>
        <Message>{'برای آپلود فایل خود را درون کادر نقطه‌چین بکشید'}</Message>
      </Container>
      <Suspense fallback={<ModalFallbackLoader />}>
        <ImageCropModal
          modalProps={modalInfo}
          cropShape="round"
          showGrid={true}
          uploadType="Icon"
          uploadId={uploadID}
          onUploadDone={onUploadDone}
          onCloseModal={() => setModalInfo({ ...modalInfo, isShown: false })}
        />
      </Suspense>
    </>
  );
};

const Container = styled.div`
  ${FLEX_CCC};
  width: 100%;
  height: 10.9rem;
  border: 2px dashed ${CV_DISTANT};
  border-radius: 0.8rem;
  gap: 0.2rem;
  user-select: none;
`;

const Message = styled.div`
  font-size: 0.875rem;
  text-align: center;
  color: ${CV_DISTANT};
  font-weight: 300;
`;

const Icon = styled(BsFileEarmarkArrowUp)`
  color: ${CV_DISTANT};
`;
export default Uploader;
