import FormCell from 'components/FormElements/FormFill/FormCell';
import FileFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import CustomDropzone from 'components/CustomDropzone/CustomDropzone';
import { CV_GRAY } from 'constant/CssVariables';
import useWindow from 'hooks/useWindowContext';
import * as Styled from './FileField.styles';
import FileShowCell from './FileShowCell';

const FileField = (props) => {
  const { GlobalUtilities } = useWindow();

  const {
    value,
    decodeInfo,
    decodeTitle,
    onAnyFieldChanged,
    elementId,
    type,
    ...rest
  } = props;

  const infoJSON = GlobalUtilities.to_json(decodeInfo) || {};

  console.log({ props, infoJSON }, 'file field');

  const handleUploadFile = (event) => {
    console.log(event);
    // onAnyFieldChanged(elementId, event, type )
  };

  return (
    <FormCell
      iconComponent={<FileFormatIcon color={CV_GRAY} />}
      title={decodeTitle}
      {...rest}>
      <Styled.FilesContainer>
        {[1, 2].map((item) => (
          <FileShowCell key={item} />
        ))}
        <CustomDropzone
          maxFiles={1} //! (infoJSON?.MaxCount)
          maxTotalSize={1} //! (infoJSON?.TotalSize)
          maxEachSize={1} //! (infoJSON?.MaxSize)
          accept={['image/*']} //! (infoJSON?.AllowedExtensions)
          onUpload={handleUploadFile}
          placeholders={{
            main: 'فایل را بکشید و رها کنید یا کلیک کنید',
            dragging: 'اینجا رها کنید...',
          }}
        />
      </Styled.FilesContainer>
    </FormCell>
  );
};

export default FileField;
