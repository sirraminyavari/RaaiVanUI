import styled from 'styled-components';
import * as Styled from '../ListStyled';
import UserFullNameTitle from './UserFullNameTitle';
import ToggleButton from '../../../../../../components/Buttons/Toggle/Toggle';
const TeamBasedUserCard = ({ ProfileUrl, Name, Email, IsAdmin, ...props }) => {
  return (
    <>
      <Styled.ListBodyItem grow={1.3}>
        <UserFullNameTitle ProfileUrl={ProfileUrl} Name={Name} />
      </Styled.ListBodyItem>

      <Styled.ListBodyItem grow={1.5}>{Email}</Styled.ListBodyItem>

      <Styled.ListBodyItem grow={1.2}>{Email}</Styled.ListBodyItem>

      <Styled.ListBodyItem>
        <ToggleButton initialCheck={IsAdmin} />
      </Styled.ListBodyItem>

      <Styled.ListBodyItem>{/*{Email}*/}</Styled.ListBodyItem>

      <Styled.ListBodyItem grow={1.5}>{Email}</Styled.ListBodyItem>
    </>
  );
};
export default TeamBasedUserCard;
