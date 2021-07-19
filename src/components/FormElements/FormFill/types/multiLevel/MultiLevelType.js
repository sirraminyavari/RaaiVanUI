/**
 * Renders multi-level fill form.
 */
import { useState, useEffect } from 'react';
import { decodeBase64 } from 'helpers/helpers';
import Button from 'components/Buttons/Button';
import APIHandler from 'apiHelper/APIHandler';
import Select from 'components/Inputs/select/Select';

const MultiLevelType = (props) => {
  const { levels, nodes, onSelect } = props;
  const getChildNodesAPI = new APIHandler('CNAPI', 'GetChildNodes');
  const initialState = levels.reduce(
    (levelsObject, currentLevel, index, self) => {
      return {
        ...levelsObject,
        [currentLevel]: {
          currentLevel,
          nextLevel: self[index + 1] ?? null,
          prevLevel: !!index ? self[index - 1] : null,
          value: null,
          options: !!index ? [] : nodes,
        },
      };
    },
    {}
  );
  const [levelValues, setLevelValues] = useState(() => initialState);

  //! If true, Enables the accept button.
  const isCompleted = Object.values(levelValues).every(
    (item) => item.value !== null
  );

  //! Calls on input change.
  const handleChange = (e, level) => {
    //! Value that user selected.
    const selectedValue = e.target.value;
    //! index of current level in levles array.
    const indexOfLevel = levels.indexOf(level);
    //! Array of next levels.
    const nextLevels = levels.slice(indexOfLevel + 1);
    //! Next levels that their value must set to default.
    const nextLevelsValue = nextLevels.reduce((nextObjects, level) => {
      return {
        ...nextObjects,
        [level]: { ...levelValues[level], value: null, options: [] },
      };
    }, {});

    if (!!selectedValue) {
      const levelValue = levelValues[level].options.find(
        (item) => decodeBase64(item.Name) === selectedValue
      );

      if (
        levelValues[level].value &&
        decodeBase64(levelValues[level].value.Name) !== selectedValue
      ) {
        setLevelValues((oldValues) => ({
          ...oldValues,
          [level]: { ...levelValues[level], value: levelValue },
          ...nextLevelsValue,
        }));
      } else {
        setLevelValues((oldValues) => ({
          ...oldValues,
          [level]: { ...levelValues[level], value: levelValue },
        }));
      }
    } else {
      const currentLevelValue = {
        [level]: { ...levelValues[level], value: null },
      };

      setLevelValues((oldValues) => ({
        ...oldValues,
        ...currentLevelValue,
        ...nextLevelsValue,
      }));
    }
  };

  const handleOnAccept = () => {
    if (isCompleted) {
      onSelect(levelValues);
    }
  };

  useEffect(() => {
    const currentLevel = Object.values(levelValues).filter(
      (item) => item.value === null
    )[0];
    const prevLevel = Object.values(levelValues)
      .filter((item) => item.value !== null)
      .pop();

    if (currentLevel && !currentLevel.options.length) {
      getChildNodesAPI.fetch(
        { NodeID: prevLevel.value.NodeID },
        (response) => {
          console.log(response);
          setLevelValues((oldValues) => ({
            ...oldValues,
            [currentLevel.currentLevel]: {
              ...currentLevel,
              options: response.Nodes,
            },
          }));
        },
        (error) => console.log(error)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelValues]);

  return (
    <div>
      {levels.map((level, key) => {
        const options = levelValues[level].options.map((option) => ({
          value: decodeBase64(option.Name),
          title: decodeBase64(option.Name),
        }));
        const display = !!levelValues[level].options.length ? 'block' : 'none';
        return (
          <div
            key={key}
            onChange={(e) => handleChange(e, level)}
            style={{
              margin: '10px',
              display,
            }}>
            <label
              style={{
                width: '100px',
                minWidth: '100px',
                display: 'inline-block',
              }}
              htmlFor={level}>
              {level}:
            </label>
            <Select
              name={level}
              options={options}
              defaultOption="انتخاب کنید"
            />
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
