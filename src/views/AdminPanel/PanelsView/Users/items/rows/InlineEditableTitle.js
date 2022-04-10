import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { CV_DISTANT } from 'constant/CssVariables';
import useWindowContext from 'hooks/useWindowContext';
const InlineEditableTitle = React.forwardRef(
  ({ IsEditable = false, children, onChange, ...props }, ref) => {
    const { RV_RTL } = useWindowContext();
    const [value, setValue] = useState(children);
    const [editMode, setEditMode] = useState(false);
    const titleRef = useRef();
    useOnClickOutside(titleRef, async () => {
      if (editMode) {
        setEditMode(false);
        await onChange(value);
      }
    });

    return (
      <TitleContainer
        ref={titleRef}
        onDoubleClick={(e) => setEditMode(!editMode)}
      >
        {!editMode && <div>{value}</div>}
        {editMode && (
          <InputField
            rtl={RV_RTL}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}
      </TitleContainer>
    );
  }
);

const TitleContainer = styled.div`
  user-select: none;
`;
const InputField = styled.input`
  border: none;
  outline: none;
  color: ${CV_DISTANT};
  border-bottom: 1px solid ${CV_DISTANT};
  background-color: transparent;
  padding: 0.1rem 0;
  width: fit-content;
  direction: ltr;
  ${({ rtl }) => (rtl ? 'text-align: right' : 'text-align: left')}
`;

export default InlineEditableTitle;
