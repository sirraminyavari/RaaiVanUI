import { forwardRef } from 'react';

const HiddenUploadFile = forwardRef((props, ref) => {
  const { onFileChange } = props;
  const handleInputChange = (e) => {
    onFileChange && onFileChange(e);
  };
  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  return (
    <input
      ref={ref}
      type="file"
      style={{ display: 'none' }}
      onChange={handleInputChange}
      onClick={handleInputClick}
      accept="image/png, image/jpeg"
    />
  );
});

export default HiddenUploadFile;
