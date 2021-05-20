import { decodeBase64 } from 'helpers/helpers';
import ItemProducer from 'components/ItemProducer/ItemProducer';

const UserType = (props) => {
  const { onChange, data } = props;
  const { MultiSelect } = JSON.parse(decodeBase64(data.Info));

  const fetchUsers = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          { id: '1', value: 'user one' },
          { id: '2', value: 'user two' },
          { id: '3', value: 'user three' },
          { id: '4', value: 'user four' },
          { id: '5', value: 'user five' },
        ]);
      }, 2000);
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
    <div style={{ width: '100%' }}>
      <div>{data.Title}</div>
      <ItemProducer
        type="autosuggest"
        fetchItems={fetchUsers}
        isDragDisabled={true}
        onItems={handleSelectUsers}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default UserType;
