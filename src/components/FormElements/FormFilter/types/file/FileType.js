import * as Styled from '../types.styles';
import { encodeBase64 } from 'helpers/helpers';
import ItemProducer from 'components/ItemProducer/ItemProducer';

const FileType = (props) => {
  const { onChange, data } = props;

  const handleOnItemSelect = (items) => {
    const textItems = items.map((item) => encodeBase64(item));
    const value = {
      TextItems: textItems,
      Exact: false,
      Or: false,
    };

    onChange({
      type: 'File',
      value: textItems.length ? value : null,
    });
  };

  return (
    <Styled.FileContainer>
      <Styled.FileTitle>{data.Title}</Styled.FileTitle>
      <ItemProducer
        isDragDisabled={true}
        onItems={handleOnItemSelect}
        style={{ width: '100%' }}
      />
    </Styled.FileContainer>
  );
};

export default FileType;
