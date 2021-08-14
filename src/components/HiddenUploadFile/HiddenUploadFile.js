import { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * @typedef PropType
 * @type {Object}
 * @property {array} [types] - An array of accepted file types.
 * @property {function} onFileChange - A callback that fires when user chooses a file.
 */

/**
 *  @description Renders an HiddenUploadFile component.
 * @component
 * @param {PropType} props -Props that pass to HiddenUploadFile.
 */
const HiddenUploadFile = forwardRef((props, ref) => {
  const { onFileChange, types } = props;
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
      accept={types.join()}
    />
  );
});

HiddenUploadFile.propTypes = {
  types: PropTypes.array,
  onFileChange: PropTypes.func,
};

HiddenUploadFile.defaultProps = {
  types: ['image/png', ' image/jpeg'],
};

export default HiddenUploadFile;
