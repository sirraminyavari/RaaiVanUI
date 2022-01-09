import React, { useEffect, useRef, useState } from 'react';
import useOnClickOutside from 'hooks/useOnClickOutside';
import styled from 'styled-components';
import { CV_DISTANT } from 'constant/CssVariables';

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
      if (title !== value) {
        await onConfirm(title);
      }
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
        <Title onDoubleClick={(e) => setEditMode(!editMode)}>{value}</Title>
      )}
      {editMode && (
        <EditableElement onChange={(e) => setTitle(e)}>
          <EditModTitle onKeyPress={(e) => handleEnterKey(e)}>
            {value}
          </EditModTitle>
        </EditableElement>
      )}
    </TitleContainer>
  );
};
const EditableElement = (props) => {
  const { onChange } = props;
  const element = useRef();
  let elements = React.Children.toArray(props.children);
  if (elements.length > 1) {
    throw Error("Can't have more than one child");
  }
  const onMouseUp = () => {
    const value = element.current?.value || element.current?.innerText;
    onChange(value);
  };
  useEffect(() => {
    const value = element.current?.value || element.current?.innerText;
    onChange(value);
  }, []);
  elements = React.cloneElement(elements[0], {
    contentEditable: true,
    suppressContentEditableWarning: true,
    ref: element,
    onKeyUp: onMouseUp,
  });
  return elements;
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
