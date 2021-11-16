import styled from 'styled-components';
import Heading from '../../../../../../components/Heading/Heading';

const UserFullNameTitle = ({ ProfileUrl, Name, ...props }) => {
  return (
    <TitleContainer>
      {ProfileUrl && <UserProfileImg src={ProfileUrl} />}
      <UserTitle>{Name}</UserTitle>
    </TitleContainer>
  );
};

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
`;

const UserProfileImg = styled.img`
  height: 2.8rem;
  width: 2.8rem;
  border-radius: 100%;
`;

const UserTitle = styled(Heading).attrs({
  type: 'h3',
})`
  font-size: 1rem !important;
  font-weight: 500 !important;
`;

export default UserFullNameTitle;
