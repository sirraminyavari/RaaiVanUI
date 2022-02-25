import { Container } from './SelectObjectStyle';
import SelectObjectDropDown from './SelectObjectDropDown';
import { useRef, useState } from 'react';
import { usePrivacyProvider } from '../PrivacyContext';
// import useModal from 'hooks/useModal';

const SelectObject = ({ type }) => {
  const [createNewGroup, setCreateNewGroup] = useState(false);

  const onNewGroupModalOpen = () => {
    setCreateNewGroup(true);
  };

  const onGroupModalOpen = () => {};

  const onUserModalOpen = () => {};

  return (
    <Container>
      <SelectObjectDropDown
        {...{ type, onNewGroupModalOpen, onGroupModalOpen, onUserModalOpen }}
      />
    </Container>
  );
};
export default SelectObject;
