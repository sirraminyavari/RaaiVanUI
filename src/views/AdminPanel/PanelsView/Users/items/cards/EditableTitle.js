import { useRef, useState } from 'react';
import useOnClickOutside from '../../../../../../hooks/useOnClickOutside';
import styled from 'styled-components';
import { CV_DISTANT } from '../../../../../../constant/CssVariables';

const EditableTitle = ({ value, onConfirm }) => {
  const editEl = useRef();
  const [title, setTitle] = useState(value);
  const [editMode, setEditMode] = useState(false);

  useOnClickOutside(editEl, async () => {
    await handleConfirm();
  });

  const handleConfirm = async () => {
    if (editMode) {
      setEditMode(false);
      await onConfirm(value);
    }
  };

  const handleEnterKey = async (e) => {
    if (e.key === 'Enter') {
      await handleConfirm();
    }
  };

  return (
    <TitleContainer ref={editEl}>
      {!editMode && (
        <Title onDoubleClick={(e) => setEditMode(!editMode)}>{title}</Title>
      )}
      {editMode && (
        <EditModTitle
          contentEditable="true"
          onKeyPress={(e) => handleEnterKey(e)}>
          {title}
        </EditModTitle>
      )}
    </TitleContainer>
  );
};

const TitleContainer = styled.div`
  user-select: none;
`;

const Title = styled.div`
  font-size: 0.8rem;
  user-select: none;
  padding: 0.2rem 0;
  height: 2rem;
  line-height: 2rem;
  color: black;
  font-weight: 500;
`;

const EditModTitle = styled(Title)`
  color: ${CV_DISTANT};
  outline: none;
  border-bottom: 1px solid ${CV_DISTANT};
`;
export default EditableTitle;
