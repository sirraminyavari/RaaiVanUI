import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { CV_DISTANT, CV_GRAY, CV_RED, TCV_WARM } from 'constant/CssVariables';
import styled from 'styled-components';

export const UserSelectInputFieldSelect = styled.div`
  // cursor: pointer;
  // display: flex;
  // flex-direction: row;

  display: grid;
  list-style: none;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  grid-column-gap: 0;
  grid-row-gap: 10px;
  justify-content: center;
  width: 100%;
`;
UserSelectInputFieldSelect.displayName = 'UserSelectInputFieldSelect';

export const UserSelectInputFieldMaintainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;
UserSelectInputFieldMaintainer.displayName = 'UserSelectInputFieldMaintainer';

export const UserSelectInputFieldSelectedUser = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-style: solid;
  border-width: 0.03rem;
  border-radius: 0.5rem;
  border-color: ${CV_DISTANT};
  margin: 0 0.25rem 0 0.25rem;
  justify-content: space-between;
  height: 3rem;

  & > a {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`;
UserSelectInputFieldSelectedUser.displayName =
  'UserSelectInputFieldSelectedUser';

export const UserSelectInputFieldUserName = styled.div`
  margin: 0 0.5rem 0 0.5rem;
  color: ${TCV_WARM};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 8rem;
`;
UserSelectInputFieldUserName.displayName = 'UserSelectInputFieldUserName';

export const UserSelectInputFieldCustomCloseIcon = styled(CloseIcon)`
  color: ${CV_DISTANT};
  cursor: pointer;
  margin-inline: 1rem;
  :hover {
    color: ${CV_RED};
  }
`;
UserSelectInputFieldCustomCloseIcon.displayName =
  'UserSelectInputFieldCustomCloseIcon';

export const UserSelectInputFieldAvatar = styled.img`
  width: 2rem;
  aspect-ratio: 1;
  height: 2rem;
  border-radius: 2rem;
  background-color: ${CV_GRAY};
  margin: 0.3rem;
  align-items: center;
  justify-content: center;
`;
UserSelectInputFieldAvatar.displayName = 'UserSelectInputFieldAvatar';
