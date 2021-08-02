import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
// import { getOrientation } from 'get-orientation/browser';
import ImageIcon from 'components/Icons/ImageIcon/ImageIcon';
import Slider from 'components/Slider/Slider';
import { CV_DISTANT } from 'constant/CssVariables';
import * as Styled from 'views/Profile/Profile.styles';

const ImageCropper = ({ imageSrc, aspectRatio, onImgaeCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  //! Calls on zoom(either by slider or mouse wheel).
  const handleZoomChange = (zoom) => {
    setZoom(zoom);
  };

  //! Calls when image crop changes.
  const handleCropChange = (crop) => {
    setCrop(crop);
  };

  //! Calls when crop image completed.
  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    onImgaeCropComplete && onImgaeCropComplete(croppedArea, croppedAreaPixels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Styled.ImageCropperContainer>
      <Cropper
        cropShape="round"
        showGrid={false}
        image={imageSrc}
        aspect={aspectRatio}
        crop={crop}
        zoom={zoom}
        onCropChange={handleCropChange}
        onCropComplete={handleCropComplete}
        onZoomChange={handleZoomChange}
        classes={{ cropAreaClassName: '' }}
      />
      <Styled.SliderWrapper>
        <ImageIcon size={32} color={CV_DISTANT} />
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e, zoom) => handleZoomChange(zoom)}
        />
        <ImageIcon size={22} color={CV_DISTANT} />
      </Styled.SliderWrapper>
    </Styled.ImageCropperContainer>
  );
};

export default ImageCropper;
