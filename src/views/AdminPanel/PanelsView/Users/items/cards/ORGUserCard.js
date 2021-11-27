import * as Styled from '../ListStyled';
import UserFullNameTitle from './UserFullNameTitle';
import ResetPassword from './ResetPassword';

const ORGUserCard = ({
  FirstName,
  LastName,
  FullName,
  UserName,
  ImageURL,
  ...props
}) => {
  const userTitle = (
    <UserFullNameTitle ImageUrl={ImageURL} FullName={FullName} />
  );

  return (
    <>
      <Styled.ListBodyItem width={25}>{userTitle}</Styled.ListBodyItem>

      <Styled.ListBodyItem width={25}>{UserName}</Styled.ListBodyItem>

      <Styled.ListBodyItem width={20}></Styled.ListBodyItem>

      <Styled.ListBodyItem width={10}></Styled.ListBodyItem>

      <Styled.ListBodyItem width={10}>
        <ResetPassword
          render={
            <UserFullNameTitle
              column={true}
              ImageUrl={ImageURL}
              FullName={FullName}
            />
          }
        />
      </Styled.ListBodyItem>

      <Styled.ListBodyItem width={10}></Styled.ListBodyItem>
    </>
  );
};
export default ORGUserCard;
