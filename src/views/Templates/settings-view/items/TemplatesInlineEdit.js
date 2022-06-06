import React, { useEffect, useRef, useState } from 'react';
import useOnClickOutside from 'hooks/useOnClickOutside';
import styled from 'styled-components';
import { CV_DISTANT, CV_GRAY_DARK, TCV_WARM } from 'constant/CssVariables';
import { FLEX_RCA } from 'constant/StyledCommonCss';

const TemplateInlineEdit = ({
  value,
  onConfirm,
  color = CV_GRAY_DARK,
  fontSize = '1rem',
  onModeChange,
  children,
}) => {
  const editEl = useRef();
  const [title, setTitle] = useState(value);
  const [editMode, setEditMode] = useState(false);

  useOnClickOutside(editEl, async () => {
    await handleConfirm();
  });

  const handleConfirm = async () => {
    if (editMode) {
      setEditMode(false);
      if (title !== value && onConfirm) {
        await onConfirm(title);
      }
    }
  };

  const handleEnterKey = async (e) => {
    if (e.key === 'Enter') {
      await handleConfirm();
    }
  };

  useEffect(
    () => {
      if (onModeChange) {
        onModeChange(editMode);
      }
    } /* eslint-disable-line */,
    [editMode]
  );

  return (
    <TitleContainer ref={editEl}>
      <div>
        {!editMode && (
          <Title
            color={color}
            fontSize={fontSize}
            onDoubleClick={(e) => setEditMode(!editMode)}
          >
            {value}
          </Title>
        )}
        {editMode && (
          <EditableElement onChange={(e) => setTitle(e)}>
            <EditModTitle
              onKeyPress={(e) => handleEnterKey(e)}
              fontSize={fontSize}
            >
              {value}
            </EditModTitle>
          </EditableElement>
        )}
      </div>

      {children && <div>{children}</div>}
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
  ${FLEX_RCA};
`;

const Title = styled.div`
  font-size: ${({ fontSize }) => fontSize};
  user-select: none;
  padding: 0.2rem 0;
  height: 2.5rem;
  line-height: 2.5rem;
  color: ${({ color }) => color};
  font-weight: 600;
`;

const EditModTitle = styled(Title)`
  color: ${CV_DISTANT};
  font-size: ${({ fontSize }) => fontSize};
  font-weight: 600;
  outline: none;
  padding: 0.2rem 0;
  height: 2.5rem;
  line-height: 2.5rem;
  border-bottom: 1px solid ${CV_DISTANT};
`;
export default TemplateInlineEdit;
