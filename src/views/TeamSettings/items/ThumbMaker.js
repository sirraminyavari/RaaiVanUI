import * as Styled from './ThumbMakerStyle';
import { useRef } from 'react';
import EditIcon from '../../../components/Icons/EditIcons/Edit';

const ThumbMaker = ({ children, upload, ...props }) => {
  const fileInput = useRef(null);

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    const fd = new FormData();
    upload(fd);
  };
  return (
    <Styled.ThumbContainer>
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
export default ThumbMaker;
