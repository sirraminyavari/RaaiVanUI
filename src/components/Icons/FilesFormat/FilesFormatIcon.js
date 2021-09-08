import { memo } from 'react';
import {
  FaFileCsv,
  FaFile,
  FaFilePdf,
  FaFileArchive,
  FaFileAudio,
  FaFileCode,
  FaFileExcel,
  FaFileImage,
  FaFilePowerpoint,
  FaFileVideo,
  FaFileWord,
  FaFileUpload,
} from 'react-icons/fa';

/**
 * @typedef PropType
 * @type {Object}
 * @property {('svc' | 'pdf' | 'archive' | 'audio' | 'code' | 'excel' | 'image' | 'powerPoint' | 'video' | 'word' | 'upload')} format - The radius of the avatar's circule.
 */

/**
 *  @description Renders an File Formait Icon.
 * @component
 * @param {PropType} props -Props that pass to File.
 */
const FilesFormatIcon = (props) => {
  switch (props.format) {
    case 'svc':
      return <FaFileCsv {...props} />;

    case 'pdf':
      return <FaFilePdf {...props} />;

    case 'archive':
      return <FaFileArchive {...props} />;

    case 'audio':
      return <FaFileAudio {...props} />;

    case 'code':
      return <FaFileCode {...props} />;

    case 'excel':
      return <FaFileExcel {...props} />;

    case 'image':
      return <FaFileImage {...props} />;

    case 'powerPoint':
      return <FaFilePowerpoint {...props} />;

    case 'video':
      return <FaFileVideo {...props} />;

    case 'word':
      return <FaFileWord {...props} />;

    case 'upload':
      return <FaFileUpload {...props} />;

    default:
      return <FaFile {...props} />;
  }
};

export default memo(FilesFormatIcon);
