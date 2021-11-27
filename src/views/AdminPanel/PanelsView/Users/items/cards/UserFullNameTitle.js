import styled from 'styled-components';
import Heading from '../../../../../../components/Heading/Heading';
import { CV_GRAY_LIGHT } from '../../../../../../constant/CssVariables';

const UserFullNameTitle = ({
  ImageURL,
  FullName,
  editable,
  column = false,
  ...props
}) => {
  return !column ? (
    <TitleContainer>
      {ImageURL && <UserProfileImg src={ImageURL} />}
      <UserTitle>{FullName}</UserTitle>
    </TitleContainer>
  ) : (
    <ColumnContainer>
      {ImageURL && <UserProfileImg src={ImageURL} />}
      <UserTitleColumn height={'1.5rem'}>{FullName}</UserTitleColumn>
    </ColumnContainer>
  );
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
  height: 5rem;
`;

const UserTitleColumn = styled.div`
  font-weight: 500;
  font-size: 1rem;
  height: 1.6rem;
  line-height: 1.6rem;
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
