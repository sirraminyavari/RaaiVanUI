import styled from 'styled-components';
import { CV_GRAY, TCV_DEFAULT } from 'constant/CssVariables';
import { useState } from 'react';

const UserRoleItemToSelect = ({ onClick, ImageURL, FullName, ...props }) => {
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    setSelected(!selected);
    if (onClick) {
      onClick(selected);
    }
  };

  return (
    <RowContainer onClick={handleClick}>
      <Icon src={ImageURL} />
      <RowTitle highlight={selected}>{FullName}</RowTitle>
    </RowContainer>
  );
};
const RowContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 3rem;
  padding: 0.5rem 0;
  gap: 1rem;
  width: 100%;
  cursor: pointer;
`;
const RowTitle = styled.div`
  height: 2rem;
  line-height: 2rem;
  color: ${(props) => (props?.highlight ? TCV_DEFAULT : CV_GRAY)};
  font-size: 1rem;
  user-select: none;
`;
const Icon = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
`;

export default UserRoleItemToSelect;
