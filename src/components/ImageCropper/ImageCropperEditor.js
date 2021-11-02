import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import ImageIcon from 'components/Icons/ImageIcon/ImageIcon';
import Slider from 'components/Slider/Slider';
import { CV_DISTANT } from 'constant/CssVariables';
import * as Styled from './ImageCropper.styles';

/**
 * @typedef PropType
 * @type {Object}
 * @property {String} imageSrc - The image source.
 * @property {Number} aspectRatio - Image aspect ratio.
 * @property {Function} onImageCropComplete - A callback function that fires whenever crop ends.
 * @property {*} initialCroppedAreaPixels - Initial crop area.
 * @property {('round' | 'rect')} cropShape - Crop shape.
 * @property {Boolean} showGrid - Show grid or not?.
 */

/**
 *  @description Renders an image cropper component.
 * @component
 * @param {PropType} props -Props that pass to image cropper.
 */
const ImageCropperEditor = (props) => {
  const {
    imageSrc,
    aspectRatio,
    onImageCropComplete,
    initialCroppedAreaPixels,
    cropShape,
    showGrid,
  } = props;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  //! Calls on zoom(either by slider or mouse wheel).
  const handleZoomChange = (zoom) => {
    // console.log('zoom', zoom);
    setZoom(zoom);
  };

  //! Calls when image crop changes.
  const handleCropChange = (crop) => {
    // console.log('crop', crop);
    setCrop(crop);
  };

  //! Calls when crop image completed.
  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    onImageCropComplete && onImageCropComplete(croppedArea, croppedAreaPixels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Styled.ImageCropperContainer>
      <Cropper
        cropShape={cropShape}
        showGrid={showGrid}
        image={imageSrc}
        aspect={aspectRatio}
        crop={crop}
        zoom={zoom}
        onCropChange={handleCropChange}
        onCropComplete={handleCropComplete}
        onZoomChange={handleZoomChange}
        classes={{ cropAreaClassName: '' }}
        initialCroppedAreaPixels={initialCroppedAreaPixels}
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

export default ImageCropperEditor;
