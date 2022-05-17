import GroupSelectInput from './GroupSelectInput';
import styled from 'styled-components';
import produce from 'immer';

const UserTypeMainSetting = ({ current, setFormObjects }) => {
  const { GroupSelect, Groups } = current?.data?.Info || {};

  const handleSelectedStateChange = (groups) => {
    setFormObjects(produce((d) => {}));
  };

  return (
    <GroupSelectWrapper>
      {GroupSelect && (
        <GroupSelectInput {...{ Groups, handleSelectedStateChange }} />
      )}
    </GroupSelectWrapper>
  );
};
const GroupSelectWrapper = styled.div`
  height: 3rem;
  width: 100%;
`;
export default UserTypeMainSetting;
