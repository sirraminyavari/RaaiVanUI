/**
 * Renders a user filter.
 */ import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { decodeBase64 } from 'helpers/helpers';
import * as Styled from '../types.styles';
import useWindow from 'hooks/useWindowContext';
import UserSelectInputField from 'components/FormElements/ElementTypes/userSelect/UserSelectInputField';
import { isArray } from 'lodash';

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
  const { ElementID, Title } = data || {}; //! Meta data to feed component.

  // const { MultiSelect } = JSON.parse(decodeBase64(Info));
  const [items, setItems] = useState();
  const [resetValue, setResetValue] = useState(null);
  const { GlobalUtilities } = useWindow();

  const handleSelectUsers = useCallback(
    (selectedUser) => {
      const isItemExists =
        items && items.find((user) => user.id === selectedUser.id);
      console.log({ isItemExists, selectedUser, items });
      if (isItemExists) return;
      setItems((prevItems) => {
        if (isArray(prevItems)) return [...prevItems, selectedUser];
        return [selectedUser];
      });
    },
    [items]
  );
  const handleRemoveUsers = useCallback((selectedUser) => {
    setItems((prevItems) => {
      if (isArray(prevItems))
        return [...prevItems.filter((user) => user.id !== selectedUser.id)];
      return [selectedUser];
    });
  }, []);

  const normalizeSelectedUsers = (users) => {
    return users?.map((user) => ({
      ID: user.id,
      UserID: user.id,
      Name: user.name,
      IconURL: user.avatarUrl,
    }));
  };

  useEffect(() => {
    const id = ElementID;
    const userIds = items?.map((user) => user?.id);
    const JSONValue = { GuidItems: userIds };

    //! Send back value to parent on select.
    onChange({
      id,
      value: {
        Type: 'user',
        GuidItems: !items?.length ? null : userIds.join('|'),
        Data: items,
        JSONValue: !items?.length ? null : JSONValue,
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
      <FilterUserComponentContainer>
        <UserSelectInputField
          value={normalizeSelectedUsers(value?.Data)}
          isEditable
          onChange={handleSelectUsers}
          onRemove={handleRemoveUsers}
          save={setItems}
          isMulti
        />
      </FilterUserComponentContainer>
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

const FilterUserComponentContainer = styled.div`
  & > div {
    justify-content: flex-end;
  }
`;
