import styled from 'styled-components';
import Heading from '../../../../../../components/Heading/Heading';

const UserFullNameTitle = ({
  ImageURL,
  FullName,
  editable,
  column = true,
  ...props
}) => {
  return (
    <TitleContainer>
      {ImageURL && <UserProfileImg src={ImageURL} />}
      <UserTitle>{FullName}</UserTitle>
    </TitleContainer>
  );
  //   : (
  //   <ColumnContainer>
  //     {ImageURL && <UserProfileImg src={ImageURL} />}
  //     <UserTitle height={'1.5rem'}>{FullName}</UserTitle>
  //   </ColumnContainer>
  // );
};

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  ${({ height }) => height && `height: ${height}`}
`;

export default UserFullNameTitle;
