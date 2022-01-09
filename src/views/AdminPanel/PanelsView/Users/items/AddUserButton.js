import styled from 'styled-components';
import UserPlusIcon from 'components/Icons/UserPlusIcon/UserPlus';

const BtnContainer = styled.div.attrs({
  className: 'rv-bg-color-default',
})`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3rem;
  width: 16rem;
  color: white;
  padding: 0 1rem;
  border-radius: 0.8rem;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
`;

const AddUserButton = ({ children, ...props }) => {
  return (
    <BtnContainer {...props}>
      <UserPlusIcon size={20} />
      <div>{children}</div>
    </BtnContainer>
  );
};
export default AddUserButton;
