/**
 * Renders a user filter.
 */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import ItemProducer from 'components/ItemProducer/ItemProducer';
import APIHandler from 'apiHelper/APIHandler';
import * as Styled from '../types.styles';
import useWindow from 'hooks/useWindowContext';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Object} value - Value of component.
 * @property {Object} data - Meta data needed for component.
 * @property {function} onChange - A callback function that fires when value changes.
 */

/**
 *  @description Renders a user type component.
 * @component
 * @param {PropType} props -Props that are passed to component.
 */
const UserType = (props) => {
  const { onChange, data, value } = props;
  const { ElementID, Title } = data; //! Meta data to feed component.
  const getUsersAPI = new APIHandler('UsersAPI', 'GetUsers');

  // const { MultiSelect } = JSON.parse(decodeBase64(Info));
  const [items, setItems] = useState([]);
  const [resetValue, setResetValue] = useState(null);
  const { GlobalUtilities } = useWindow();

  //! Fetch users based on search text.
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
    const id = ElementID;
    const userIds = items.map((user) => user.id);
    const JSONValue = { GuidItems: userIds };

    //! Send back value to parent on select.
    onChange({
      id,
      value: {
        Type: 'user',
        GuidItems: !items.length ? null : userIds.join('|'),
        Data: items,
        JSONValue: !items.length ? null : JSONValue,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    if (value === undefined) {
      setResetValue(GlobalUtilities.random());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Styled.FilterContainer>
      <Styled.FilterTitle>{decodeBase64(Title)}</Styled.FilterTitle>
      <ItemProducer
        type="autosuggest"
        fetchItems={fetchUsers}
        isDragDisabled={true}
        onItems={handleSelectUsers}
        style={{ width: '100%' }}
        resetMe={resetValue}
      />
    </Styled.FilterContainer>
  );
};

UserType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

UserType.displayName = 'FilterUserComponent';

export default UserType;
