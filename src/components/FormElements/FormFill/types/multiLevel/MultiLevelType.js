import { useEffect, useState } from 'react';
import { decodeBase64 } from 'helpers/helpers';
import Button from 'components/Buttons/Button';

const MultiLevelType = (props) => {
  const { levels, nodes, onSelect } = props;
  const [levelValues, setLevelValues] = useState(
    levels.reduce((state, prev) => {
      return { ...state, [prev]: null };
    }, {})
  );

  const isCompleted = Object.values(levelValues).every((item) => item !== null);

  const options = [
    [
      ...new Set(
        nodes
          .map((node) => decodeBase64(node.Name))
          .filter((name) => name === 'کرمانشاه' || name === 'تهران')
      ),
    ],
    [
      ...nodes
        .map((node) => decodeBase64(node.Name))
        .filter((name) => name !== 'کرمانشاه' && name !== 'تهران'),
    ],
  ];

  const handleChange = (e, level) => {
    const value = e.target.value;
    setLevelValues((oldValues) => ({ ...oldValues, [level]: value }));
  };

  const handleOnAccept = () => {
    if (isCompleted) {
      onSelect(levelValues);
    }
  };

  return (
    <div>
      {levels.map((level, key) => {
        return (
          <div
            key={key}
            onChange={(e) => handleChange(e, level)}
            style={{ margin: '10px' }}>
            <label
              style={{
                width: '100px',
                minWidth: '100px',
                display: 'inline-block',
              }}
              htmlFor={level}>
              {level}:{' '}
            </label>
            <input list={`${level}-list`} name={level} id={level} />
            <datalist id={`${level}-list`}>
              {options[key].map((option) => (
                <option value={option} />
              ))}
            </datalist>
          </div>
        );
      })}
      <Button onClick={handleOnAccept} disable={!isCompleted}>
        تایید
      </Button>
    </div>
  );
};

export default MultiLevelType;
