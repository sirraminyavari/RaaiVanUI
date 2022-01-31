import { memo } from 'react';
import {
  FaFileCsv,
  FaFileAlt,
  FaFilePdf,
  FaFileArchive,
  FaFileAudio,
  FaFileCode,
  FaFileExcel,
  FaFileImage,
  FaFilePowerpoint,
  FaFileVideo,
  FaFileWord,
} from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { BsFileEarmarkText } from 'react-icons/bs';

/**
 * @typedef PropType
 * @type {Object}
 * @property {('svc' | 'pdf' | 'archive' | 'audio' | 'code' | 'excel' | 'jpg' | 'png' | 'powerPoint' | 'video' | 'word' | 'upload' | 'html')} format - The radius of the avatar's circule.
 * @property {Boolean} fill - Icon is fill or outlined?.
 */

/**
 *  @description Renders an File Formait Icon.
 * @component
 * @param {PropType} props -Props that pass to File.
 */
const FilesFormatIcon = (props) => {
  const { format, fill, ...rest } = props;
  switch (format) {
    case 'svc':
      return <FaFileCsv {...rest} />;

    case 'pdf':
      return <FaFilePdf {...rest} />;

    case 'archive':
      return <FaFileArchive {...rest} />;

    case 'audio':
      return <FaFileAudio {...rest} />;

    case 'code':
      return <FaFileCode {...rest} />;

    case 'excel':
      return <FaFileExcel {...rest} />;

    case 'jpg':
      return <FaFileImage {...rest} />;

    case 'png':
      return <FaFileImage {...rest} />;

    case 'html':
      return <FaFileAlt {...rest} />;

    case 'powerPoint':
      return <FaFilePowerpoint {...rest} />;

    case 'video':
      return <FaFileVideo {...rest} />;

    case 'word':
      return <FaFileWord {...rest} />;

    case 'upload':
      return <IoDocumentTextOutline {...rest} />;

    default:
      return !!fill ? <FaFileAlt {...rest} /> : <BsFileEarmarkText {...rest} />;
  }
};

export default memo(FilesFormatIcon);
