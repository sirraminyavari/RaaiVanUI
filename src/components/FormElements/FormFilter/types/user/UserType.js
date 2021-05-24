import { useState, useEffect } from 'react';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import ItemProducer from 'components/ItemProducer/ItemProducer';
import APIHandler from 'apiHelper/APIHandler';
import * as Styled from '../types.styles';

const UserType = (props) => {
  const { onChange, data } = props;
  const { MultiSelect } = JSON.parse(decodeBase64(data.Info));
  const getUsersAPI = new APIHandler('UsersAPI', 'GetUsers');
  const [items, setItems] = useState([]);

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
    setItems(users);
  };

  useEffect(() => {
    const id = data.ElementID;
    const userIds = items.map((user) => user.id);
    const JSONValue = { GuidItems: userIds };

    onChange({
      id,
      value: {
        GuidItems: !items.length ? null : userIds.join('|'),
        Data: items,
        JSONValue: !items.length ? null : JSONValue,
      },
    });
  }, [items]);

  return (
    <Styled.UserContainer>
      <Styled.UserTitle>{decodeBase64(data.Title)}</Styled.UserTitle>
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
