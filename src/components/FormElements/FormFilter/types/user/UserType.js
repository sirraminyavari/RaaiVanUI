import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import ItemProducer from 'components/ItemProducer/ItemProducer';
import APIHandler from 'apiHelper/APIHandler';
import * as Styled from '../types.styles';

const UserType = (props) => {
  const { onChange, data } = props;
  const { MultiSelect } = JSON.parse(decodeBase64(data.Info));
  const getUsersAPI = new APIHandler('UsersAPI', 'GetUsers');

  const fetchUsers = (searchText) => {
    return new Promise((resolve, reject) => {
      getUsersAPI.fetch(
        {
          SearchText: encodeBase64(searchText),
          Count: 20,
        },
        (response) => {
          const users = response.Users.map((user) => ({
            id: user.UserID,
            value: decodeBase64(user.FullName),
          }));
          resolve(users);
        },
        (error) => reject(error)
      );
    });
  };

  const handleSelectUsers = (users) => {
    const value = { GuidItems: users.map((user) => user.id) };
    onChange({
      type: 'User',
      value: users.length ? value : null,
    });
  };

  return (
    <Styled.UserContainer>
      <Styled.UserTitle>{data.Title}</Styled.UserTitle>
      <ItemProducer
        type="autosuggest"
        fetchItems={fetchUsers}
        isDragDisabled={true}
        onItems={handleSelectUsers}
        style={{ width: '100%' }}
      />
    </Styled.UserContainer>
  );
};

export default UserType;
